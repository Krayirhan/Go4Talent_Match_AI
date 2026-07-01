require('dotenv').config();
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const { createClient } = require('@supabase/supabase-js');

const app = Fastify({ logger: true });
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || process.env.ML_URL || 'http://localhost:5002';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://vewfghckacbdgacpnqef.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5000', 'http://localhost:3000'];

app.register(cors, {
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
});

// ── Health check ──
app.get('/health', async () => ({ status: 'ok', service: 'Go4Talent MatchAI API', port: 5001 }));

// ── Pozisyonlar ──
app.get('/api/positions', async (req, reply) => {
  const token = req.headers.authorization?.split(' ')[1];
  const client = token ? createClient(
    process.env.SUPABASE_URL || 'https://vewfghckacbdgacpnqef.supabase.co',
    process.env.SUPABASE_ANON_KEY || '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  ) : supabase;

  const { data, error } = await client.from('positions').select('*').order('created_at', { ascending: false });
  if (error) return reply.code(500).send({ error: error.message });
  return data;
});

// ── Adaylar ──
app.get('/api/candidates', async (req, reply) => {
  const token = req.headers.authorization?.split(' ')[1];
  const client = token ? createClient(
    process.env.SUPABASE_URL || 'https://vewfghckacbdgacpnqef.supabase.co',
    process.env.SUPABASE_ANON_KEY || '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  ) : supabase;

  const { data, error } = await client.from('candidates').select('*').order('created_at', { ascending: false });
  if (error) return reply.code(500).send({ error: error.message });
  return data;
});

// ── Match Score (kural tabanlı) ──
app.post('/api/match-score', async (req, reply) => {
  const { candidateSkills = [], requiredSkills = [], preferredSkills = [] } = req.body || {};
  try {
    const upstream = await fetch(`${ML_SERVICE_URL}/api/match-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_skills: candidateSkills,
        required_skills: requiredSkills,
        preferred_skills: preferredSkills,
      }),
    });
    if (upstream.ok) {
      return await upstream.json();
    }
  } catch (err) {}

  const cands = candidateSkills.map(s => s.toLowerCase());
  const req70 = requiredSkills.map(s => s.toLowerCase());
  const pref30 = preferredSkills.map(s => s.toLowerCase());
  const reqMatch = req70.length ? req70.filter(s => cands.includes(s)).length / req70.length : 0;
  const prefMatch = pref30.length ? pref30.filter(s => cands.includes(s)).length / pref30.length : 0;
  const score = Math.max(1, Math.round(reqMatch * 70 + prefMatch * 30));
  return {
    score,
    required: { matched: req70.filter(s => cands.includes(s)), total: req70.length },
    preferred: { matched: pref30.filter(s => cands.includes(s)), total: pref30.length }
  };
});

app.get('/api/candidate-status-history', async (req, reply) => {
  const token = req.headers.authorization?.split(' ')[1];
  const client = token ? createClient(
    process.env.SUPABASE_URL || 'https://vewfghckacbdgacpnqef.supabase.co',
    process.env.SUPABASE_ANON_KEY || '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  ) : supabase;

  const { data, error } = await client.from('candidate_status_history').select('*').order('changed_at', { ascending: true });
  if (error) return reply.code(500).send({ error: error.message });
  return data;
});

// ── Ön Görüşme ──
app.get('/api/interview/:candidateId', async (req, reply) => {
  const { candidateId } = req.params;
  const { data: cand } = await supabase.from('candidates').select('*, positions(title, required_skills, preferred_skills)').eq('id', candidateId).single();
  if (!cand) return reply.code(404).send({ error: 'Aday bulunamadı' });
  const { data: questions } = await supabase.from('interview_questions').select('*').eq('position_id', cand.position_id).order('order_index');
  return { candidate: cand, questions: questions || [] };
});

app.post('/api/interview/:candidateId/submit', async (req, reply) => {
  const { candidateId } = req.params;
  const { answers } = req.body || {};
  const { data: cand } = await supabase.from('candidates').select('position_id').eq('id', candidateId).single();
  if (!cand) return reply.code(404).send({ error: 'Aday bulunamadı' });
  const { error } = await supabase.from('interview_responses').upsert({
    id: `resp_${candidateId}`,
    candidate_id: candidateId,
    position_id: cand.position_id,
    answers,
    completed_at: new Date().toISOString()
  });
  if (error) return reply.code(500).send({ error: error.message });
  await supabase.from('candidates').update({ status: 'mulakat' }).eq('id', candidateId);
  return { success: true };
});

// ── Bildirimler ──
app.get('/api/notifications', async (req, reply) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return reply.code(401).send({ error: 'Unauthorized' });
  const client = createClient(
    process.env.SUPABASE_URL || 'https://vewfghckacbdgacpnqef.supabase.co',
    process.env.SUPABASE_ANON_KEY || '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
  const { data } = await client.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
  return data || [];
});

app.patch('/api/notifications/:id/read', async (req, reply) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return reply.code(401).send({ error: 'Unauthorized' });
  const client = createClient(
    process.env.SUPABASE_URL || 'https://vewfghckacbdgacpnqef.supabase.co',
    process.env.SUPABASE_ANON_KEY || '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
  await client.from('notifications').update({ read: true }).eq('id', req.params.id);
  return { success: true };
});

const PORT = process.env.PORT || 5001;
app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
  console.log(`Go4Talent API → http://localhost:${PORT}`);
});
