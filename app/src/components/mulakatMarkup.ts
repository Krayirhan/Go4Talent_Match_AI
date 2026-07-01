import { sidebar, sidebarScript } from './sidebarMarkup';
import { SB_URL, SB_KEY, sbHelpers } from '../lib/supabaseConfig';

const mulakatMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('mulakat')}

  <main class="dash-main">
    <div class="dash-topbar">
      <div>
        <h1 class="dash-greeting-title" style="font-size:1.3rem">Ön Görüşme Modülü</h1>
        <p style="font-size:0.85rem;color:var(--text-tertiary);margin-top:0.2rem">Pozisyonlara özel mülakat soruları oluşturun</p>
      </div>
    </div>

    <!-- Pozisyon seç -->
    <div class="dash-panel" style="margin-bottom:1.25rem">
      <div class="dash-panel-header">
        <span class="dash-panel-title">Pozisyon Seç</span>
      </div>
      <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
        <select id="pos-select" class="form-input" style="max-width:320px">
          <option value="">— Pozisyon seçin —</option>
        </select>
        <button class="dash-cta" onclick="loadQuestions()">Soruları Yükle</button>
      </div>
    </div>

    <!-- Soru ekleme formu -->
    <div class="dash-panel" style="margin-bottom:1.25rem" id="question-form-panel">
      <div class="dash-panel-header">
        <span class="dash-panel-title">Yeni Soru Ekle</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        <div>
          <label class="form-label">Soru Metni</label>
          <textarea id="q-text" class="form-input" rows="2" placeholder="Örn: Kendinizden ve deneyimlerinizden bahseder misiniz?" style="resize:vertical"></textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
          <div>
            <label class="form-label">Soru Tipi</label>
            <select id="q-type" class="form-input">
              <option value="open">Açık Uçlu</option>
              <option value="yesno">Evet / Hayır</option>
              <option value="scale">1-5 Skala</option>
              <option value="text">Kısa Metin</option>
            </select>
          </div>
          <div>
            <label class="form-label">Zorunlu mu?</label>
            <select id="q-required" class="form-input">
              <option value="true">Evet</option>
              <option value="false">Hayır</option>
            </select>
          </div>
        </div>
        <div id="q-add-error" style="color:#fa5c7c;font-size:0.8rem;display:none"></div>
        <button class="dash-cta" style="align-self:flex-start" onclick="addQuestion()">Soru Ekle</button>
      </div>
    </div>

    <!-- Mevcut sorular -->
    <div class="dash-panel" id="questions-panel" style="display:none">
      <div class="dash-panel-header">
        <span class="dash-panel-title" id="q-panel-title">Sorular</span>
        <span id="q-count" style="font-size:0.78rem;color:var(--text-tertiary)"></span>
      </div>
      <div id="q-empty" class="dash-empty" style="display:none;padding:2rem">
        <div class="dash-empty-title">Bu pozisyon için henüz soru yok</div>
        <div class="dash-empty-sub">Yukarıdaki formdan soru ekleyin</div>
      </div>
      <div id="q-list" style="display:flex;flex-direction:column;gap:0.75rem"></div>
    </div>

    <!-- Aday görüşme linkleri -->
    <div class="dash-panel" id="cand-links-panel" style="display:none;margin-top:1.25rem">
      <div class="dash-panel-header">
        <span class="dash-panel-title">Aday Görüşme Linkleri</span>
        <span style="font-size:0.78rem;color:var(--text-tertiary)">Adaylara gönderilecek form linkleri</span>
      </div>
      <div id="cand-links-list" style="display:flex;flex-direction:column;gap:0.6rem"></div>
    </div>

    <!-- Tamamlanan yanıtlar -->
    <div class="dash-panel" id="responses-panel" style="display:none;margin-top:1.25rem">
      <div class="dash-panel-header">
        <span class="dash-panel-title">Tamamlanan Yanıtlar</span>
        <span id="resp-count" style="font-size:0.78rem;color:var(--text-tertiary)"></span>
      </div>
      <div id="resp-empty" class="dash-empty" style="display:none;padding:2rem">
        <div class="dash-empty-title">Henüz yanıt yok</div>
        <div class="dash-empty-sub">Adaylar formu doldurduğunda burada görünür</div>
      </div>
      <div id="resp-list" style="display:flex;flex-direction:column;gap:0.75rem"></div>
    </div>
  </main>
</div>

