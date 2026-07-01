import { sidebar, sidebarScript } from './sidebarMarkup';
import { SB_URL, SB_KEY, sbHelpers } from '../lib/supabaseConfig';

const adayDetayMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('adaylar')}

  <main class="dash-main" id="detay-main">
    <div class="dash-topbar">
      <div style="display:flex;align-items:center;gap:0.75rem">
        <a href="/adaylar" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-tertiary);font-size:0.85rem;font-weight:600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Adaylar
        </a>
        <span style="color:var(--text-tertiary)">/</span>
        <span id="detay-breadcrumb" style="font-size:0.85rem;font-weight:600">—</span>
      </div>
    </div>

    <div id="detay-loading" style="text-align:center;padding:4rem;color:var(--text-tertiary)">Yükleniyor…</div>
    <div id="detay-notfound" style="display:none;text-align:center;padding:4rem">
      <div class="dash-empty-title">Aday bulunamadı</div>
      <p class="dash-empty-text" style="margin-top:0.5rem">Bu aday silinmiş olabilir.</p>
      <a href="/adaylar" class="dash-cta" style="display:inline-flex;margin-top:1rem">← Listeye Dön</a>
    </div>

    <div id="detay-content" style="display:none">
      <!-- üst kart -->
      <div class="dash-grid" style="margin-bottom:1.25rem">
        <div class="dash-panel" style="display:flex;align-items:center;gap:1.5rem">
          <div id="detay-avatar" class="cand-avatar" style="width:64px;height:64px;font-size:1.4rem;flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <h2 id="detay-name" class="dash-greeting-title" style="font-size:1.4rem"></h2>
            <div id="detay-email" style="font-size:0.85rem;color:var(--text-tertiary);margin-top:0.2rem"></div>
            <div style="display:flex;align-items:center;gap:0.6rem;margin-top:0.6rem">
              <span id="detay-pos-tag" class="pos-tag"></span>
              <span id="detay-status-badge" class="status-badge"></span>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;flex-shrink:0">
            <div style="text-align:center">
              <div id="detay-score" style="font-family:var(--font-heading);font-size:2.5rem;font-weight:700;color:var(--color-accent-500)"></div>
              <div style="font-size:0.72rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.07em">Eşleşme Skoru</div>
            </div>
            <a id="cv-indir-btn" href="#" target="_blank" rel="noopener" style="display:none;align-items:center;gap:0.4rem;padding:0.45rem 0.9rem;border-radius:8px;font-size:0.78rem;font-weight:600;border:1px solid rgba(194,245,66,0.3);color:#c2f542;background:rgba(194,245,66,0.07);text-decoration:none">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              CV İndir
            </a>
          </div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel-header"><span class="dash-panel-title">Durum Güncelle</span></div>
          <div style="display:flex;flex-direction:column;gap:0.5rem" id="status-btns">
            <button class="status-update-btn" data-status="inceleniyor">İnceleniyor</button>
            <button class="status-update-btn" data-status="mulakat">Mülakata Çağır</button>
            <button class="status-update-btn" data-status="teklif">Teklif Gönder</button>
            <button class="status-update-btn" data-status="reddedildi">Reddet</button>
          </div>
        </div>
      </div>

      <!-- skill analizi -->
      <div class="dash-panel" id="skill-panel" style="display:none;margin-bottom:1.25rem">
        <div class="dash-panel-header"><span class="dash-panel-title">Skill Analizi</span></div>
        <div id="skill-breakdown"></div>
      </div>

      <!-- notlar -->
      <div class="dash-panel">
        <div class="dash-panel-header"><span class="dash-panel-title">Notlar</span></div>
        <textarea id="detay-notes" class="sett-input" rows="5" placeholder="Bu aday hakkında notlarınızı buraya yazın…" style="resize:vertical"></textarea>
        <div style="display:flex;justify-content:flex-end;margin-top:0.75rem">
          <button class="dash-cta" id="save-notes-btn" style="height:38px;font-size:0.82rem">Notu Kaydet</button>
        </div>
      </div>
    </div>
  </main>
</div>

