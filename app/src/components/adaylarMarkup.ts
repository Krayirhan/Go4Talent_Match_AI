import { sidebar, sidebarScript } from './sidebarMarkup';
import { SB_URL, SB_KEY, sbHelpers, BACKEND_URL, ML_URL } from '../lib/supabaseConfig';

const adaylarMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('adaylar')}

  <main class="dash-main">
    <div class="dash-topbar">
      <div>
        <div class="dash-greeting-eyebrow">Havuz</div>
        <h1 class="dash-greeting-title">Adaylar</h1>
        <p class="dash-greeting-sub">Tüm başvuru sahiplerini yönetin ve sıralayın.</p>
      </div>
      <button class="dash-cta" id="btn-upload-cv">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        CV Yükle
      </button>
    </div>

    <div class="page-toolbar">
      <div class="search-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" id="cand-search" type="text" placeholder="Aday ara…" />
      </div>
      <div class="filter-row">
        <select class="filter-select" id="cand-filter-pos"><option value="">Tüm Pozisyonlar</option></select>
        <select class="filter-select" id="cand-filter-status">
          <option value="">Tüm Durumlar</option>
          <option value="inceleniyor">İnceleniyor</option>
          <option value="mulakat">Mülakat</option>
          <option value="teklif">Teklif</option>
          <option value="reddedildi">Reddedildi</option>
        </select>
      </div>
    </div>

    <div id="cand-loading" style="text-align:center;padding:3rem;color:var(--text-tertiary)">Yükleniyor…</div>
    <div id="cand-table-wrap" class="data-table-wrap" style="display:none">
      <table class="data-table">
        <thead>
          <tr>
            <th>Aday</th>
            <th>Pozisyon</th>
            <th>Eşleşme Skoru</th>
            <th>Durum</th>
            <th>Tarih</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="cand-tbody"></tbody>
      </table>
    </div>
    <div id="cand-empty" class="dash-empty" style="display:none;margin-top:2rem;border:1.5px dashed rgba(124,92,250,0.2);border-radius:18px;padding:3rem 1rem">
      <div class="dash-empty-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
      <div class="dash-empty-title">Henüz aday yok</div>
      <p class="dash-empty-text">CV yükleyin veya önce bir pozisyon oluşturun.</p>
      <button class="dash-empty-btn" id="btn-upload-cv-2">+ CV Yükle</button>
    </div>
    <div id="cand-footer" class="table-footer" style="display:none"></div>
  </main>
</div>

<!-- ── CV Yükleme Modalı ── -->
<div id="cv-modal" class="modal-backdrop" style="display:none">
  <div class="modal-box">
    <div class="modal-head">
      <h2 class="modal-title">CV Yükle</h2>
      <button class="modal-close" id="cv-modal-close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form id="cv-form" class="modal-form">
      <div class="sett-field">
        <label class="sett-label">Pozisyon *</label>
        <select class="sett-input" id="cv-pos-select" required><option value="">Pozisyon seçin</option></select>
      </div>
      <div class="form-grid">
        <div class="sett-field">
          <label class="sett-label">Ad Soyad *</label>
          <input class="sett-input" id="cv-name" type="text" placeholder="Ayşe Yıldız" required />
        </div>
        <div class="sett-field">
          <label class="sett-label">E-posta *</label>
          <input class="sett-input" id="cv-email" type="email" placeholder="aday@email.com" required />
        </div>
      </div>
      <div class="sett-field">
        <label class="sett-label">CV Dosyası</label>
        <div class="cv-drop-zone" id="cv-drop-zone">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-tertiary)"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div style="font-size:0.875rem;font-weight:600;margin-top:0.5rem">PDF veya Word dosyası sürükleyin</div>
          <div style="font-size:0.78rem;color:var(--text-tertiary);margin-top:0.25rem">veya tıklayarak seçin</div>
          <input type="file" id="cv-file" accept=".pdf,.doc,.docx" style="display:none" />
        </div>
        <div id="cv-file-name" style="font-size:0.82rem;color:var(--color-accent-500);margin-top:0.4rem;display:none"></div>
        <div id="cv-ml-status" style="display:none;margin-top:0.4rem;font-size:0.78rem;padding:0.4rem 0.7rem;border-radius:8px;background:rgba(124,92,250,0.08);color:var(--color-accent-500)"></div>
      </div>
      <div class="sett-field">
        <label class="sett-label">Aday Skill'leri</label>
        <input class="sett-input" id="cv-skills" type="text" placeholder="ör. React, TypeScript, Python (virgülle ayırın)" />
        <div id="cv-score-preview" style="display:none;margin-top:0.6rem;padding:0.6rem 0.9rem;background:rgba(124,92,250,0.08);border-radius:10px;font-size:0.82rem">
          <span style="color:var(--text-tertiary)">Tahmini Skor: </span>
          <span id="cv-score-preview-val" style="font-weight:700;color:var(--color-accent-500)">—</span>
          <span id="cv-score-preview-detail" style="color:var(--text-tertiary);margin-left:0.5rem"></span>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="outline-btn" id="cv-modal-cancel">İptal</button>
        <button type="submit" class="dash-cta" style="height:42px;font-size:0.875rem" id="cv-submit-btn">Aday Ekle</button>
      </div>
    </form>
  </div>