<script>
(function() {
  ${sbHelpers}
  var SB_URL = '${SB_URL}';
  var SB_KEY = '${SB_KEY}';

  var currentPosId = null;

  // ── Pozisyonları yükle ──
  (async function() {
    var res = await fetch(SB_URL + '/rest/v1/positions?select=id,title&order=created_at.desc', { headers: sbHeaders() });
    var positions = await res.json();
    var sel = document.getElementById('pos-select');
    positions.forEach(function(p) {
      var opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.title;
      sel.appendChild(opt);
    });
  })();

  window.loadQuestions = async function() {
    var posId = document.getElementById('pos-select').value;
    if (!posId) return;
    currentPosId = posId;

    document.getElementById('questions-panel').style.display = 'block';

    var posName = document.getElementById('pos-select').selectedOptions[0].text;
    document.getElementById('q-panel-title').textContent = posName + ' — Sorular';

    var res = await fetch(SB_URL + '/rest/v1/interview_questions?position_id=eq.' + posId + '&order=order_index.asc', { headers: sbHeaders() });
    var questions = await res.json();

    renderQuestions(questions);

    // Adayları getir
    var cRes = await fetch(SB_URL + '/rest/v1/candidates?position_id=eq.' + posId + '&select=id,name,email&order=created_at.desc', { headers: sbHeaders() });
    var cands = await cRes.json();
    renderCandLinks(cands, questions.length);

    // Tamamlanan yanıtları getir
    await loadResponses(posId, cands, questions);
  };

  function renderQuestions(questions) {
    var list = document.getElementById('q-list');
    var empty = document.getElementById('q-empty');
    var count = document.getElementById('q-count');
    count.textContent = questions.length + ' soru';
    if (questions.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';
    var typeLabel = { open:'Açık Uçlu', yesno:'Evet/Hayır', scale:'1-5 Skala', text:'Kısa Metin' };
    list.innerHTML = questions.map(function(q, idx) {
      return '<div class="dash-panel" style="margin:0;padding:1rem;background:var(--surface-card-2);position:relative">' +
        '<div style="display:flex;align-items:flex-start;gap:0.75rem">' +
          '<div style="min-width:28px;height:28px;border-radius:8px;background:rgba(124,92,250,0.15);color:var(--color-primary-400);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0">' + (idx+1) + '</div>' +
          '<div style="flex:1">' +
            '<div style="font-size:0.9rem;font-weight:600;margin-bottom:0.3rem">' + (q.question || q.question_text || '') + '</div>' +
            '<div style="display:flex;gap:0.5rem;align-items:center">' +
              '<span style="font-size:0.72rem;padding:0.15rem 0.5rem;border-radius:5px;background:rgba(255,255,255,0.06);color:var(--text-tertiary)">' + (typeLabel[q.type]||q.type) + '</span>' +
              (q.required ? '<span style="font-size:0.72rem;padding:0.15rem 0.5rem;border-radius:5px;background:rgba(194,245,66,0.1);color:#c2f542">Zorunlu</span>' : '') +
            '</div>' +
          '</div>' +
          '<button data-qid="'+q.id+'" onclick="deleteQuestion(this.dataset.qid)" style="background:none;border:none;cursor:pointer;color:var(--text-tertiary);padding:0.25rem;border-radius:6px;flex-shrink:0" title="Sil">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderCandLinks(cands, qCount) {
    var panel = document.getElementById('cand-links-panel');
    var list = document.getElementById('cand-links-list');
    if (cands.length === 0 || qCount === 0) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    list.innerHTML = cands.map(function(c) {
      var link = window.location.origin + '/mulakat/' + c.id;
      return '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:var(--surface-overlay);border-radius:10px;flex-wrap:wrap">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:0.875rem;font-weight:600">' + c.name + '</div>' +
          '<div style="font-size:0.75rem;color:var(--text-tertiary)">' + c.email + '</div>' +
        '</div>' +
        '<input readonly value="' + link + '" style="flex:2;min-width:200px;background:var(--surface-card-2);border:1px solid var(--surface-stroke);border-radius:8px;padding:0.4rem 0.75rem;font-size:0.78rem;color:var(--text-tertiary);cursor:text" onclick="this.select()">' +
        '<button class="outline-btn" style="padding:0.4rem 0.75rem;font-size:0.78rem" data-link="'+link+'" onclick="var b=this;navigator.clipboard.writeText(b.dataset.link).then(function(){b.textContent=b.dataset.copied;setTimeout(function(){b.textContent=b.dataset.label;},2000);})" data-copied="Kopyalandi!" data-label="Linki Kopyala">Linki Kopyala</button>' +
      '</div>';
    }).join('');
  }

  async function loadResponses(posId, cands, questions) {
    var panel = document.getElementById('responses-panel');
    var respList = document.getElementById('resp-list');
    var respEmpty = document.getElementById('resp-empty');
    var respCount = document.getElementById('resp-count');
    panel.style.display = 'block';
    respList.innerHTML = '';

    var rRes = await fetch(SB_URL + '/rest/v1/interview_responses?position_id=eq.' + posId + '&order=created_at.desc', { headers: sbHeaders() });
    var responses = rRes.ok ? await rRes.json() : [];
    respCount.textContent = responses.length + ' yanıt';

    if (!responses.length) { respEmpty.style.display = 'flex'; return; }
    respEmpty.style.display = 'none';

    var candMap = {};
    cands.forEach(function(c){ candMap[c.id] = c; });
    var qMap = {};
    questions.forEach(function(q){ qMap[q.id] = q; });

    respList.innerHTML = responses.map(function(r) {
      var cand = candMap[r.candidate_id] || { name: r.candidate_id, email: '' };
      var answers = r.answers || {};
      var date = r.completed_at ? new Date(r.completed_at).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
      var answersHtml = questions.map(function(q) {
        var ans = answers[q.id];
        if (!ans && ans !== 0) return '';
        return '<div style="padding:0.5rem 0;border-bottom:1px solid var(--surface-stroke)">' +
          '<div style="font-size:0.75rem;font-weight:700;color:var(--text-tertiary);margin-bottom:0.25rem">' + (q.question||q.question_text||'') + '</div>' +
          '<div style="font-size:0.875rem;color:var(--text-secondary)">' + ans + '</div>' +
        '</div>';
      }).filter(Boolean).join('');
      return '<details style="background:var(--surface-card-2);border-radius:12px;overflow:hidden">' +
        '<summary style="padding:1rem;cursor:pointer;display:flex;align-items:center;justify-content:space-between;list-style:none;gap:0.75rem">' +
          '<div style="display:flex;align-items:center;gap:0.75rem">' +
            '<div class="cand-avatar" style="background:linear-gradient(135deg,#7c5cfa,#4530c2);width:32px;height:32px;font-size:0.8rem">' + cand.name.charAt(0).toUpperCase() + '</div>' +
            '<div><div style="font-size:0.875rem;font-weight:600">' + cand.name + '</div><div style="font-size:0.75rem;color:var(--text-tertiary)">' + cand.email + '</div></div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:0.75rem"><span style="font-size:0.75rem;color:var(--text-tertiary)">' + date + '</span><span style="font-size:0.72rem;color:var(--color-accent-500);font-weight:600">Yanıtları Gör ▾</span></div>' +
        '</summary>' +
        '<div style="padding:0 1rem 1rem">' + (answersHtml || '<div style="color:var(--text-tertiary);font-size:0.85rem">Yanıt yok</div>') + '</div>' +
      '</details>';
    }).join('');
  }

  window.addQuestion = async function() {
    var text = document.getElementById('q-text').value.trim();
    var type = document.getElementById('q-type').value;
    var required = document.getElementById('q-required').value === 'true';
    var errEl = document.getElementById('q-add-error');
    errEl.style.display = 'none';

    if (!text) { errEl.textContent = 'Soru metni boş olamaz.'; errEl.style.display = 'block'; return; }
    if (!currentPosId) { errEl.textContent = 'Önce bir pozisyon seçin.'; errEl.style.display = 'block'; return; }

    var res = await fetch(SB_URL + '/rest/v1/interview_questions?position_id=eq.' + currentPosId + '&select=order_index&order=order_index.desc&limit=1', { headers: sbHeaders() });
    var existing = await res.json();
    var nextOrder = existing.length ? (existing[0].order_index + 1) : 1;

    var addRes = await fetch(SB_URL + '/rest/v1/interview_questions', {
      method: 'POST',
      headers: Object.assign({}, sbHeaders(), { 'Prefer': 'return=representation' }),
      body: JSON.stringify({
        position_id: currentPosId,
        question: text,
        type: type,
        required: required,
        order_index: nextOrder,
        user_id: getUserId()
      })
    });
    if (!addRes.ok) {
      var err = await addRes.json();
      errEl.textContent = err.message || 'Eklenemedi.';
      errEl.style.display = 'block';
      return;
    }
    document.getElementById('q-text').value = '';
    loadQuestions();
  };

  window.deleteQuestion = async function(id) {
    await fetch(SB_URL + '/rest/v1/interview_questions?id=eq.' + id, { method: 'DELETE', headers: sbHeaders() });
    loadQuestions();
  };
})();
</script>
${sidebarScript}
`;

export default mulakatMarkup;