<script>
(function () {
  ${sbHelpers}

  var candidateId = window.location.pathname.split('/').pop();
  var statusMap = { inceleniyor:'status-review', mulakat:'status-interview', teklif:'status-offer', reddedildi:'status-rejected' };
  var statusLabel = { inceleniyor:'İnceleniyor', mulakat:'Mülakat', teklif:'Teklif', reddedildi:'Reddedildi' };
  var colors = ['linear-gradient(135deg,#7c5cfa,#4530c2)','linear-gradient(135deg,#5cb8fa,#2980c2)','linear-gradient(135deg,#fa5cc8,#c23080)','linear-gradient(135deg,#fa8c5c,#c25030)','linear-gradient(135deg,#5cfaaa,#20c280)'];

  async function fetchCandidate() {
    var res = await fetch(SB_URL + '/rest/v1/candidates?id=eq.' + candidateId + '&select=*', { headers: sbHeaders() });
    if (res.status === 401) { localStorage.removeItem('sb_access_token'); localStorage.removeItem('g4_user_email'); window.location.replace('/login'); return null; }
    if (!res.ok) return null;
    var arr = await res.json();
    return arr[0] || null;
  }

  async function fetchPosition(posId) {
    if (!posId) return null;
    var res = await fetch(SB_URL + '/rest/v1/positions?id=eq.' + posId + '&select=id,title,required_skills,preferred_skills', { headers: sbHeaders() });
    if (!res.ok) return null;
    var arr = await res.json();
    return arr[0] || null;
  }

  async function updateCandidate(fields) {
    var res = await fetch(SB_URL + '/rest/v1/candidates?id=eq.' + candidateId, {
      method: 'PATCH',
      headers: sbHeaders(),
      body: JSON.stringify(fields)
    });
    return res.ok;
  }

  function updateStatusBadge(status) {
    var badge = document.getElementById('detay-status-badge');
    badge.className = 'status-badge ' + (statusMap[status] || 'status-review');
    badge.textContent = statusLabel[status] || status;
  }

  function renderSkillBreakdown(cand, pos) {
    if (!pos || !cand.skills || !cand.skills.length) return;
    if (!(pos.required_skills && pos.required_skills.length) && !(pos.preferred_skills && pos.preferred_skills.length)) return;

    var candSkills = cand.skills.map(function(s){ return s.toLowerCase(); });
    var req = pos.required_skills || [];
    var pref = pos.preferred_skills || [];

    function chipHtml(skill, matched, type) {
      var bg = matched ? (type==='req' ? 'rgba(194,245,66,0.15)' : 'rgba(92,184,250,0.12)') : 'rgba(255,255,255,0.05)';
      var color = matched ? (type==='req' ? '#c2f542' : '#5cb8fa') : 'var(--text-tertiary)';
      return '<span style="display:inline-flex;align-items:center;gap:0.25rem;padding:0.3rem 0.65rem;border-radius:8px;font-size:0.78rem;font-weight:600;background:'+bg+';color:'+color+';margin:0.2rem">' + (matched?'✓ ':'✗ ') + skill + '</span>';
    }

    var html = '';
    if (req.length) {
      html += '<div style="margin-bottom:0.75rem"><div style="font-size:0.78rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.4rem">Zorunlu Skill\'ler (%70)</div>';
      html += req.map(function(s){ return chipHtml(s, candSkills.indexOf(s.toLowerCase())>-1, 'req'); }).join('');
      html += '</div>';
    }
    if (pref.length) {
      html += '<div style="margin-bottom:0.75rem"><div style="font-size:0.78rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.4rem">Tercih Edilen (%30)</div>';
      html += pref.map(function(s){ return chipHtml(s, candSkills.indexOf(s.toLowerCase())>-1, 'pref'); }).join('');
      html += '</div>';
    }
    var allPos = req.map(function(s){return s.toLowerCase();}).concat(pref.map(function(s){return s.toLowerCase();}));
    var extra = cand.skills.filter(function(s){ return allPos.indexOf(s.toLowerCase()) === -1; });
    if (extra.length) {
      html += '<div><div style="font-size:0.78rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.4rem">Diğer Skill\'ler</div>';
      html += extra.map(function(s){ return '<span style="display:inline-flex;padding:0.3rem 0.65rem;border-radius:8px;font-size:0.78rem;font-weight:600;background:rgba(255,255,255,0.05);color:var(--text-tertiary);margin:0.2rem">'+s+'</span>'; }).join('');
      html += '</div>';
    }

    document.getElementById('skill-breakdown').innerHTML = html;
    document.getElementById('skill-panel').style.display = 'block';
  }

  (async function() {
    var cand = await fetchCandidate();
    document.getElementById('detay-loading').style.display = 'none';

    if (!cand) { document.getElementById('detay-notfound').style.display = 'block'; return; }

    document.getElementById('detay-content').style.display = 'block';
    document.getElementById('detay-breadcrumb').textContent = cand.name;

    var initials = cand.name.split(' ').map(function(w){ return w[0]; }).join('').toUpperCase().slice(0,2);
    var avatar = document.getElementById('detay-avatar');
    avatar.textContent = initials;
    avatar.style.background = colors[0];

    document.getElementById('detay-name').textContent = cand.name;
    document.getElementById('detay-email').textContent = cand.email;
    document.getElementById('detay-pos-tag').textContent = cand.position_title || '—';
    document.getElementById('detay-score').textContent = cand.score || 0;
    updateStatusBadge(cand.status);
    document.getElementById('detay-notes').value = cand.notes || '';

    // CV indirme butonu
    if (cand.cv_url) {
      var cvBtn = document.getElementById('cv-indir-btn');
      cvBtn.href = cand.cv_url;
      cvBtn.style.display = 'flex';
    }

    // skill breakdown
    var pos = await fetchPosition(cand.position_id);
    renderSkillBreakdown(cand, pos);

    // durum butonları
    var activeBtn = document.querySelector('[data-status="' + cand.status + '"]');
    if (activeBtn) activeBtn.classList.add('active');

    document.getElementById('status-btns').addEventListener('click', async function(e) {
      var btn = e.target.closest('[data-status]');
      if (!btn) return;
      var newStatus = btn.dataset.status;
      await updateCandidate({ status: newStatus });
      updateStatusBadge(newStatus);
      document.querySelectorAll('.status-update-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    });

    // not kaydet
    document.getElementById('save-notes-btn').addEventListener('click', async function() {
      this.textContent = 'Kaydediliyor…';
      this.disabled = true;
      await updateCandidate({ notes: document.getElementById('detay-notes').value });
      this.textContent = 'Kaydedildi ✓';
      this.disabled = false;
      var self = this;
      setTimeout(function(){ self.textContent = 'Notu Kaydet'; }, 1500);
    });
  })();
})();
</script>
${sidebarScript}
`;

export default adayDetayMarkup;