</div>

<script>
(function () {
  ${sbHelpers}
  var SB_URL = '${SB_URL}';
  var SB_KEY = '${SB_KEY}';
  var BACKEND_URL = '${BACKEND_URL}';
  var ML_URL = '${ML_URL}';

  var allCandidates = [];
  var allPositions = [];
  var PAGE_SIZE = 20;
  var currentPage = 1;

  var statusMap = { inceleniyor:'status-review', mulakat:'status-interview', teklif:'status-offer', reddedildi:'status-rejected' };
  var statusLabel = { inceleniyor:'İnceleniyor', mulakat:'Mülakat', teklif:'Teklif', reddedildi:'Reddedildi' };
  var colors = ['linear-gradient(135deg,#7c5cfa,#4530c2)','linear-gradient(135deg,#5cb8fa,#2980c2)','linear-gradient(135deg,#fa5cc8,#c23080)','linear-gradient(135deg,#fa8c5c,#c25030)','linear-gradient(135deg,#5cfaaa,#20c280)'];

  async function fetchCandidates() {
    var res = await fetch(BACKEND_URL + '/api/candidates', { headers: sbHeaders() });
    return res.ok ? await res.json() : [];
  }

  async function fetchPositions() {
    var res = await fetch(BACKEND_URL + '/api/positions', { headers: sbHeaders() });
    return res.ok ? await res.json() : [];
  }

  async function fetchMatchScore(candidateSkills, pos) {
    try {
      var res = await fetch(BACKEND_URL + '/api/match-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateSkills: candidateSkills || [],
          requiredSkills: (pos && pos.required_skills) || [],
          preferredSkills: (pos && pos.preferred_skills) || []
        })
      });
      if (res.ok) {
        var data = await res.json();
        if (typeof data.score === 'number') return data.score;
        if (typeof data.total === 'number') return data.total;
      }
    } catch(e) {}
    return calcScore(candidateSkills, pos);
  }

  async function insertCandidate(cand) {
    var res = await fetch(SB_URL + '/rest/v1/candidates', {
      method: 'POST',
      headers: sbHeaders({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(cand)
    });
    if (res.status === 401) {
      localStorage.removeItem('sb_access_token');
      localStorage.removeItem('g4_user_email');
      window.location.replace('/login');
      return false;
    }
    if (!res.ok) {
      try { var err = await res.json(); console.error('Candidate insert error:', res.status, err); } catch(e) {}
    }
    return res.ok;
  }

  // ── Skor Hesaplama ──
  function parseSkills(str) {
    return (str||'').split(',').map(function(s){ return s.trim().toLowerCase(); }).filter(Boolean);
  }
  function calcScore(candidateSkills, pos) {
    if (!pos) return 0;
    var req = (pos.required_skills||[]).map(function(s){ return s.toLowerCase(); });
    var pref = (pos.preferred_skills||[]).map(function(s){ return s.toLowerCase(); });
    var cands = (candidateSkills||[]).map(function(s){ return s.toLowerCase(); });
    var reqMatch = req.length ? req.filter(function(s){ return cands.indexOf(s) > -1; }).length / req.length : 0;
    var prefMatch = pref.length ? pref.filter(function(s){ return cands.indexOf(s) > -1; }).length / pref.length : 0;
    return Math.max(1, Math.round(reqMatch * 70 + prefMatch * 30));
  }

  function fillPosDropdowns() {
    var filterSel = document.getElementById('cand-filter-pos');
    var cvSel = document.getElementById('cv-pos-select');
    var opts = allPositions.map(function(p){ return '<option value="' + p.id + '">' + p.title + '</option>'; }).join('');
    filterSel.innerHTML = '<option value="">Tüm Pozisyonlar</option>' + opts;
    cvSel.innerHTML = '<option value="">Pozisyon seçin</option>' + opts;
  }

  function renderCandidates() {
    var search = document.getElementById('cand-search').value.toLowerCase();
    var posFilter = document.getElementById('cand-filter-pos').value;
    var statusFilter = document.getElementById('cand-filter-status').value;

    var filtered = allCandidates.filter(function(c) {
      return (!search || c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)) &&
             (!posFilter || c.position_id === posFilter) &&
             (!statusFilter || c.status === statusFilter);
    });

    var tbody = document.getElementById('cand-tbody');
    var empty = document.getElementById('cand-empty');
    var tableWrap = document.getElementById('cand-table-wrap');
    var footer = document.getElementById('cand-footer');
    document.getElementById('cand-loading').style.display = 'none';

    if (filtered.length === 0) {
      tableWrap.style.display = 'none';
      footer.style.display = 'none';
      empty.style.display = 'flex';
      return;
    }

    var totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = 1;
    var start = (currentPage - 1) * PAGE_SIZE;
    var paginated = filtered.slice(start, start + PAGE_SIZE);

    tableWrap.style.display = 'block';
    empty.style.display = 'none';
    footer.style.display = 'block';

    // Pagination footer
    var pageInfo = filtered.length + ' adaydan ' + (start + 1) + '–' + Math.min(start + PAGE_SIZE, filtered.length) + ' gösteriliyor';
    var prevDisabled = currentPage <= 1 ? 'disabled style="opacity:0.4;cursor:default"' : '';
    var nextDisabled = currentPage >= totalPages ? 'disabled style="opacity:0.4;cursor:default"' : '';
    footer.innerHTML = '<span style="font-size:0.82rem;color:var(--text-tertiary)">' + pageInfo + '</span>' +
      '<div style="display:flex;gap:0.4rem">' +
        '<button class="outline-btn" id="page-prev" ' + prevDisabled + ' style="padding:0.3rem 0.7rem;font-size:0.8rem">‹ Önceki</button>' +
        '<span style="font-size:0.82rem;color:var(--text-tertiary);align-self:center">Sayfa ' + currentPage + ' / ' + totalPages + '</span>' +
        '<button class="outline-btn" id="page-next" ' + nextDisabled + ' style="padding:0.3rem 0.7rem;font-size:0.8rem">Sonraki ›</button>' +
      '</div>';

    var prevBtn = document.getElementById('page-prev');
    var nextBtn = document.getElementById('page-next');
    if (prevBtn) prevBtn.addEventListener('click', function(){ if(currentPage > 1){ currentPage--; renderCandidates(); window.scrollTo(0,0); } });
    if (nextBtn) nextBtn.addEventListener('click', function(){ if(currentPage < totalPages){ currentPage++; renderCandidates(); window.scrollTo(0,0); } });

    tbody.innerHTML = paginated.map(function(c, idx) {
      var initials = c.name.split(' ').map(function(w){ return w[0]; }).join('').toUpperCase().slice(0,2);
      var scoreColor = c.score >= 80 ? 'var(--color-accent-500)' : c.score >= 60 ? '#fac85c' : '#7a6f90';
      var badgeClass = statusMap[c.status] || 'status-review';
      var label = statusLabel[c.status] || c.status;
      var bg = colors[(start + idx) % colors.length];
      var date = new Date(c.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});
      return '<tr>' +
        '<td><div class="candidate-cell"><div class="cand-avatar" style="background:' + bg + '">' + initials + '</div><div><div class="cand-name">' + c.name + '</div><div class="cand-email">' + c.email + '</div></div></div></td>' +
        '<td><span class="pos-tag">' + (c.position_title||'—') + '</span></td>' +
        '<td><div class="score-wrap"><div class="score-bar"><div class="score-fill" style="width:' + c.score + '%;background:' + scoreColor + '"></div></div><span class="score-num" style="color:' + scoreColor + '">' + c.score + '</span></div></td>' +
        '<td><span class="status-badge ' + badgeClass + '">' + label + '</span></td>' +
        '<td class="date-cell">' + date + '</td>' +
        '<td><button class="row-action-btn" data-href="/adaylar/' + c.id + '">İncele →</button></td>' +
      '</tr>';
    }).join('');
  }

  // ── Modal ──
  function openModal() { fillPosDropdowns(); document.getElementById('cv-modal').style.display = 'flex'; }
  function closeModal() { document.getElementById('cv-modal').style.display = 'none'; document.getElementById('cv-form').reset(); document.getElementById('cv-file-name').style.display='none'; document.getElementById('cv-score-preview').style.display='none'; }

  document.getElementById('btn-upload-cv').addEventListener('click', openModal);
  var btn2 = document.getElementById('btn-upload-cv-2');
  if (btn2) btn2.addEventListener('click', openModal);
  document.getElementById('cv-modal-close').addEventListener('click', closeModal);
  document.getElementById('cv-modal-cancel').addEventListener('click', closeModal);
  document.getElementById('cv-modal').addEventListener('click', function(e){ if(e.target===this) closeModal(); });

  // drop zone
  var dropZone = document.getElementById('cv-drop-zone');
  var fileInput = document.getElementById('cv-file');
  dropZone.addEventListener('click', function(){ fileInput.click(); });
  dropZone.addEventListener('dragover', function(e){ e.preventDefault(); dropZone.style.borderColor='var(--color-primary-500)'; });
  dropZone.addEventListener('dragleave', function(){ dropZone.style.borderColor=''; });
  dropZone.addEventListener('drop', function(e){
    e.preventDefault(); dropZone.style.borderColor='';
    var file = e.dataTransfer.files[0];
    if (file) { fileInput.files = e.dataTransfer.files; var n=document.getElementById('cv-file-name'); n.textContent='✓ '+file.name; n.style.display='block'; parseCvWithML(file); }
  });

  async function uploadCvFile(file, candId) {
    var uid = getUserId();
    if (!uid || !file) return null;
    var ext = (file.name.split('.').pop() || 'pdf').toLowerCase();
    var mimeMap = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    var contentType = file.type || mimeMap[ext] || 'application/octet-stream';
    var path = uid + '/' + candId + '.' + ext;
    var res = await fetch(SB_URL + '/storage/v1/object/cvs/' + path, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + getToken(),
        'Content-Type': contentType,
        'x-upsert': 'true'
      },
      body: file
    });
    if (!res.ok) {
      try { var j = await res.clone().json(); console.error('CV upload failed', res.status, j.message || j.error || ''); } catch(e) {}
      return null;
    }
    return SB_URL + '/storage/v1/object/cvs/' + path;
  }

  // ── CV ML Parse — dosya seçilince otomatik skill doldur ──
  async function parseCvWithML(file) {
    var statusEl = document.getElementById('cv-ml-status');
    if (statusEl) { statusEl.textContent = '🔍 CV analiz ediliyor…'; statusEl.style.display = 'block'; }
    try {
      var formData = new FormData();
      formData.append('file', file);
      var res = await fetch(ML_URL + '/api/cv/parse', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('ML servis hatası');
      var data = await res.json();

      // Skill'leri forma doldur (mevcut değerleri koru + ekle)
      if (data.skills && data.skills.length > 0) {
        var current = document.getElementById('cv-skills').value.trim();
        var existing = current ? current.split(',').map(function(s){ return s.trim().toLowerCase(); }) : [];
        var newSkills = data.skills.filter(function(s){ return existing.indexOf(s.toLowerCase()) === -1; });
        var merged = current ? current + (newSkills.length ? ', ' + newSkills.join(', ') : '') : newSkills.join(', ');
        document.getElementById('cv-skills').value = merged;
        updateScorePreview();
      }

      // ML özet bilgisi göster
      var parts = [];
      if (data.experience_years) parts.push(data.experience_years + ' yıl deneyim');
      if (data.last_role)        parts.push(data.last_role);
      if (data.education && data.education.degree) parts.push(data.education.degree);
      if (data.languages && data.languages.length) parts.push(data.languages.join(', '));

      if (statusEl) {
        statusEl.textContent = '✓ ' + data.skills.length + ' skill tespit edildi' + (parts.length ? ' · ' + parts.join(' · ') : '');
        statusEl.style.color = 'var(--color-accent-500)';
      }
    } catch(e) {
      if (statusEl) { statusEl.textContent = 'ML servis baglantisi yok — skilleri elle girin.'; statusEl.style.color = 'var(--text-tertiary)'; }
    }
  }

  fileInput.addEventListener('change', function() {
    if (this.files[0]) {
      var n = document.getElementById('cv-file-name');
      n.textContent = '✓ ' + this.files[0].name;
      n.style.display = 'block';
      parseCvWithML(this.files[0]);
    }
  });

  // canlı skor önizleme
  async function updateScorePreview() {
    var posId = document.getElementById('cv-pos-select').value;
    var skillStr = document.getElementById('cv-skills').value;
    var preview = document.getElementById('cv-score-preview');
    if (!posId || !skillStr.trim()) { preview.style.display='none'; return; }
    var pos = allPositions.find(function(p){ return p.id === posId; });
    if (!pos) { preview.style.display='none'; return; }
    var skills = parseSkills(skillStr);
    var score = await fetchMatchScore(skills, pos);
    var req = (pos.required_skills||[]).map(function(s){ return s.toLowerCase(); });
    var pref = (pos.preferred_skills||[]).map(function(s){ return s.toLowerCase(); });
    var reqHit = req.filter(function(s){ return skills.indexOf(s) > -1; }).length;
    var prefHit = pref.filter(function(s){ return skills.indexOf(s) > -1; }).length;
    document.getElementById('cv-score-preview-val').textContent = score;
    document.getElementById('cv-score-preview-detail').textContent = 'Zorunlu: ' + reqHit + '/' + req.length + ' · Tercih: ' + prefHit + '/' + pref.length;
    preview.style.display = 'block';
  }
  document.getElementById('cv-skills').addEventListener('input', updateScorePreview);
  document.getElementById('cv-pos-select').addEventListener('change', updateScorePreview);

  // form submit
  document.getElementById('cv-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var submitBtn = document.getElementById('cv-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Kaydediliyor…';

    var posId = document.getElementById('cv-pos-select').value;
    var pos = allPositions.find(function(p){ return p.id === posId; });
    var skills = parseSkills(document.getElementById('cv-skills').value);
    var score = calcScore(skills, pos);

    var newCand = {
      id: 'cand_' + Date.now(),
      name: document.getElementById('cv-name').value.trim(),
      email: document.getElementById('cv-email').value.trim(),
      position_id: posId,
      position_title: pos ? pos.title : '—',
      skills: skills,
      score: score,
      status: 'inceleniyor',
      notes: '',
      user_id: getUserId(),
    };

    var ok = await insertCandidate(newCand);
    if (ok) {
      // CV dosyası varsa yükle
      var file = fileInput.files[0];
      if (file) {
        submitBtn.textContent = 'CV yükleniyor…';
        var cvUrl = await uploadCvFile(file, newCand.id);
        if (cvUrl) {
          await fetch(SB_URL + '/rest/v1/candidates?id=eq.' + newCand.id, {
            method: 'PATCH', headers: sbHeaders(), body: JSON.stringify({ cv_url: cvUrl })
          });
        }
      }
      allCandidates = await fetchCandidates();
      closeModal();
      renderCandidates();
    } else {
      showToast('Aday kaydedilemedi. Lütfen tekrar deneyin.', false);
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Aday Ekle';
  });

  document.getElementById('cand-tbody').addEventListener('click', function(e) {
    var btn = e.target.closest('button[data-href]');
    if (btn) window.location.href = btn.getAttribute('data-href');
  });

  document.getElementById('cand-search').addEventListener('input', function(){ currentPage=1; renderCandidates(); });
  document.getElementById('cand-filter-pos').addEventListener('change', function(){ currentPage=1; renderCandidates(); });
  document.getElementById('cand-filter-status').addEventListener('change', function(){ currentPage=1; renderCandidates(); });

  // URL param filtre
  var urlParams = new URLSearchParams(window.location.search);
  var posParam = urlParams.get('pos');

  // ── İlk yükleme ──
  (async function() {
    var results = await Promise.all([fetchCandidates(), fetchPositions()]);
    allCandidates = results[0];
    allPositions = results[1];
    fillPosDropdowns();
    if (posParam) { document.getElementById('cand-filter-pos').value = posParam; }
    renderCandidates();
  })();
})();
</script>
${sidebarScript}
`;

export default adaylarMarkup;
