import { SB_URL, SB_KEY, BACKEND_URL } from '../lib/supabaseConfig';

const mulakatFormMarkup = /* html */`
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go4Talent — Ön Görüşme Formu</title>
  <link rel="stylesheet" href="/dashboard.css">
</head>
<body style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem">

<div style="width:100%;max-width:640px">
  <div style="display:flex;align-items:center;gap:0.65rem;margin-bottom:2rem;justify-content:center">
    <div class="dash-logo-mark" style="width:36px;height:36px">G4</div>
    <span style="font-family:var(--font-heading);font-size:1rem;font-weight:700">Go4Talent MatchAI</span>
  </div>

  <div id="form-loading" style="text-align:center;padding:3rem;color:var(--text-tertiary)">Yükleniyor…</div>
  <div id="form-notfound" style="display:none;text-align:center;padding:3rem">
    <div class="dash-empty-title">Form bulunamadı</div>
    <div class="dash-empty-sub" style="margin-top:0.5rem">Bu link geçersiz veya süresi dolmuş olabilir.</div>
  </div>
  <div id="form-done" style="display:none;text-align:center;padding:3rem">
    <div style="font-size:2.5rem;margin-bottom:1rem">✓</div>
    <div class="dash-empty-title" style="color:var(--color-accent-500)">Başvurunuz Alındı!</div>
    <div class="dash-empty-sub" style="margin-top:0.5rem">Ön görüşme formunuzu başarıyla doldurdunuz. Ekibimiz en kısa sürede sizinle iletişime geçecek.</div>
  </div>

  <div id="form-wrap" style="display:none">
    <div class="dash-panel" style="margin-bottom:1.25rem">
      <div id="form-header">
        <h2 id="form-pos-title" class="dash-greeting-title" style="font-size:1.2rem;margin-bottom:0.3rem"></h2>
        <p id="form-cand-name" style="color:var(--text-tertiary);font-size:0.875rem"></p>
      </div>
    </div>

    <form id="interview-form">
      <div id="questions-wrap" style="display:flex;flex-direction:column;gap:1rem"></div>
      <div id="form-error" style="color:#fa5c7c;font-size:0.85rem;margin-top:1rem;display:none"></div>
      <button type="submit" class="dash-cta" style="margin-top:1.5rem;width:100%;justify-content:center" id="submit-btn">Formu Gönder</button>
    </form>
  </div>
</div>

<script>
(function() {
  var SB_URL = '${SB_URL}';
  var SB_KEY = '${SB_KEY}';
  var BACKEND_URL = '${BACKEND_URL}';

  var candId = window.location.pathname.split('/').pop();
  var typeMap = { open: 'textarea', yesno: 'yesno', scale: 'scale', text: 'text' };

  (async function() {
    var [candRes] = await Promise.all([
      fetch(SB_URL + '/rest/v1/candidates_public?id=eq.' + candId + '&select=id,name,position_id', {
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
      }).then(function(r){ return r.json(); }),
    ]);

    var cand = candRes[0];
    if (!cand) {
      document.getElementById('form-loading').style.display = 'none';
      document.getElementById('form-notfound').style.display = 'block';
      return;
    }

    var qRes = await fetch(SB_URL + '/rest/v1/interview_questions?position_id=eq.' + cand.position_id + '&order=order_index.asc', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
    });
    var questions = await qRes.json();

    var pRes = await fetch(SB_URL + '/rest/v1/positions?id=eq.' + cand.position_id + '&select=title', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
    });
    var pos = (await pRes.json())[0];

    document.getElementById('form-loading').style.display = 'none';

    if (!questions.length) {
      document.getElementById('form-notfound').style.display = 'block';
      return;
    }

    document.getElementById('form-pos-title').textContent = (pos ? pos.title + ' — ' : '') + 'Ön Görüşme Formu';
    document.getElementById('form-cand-name').textContent = 'Merhaba, ' + cand.name + '!';
    document.getElementById('form-wrap').style.display = 'block';

    var wrap = document.getElementById('questions-wrap');
    questions.forEach(function(q, idx) {
      var div = document.createElement('div');
      div.className = 'dash-panel';
      div.style.cssText = 'padding:1rem';
      var label = '<div style="font-size:0.9rem;font-weight:600;margin-bottom:0.75rem">' + (idx+1) + '. ' + (q.question || q.question_text || '') + (q.required ? ' <span style="color:#fa5c7c">*</span>' : '') + '</div>';
      var input = '';
      if (q.type === 'open') {
        input = '<textarea name="q_'+q.id+'" class="form-input" rows="4" style="resize:vertical" ' + (q.required?'required':'') + ' placeholder="Yanıtınızı buraya yazın…"></textarea>';
      } else if (q.type === 'yesno') {
        input = '<div style="display:flex;gap:1rem">' +
          '<label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer"><input type="radio" name="q_'+q.id+'" value="evet" '+(q.required?'required':'')+'>Evet</label>' +
          '<label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer"><input type="radio" name="q_'+q.id+'" value="hayır">Hayır</label>' +
        '</div>';
      } else if (q.type === 'scale') {
        input = '<div style="display:flex;gap:0.75rem">' +
          [1,2,3,4,5].map(function(n){ return '<label style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;cursor:pointer"><input type="radio" name="q_'+q.id+'" value="'+n+'" '+(q.required?'required':'')+'>'+n+'</label>'; }).join('') +
        '</div>';
      } else {
        input = '<input type="text" name="q_'+q.id+'" class="form-input" ' + (q.required?'required':'') + ' placeholder="Kısa cevabınız…">';
      }
      div.innerHTML = label + input;
      wrap.appendChild(div);
    });

    document.getElementById('interview-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = document.getElementById('submit-btn');
      btn.disabled = true;
      btn.textContent = 'Gönderiliyor…';

      var answers = {};
      questions.forEach(function(q) {
        if (q.type === 'yesno' || q.type === 'scale') {
          var checked = document.querySelector('input[name="q_'+q.id+'"]:checked');
          answers[q.id] = checked ? checked.value : '';
        } else {
          var el = document.querySelector('[name="q_'+q.id+'"]');
          answers[q.id] = el ? el.value : '';
        }
      });

      var submitted = false;
      try {
        var backendRes = await fetch(BACKEND_URL + '/api/interview/' + candId + '/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: answers })
        });
        submitted = backendRes.ok;
      } catch(e) {}

      if (!submitted) {
        var res = await fetch(SB_URL + '/rest/v1/interview_responses', {
          method: 'POST',
          headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({
            candidate_id: candId,
            position_id: cand.position_id,
            answers: answers,
            completed_at: new Date().toISOString()
          })
        });
        if (res.ok || res.status === 201) {
          await fetch(SB_URL + '/rest/v1/candidates?id=eq.' + candId, {
            method: 'PATCH',
            headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'mulakat' })
          });
          submitted = true;
        }
      }

      if (submitted) {
        document.getElementById('form-wrap').style.display = 'none';
        document.getElementById('form-done').style.display = 'block';
      } else {
        var errEl = document.getElementById('form-error');
        errEl.textContent = 'Bir hata oluştu, lütfen tekrar deneyin.';
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Formu Gönder';
      }
    });
  })();
})();
</script>
</body>
</html>
`;

export default mulakatFormMarkup;
