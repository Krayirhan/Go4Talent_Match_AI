import { sidebar, sidebarScript } from './sidebarMarkup';
import { SB_URL, SB_KEY, sbHelpers } from '../lib/supabaseConfig';

const pozisyonDetayMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('pozisyonlar')}

  <main class="dash-main">
    <div class="dash-topbar">
      <div style="display:flex;align-items:center;gap:0.75rem">
        <a href="/pozisyonlar" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-tertiary);font-size:0.85rem;font-weight:600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Pozisyonlar
        </a>
        <span style="color:var(--text-tertiary)">/</span>
        <span id="pos-breadcrumb" style="font-size:0.85rem;font-weight:600">—</span>
      </div>
    </div>

    <div id="pos-loading" style="text-align:center;padding:4rem;color:var(--text-tertiary)">Yükleniyor…</div>
    <div id="pos-notfound" style="display:none;text-align:center;padding:4rem">
      <div class="dash-empty-title">Pozisyon bulunamadı</div>
      <a href="/pozisyonlar" class="dash-cta" style="display:inline-flex;margin-top:1rem">← Listeye Dön</a>
    </div>

    <div id="pos-content" style="display:none">

      <!-- Üst kart -->
      <div class="dash-panel" style="margin-bottom:1.25rem">
        <div style="display:flex;align-items:flex-start;gap:1.25rem;flex-wrap:wrap">
          <div id="pos-icon-wrap" style="width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          </div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.4rem">
              <h2 id="pos-title" class="dash-greeting-title" style="font-size:1.4rem;margin:0"></h2>
              <span id="pos-status-badge" class="status-badge"></span>
            </div>
            <div id="pos-meta" style="font-size:0.85rem;color:var(--text-tertiary);margin-bottom:0.75rem"></div>
            <div id="pos-required-chips" class="pos-skill-chips"></div>
            <div id="pos-preferred-chips" class="pos-skill-chips" style="margin-top:0.3rem"></div>
          </div>
          <div style="display:flex;gap:0.75rem;flex-shrink:0;flex-wrap:wrap">
            <button class="outline-btn" id="edit-pos-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Düzenle
            </button>
            <button class="dash-cta" id="cv-yükle-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              CV Yükle
            </button>
            <button class="outline-btn" id="toggle-status-btn">Pasife Al</button>
            <button class="outline-btn" id="delete-pos-btn" style="color:#fa5c7c;border-color:rgba(250,92,124,0.3)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              Sil
            </button>
          </div>
        </div>
        <div id="pos-desc" style="margin-top:1rem;font-size:0.875rem;color:var(--text-secondary);line-height:1.7;display:none"></div>
      </div>

      <!-- İstatistikler -->
      <div class="dash-stats" style="margin-bottom:1.25rem">
        <div class="dash-stat-card" data-color="purple">
          <div class="dash-stat-label">Toplam Başvuru</div>
          <div class="dash-stat-value" id="ps-total">0</div>
        </div>
        <div class="dash-stat-card" data-color="lime">
          <div class="dash-stat-label">Ort. Eşleşme Skoru</div>
          <div class="dash-stat-value" id="ps-avg">—</div>
        </div>
        <div class="dash-stat-card" data-color="blue">
          <div class="dash-stat-label">Mülakat Aşamasında</div>
          <div class="dash-stat-value" id="ps-interview">0</div>
        </div>
        <div class="dash-stat-card" data-color="pink">
          <div class="dash-stat-label">Teklif Aşamasında</div>
          <div class="dash-stat-value" id="ps-offer">0</div>
        </div>
      </div>

      <!-- Aday tablosu -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <span class="dash-panel-title">Bu Pozisyondaki Adaylar</span>
          <a id="pos-all-cands-link" href="#" class="dash-panel-link">Tümünü Gör →</a>
        </div>
        <div id="pos-cand-empty" class="dash-empty" style="display:none;padding:2rem">
          <div class="dash-empty-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <div class="dash-empty-title">Bu pozisyon için henüz aday yok</div>
          <button class="dash-empty-btn" onclick="window.location.href='/adaylar?pos='+window.location.pathname.split('/').pop()">CV Yükle</button>
        </div>
        <div class="data-table-wrap" id="pos-cand-table" style="border-radius:0;display:none">
          <table class="data-table">
            <thead><tr><th>Aday</th><th>Eşleşme Skoru</th><th>Durum</th><th>Tarih</th><th></th></tr></thead>
            <tbody id="pos-cand-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- ── Pozisyon Silme Onay Modalı ── -->
<div id="delete-pos-modal" class="modal-backdrop" style="display:none">
  <div class="modal-box" style="max-width:420px">
    <div class="modal-head">
      <h2 class="modal-title" style="color:#fa5c7c">Pozisyonu Sil</h2>
      <button class="modal-close" id="delete-modal-close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div style="padding:0 0 1.25rem">
      <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6">
        <strong id="delete-pos-name" style="color:var(--text-primary)"></strong> pozisyonunu silmek istediğinizden emin misiniz?
      </p>
      <p style="font-size:0.82rem;color:#fa5c7c;margin-top:0.6rem">Bu işlem geri alınamaz. Pozisyona ait adaylar silinmez.</p>
    </div>
    <div class="modal-actions">
      <button class="outline-btn" id="delete-modal-cancel">İptal</button>
      <button class="dash-cta" id="delete-pos-confirm-btn" style="background:rgba(250,92,124,0.15);border-color:rgba(250,92,124,0.4);color:#fa5c7c">Evet, Sil</button>
    </div>
  </div>
</div>

<!-- ── Pozisyon Düzenleme Modalı ── -->
<div id="edit-pos-modal" class="modal-backdrop" style="display:none">
  <div class="modal-box">
    <div class="modal-head">
      <h2 class="modal-title">Pozisyon Düzenle</h2>
      <button class="modal-close" id="edit-modal-close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form id="edit-pos-form" class="modal-form">
      <div class="form-grid">
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Pozisyon Adı *</label>
          <input class="sett-input" id="ep-title" type="text" required />
        </div>
        <div class="sett-field">
          <label class="sett-label">Departman</label>
          <input class="sett-input" id="ep-dept" type="text" />
        </div>
        <div class="sett-field">
          <label class="sett-label">Çalışma Tipi</label>
          <select class="sett-input" id="ep-type">
            <option>Tam Zamanlı</option><option>Yarı Zamanlı</option><option>Sözleşmeli</option><option>Staj</option>
          </select>
        </div>
        <div class="sett-field">
          <label class="sett-label">Seviye</label>
          <select class="sett-input" id="ep-level">
            <option>Junior</option><option>Mid-level</option><option>Senior</option><option>Lead</option><option>Direktör</option>
          </select>
        </div>
        <div class="sett-field">
          <label class="sett-label">Lokasyon</label>
          <input class="sett-input" id="ep-location" type="text" />
        </div>
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Zorunlu Skill'ler <span style="color:var(--color-primary-500);font-size:0.75rem">(ağırlık %70)</span></label>
          <input class="sett-input" id="ep-required-skills" type="text" placeholder="Virgülle ayırın" />
        </div>
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Tercih Edilen Skill'ler <span style="color:var(--text-tertiary);font-size:0.75rem">(ağırlık %30)</span></label>
          <input class="sett-input" id="ep-preferred-skills" type="text" placeholder="Virgülle ayırın" />
        </div>
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Açıklama</label>
          <textarea class="sett-input" id="ep-desc" rows="3" style="resize:vertical"></textarea>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="outline-btn" id="edit-modal-cancel">İptal</button>
        <button type="submit" class="dash-cta" style="height:42px;font-size:0.875rem" id="ep-submit-btn">Kaydet</button>
      </div>
    </form>
  </div>
</div>

<script>
(function () {
  ${sbHelpers}

  var posId = window.location.pathname.split('/').pop();
  var statusMap   = { inceleniyor:'status-review', mulakat:'status-interview', teklif:'status-offer', reddedildi:'status-rejected' };
  var statusLabel = { inceleniyor:'İnceleniyor', mulakat:'Mülakat', teklif:'Teklif', reddedildi:'Reddedildi' };
  var colors = ['linear-gradient(135deg,#7c5cfa,#4530c2)','linear-gradient(135deg,#5cb8fa,#2980c2)','linear-gradient(135deg,#fa5cc8,#c23080)','linear-gradient(135deg,#fa8c5c,#c25030)','linear-gradient(135deg,#5cfaaa,#20c280)'];
  var scoreColor = function(s){ return s >= 80 ? 'var(--color-accent-500)' : s >= 60 ? '#fac85c' : '#7a6f90'; };

  var currentPos = null;

  function calcScore(candSkills, reqSkills, prefSkills) {
    var cs = (candSkills || []).map(function(s){ return s.toLowerCase(); });
    var req  = reqSkills  || [];
    var pref = prefSkills || [];
    var reqMatch  = req.length  ? req.filter(function(s){ return cs.indexOf(s.toLowerCase()) > -1; }).length  : 0;
    var prefMatch = pref.length ? pref.filter(function(s){ return cs.indexOf(s.toLowerCase()) > -1; }).length : 0;
    var score = Math.round(
      (req.length  ? (reqMatch  / req.length)  * 70 : 70) +
      (pref.length ? (prefMatch / pref.length) * 30 : 30)
    );
    return Math.max(1, Math.min(100, score));
  }

  async function recalcCandidateScores(reqSkills, prefSkills) {
    try {
      var res = await fetch(SB_URL + '/rest/v1/candidates?position_id=eq.' + posId + '&select=id,skills', { headers: sbHeaders() });
      if (!res.ok) return;
      var candidates = await res.json();
      if (!candidates.length) return;
      await Promise.all(candidates.map(function(c) {
        var newScore = calcScore(c.skills, reqSkills, prefSkills);
        return fetch(SB_URL + '/rest/v1/candidates?id=eq.' + c.id, {
          method: 'PATCH',
          headers: sbHeaders(),
          body: JSON.stringify({ score: newScore })
        });
      }));
      showToast(candidates.length + ' adayın skoru güncellendi.', true);
      // Tabloyu yenile
      var tbodyRes = await fetch(SB_URL + '/rest/v1/candidates?position_id=eq.' + posId + '&select=*&order=score.desc', { headers: sbHeaders() });
      if (!tbodyRes.ok) return;
      var updatedCands = await tbodyRes.json();
      var tbody = document.getElementById('pos-cand-tbody');
      if (!tbody) return;
      tbody.innerHTML = updatedCands.map(function(c, idx) {
        var initials = c.name.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2);
        var sc = c.score || 0;
        var date = new Date(c.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});
        return '<tr>' +
          '<td><div class="candidate-cell"><div class="cand-avatar" style="background:' + colors[idx%colors.length] + '">' + initials + '</div><div><div class="cand-name">' + c.name + '</div><div class="cand-email">' + c.email + '</div></div></div></td>' +
          '<td><div class="score-wrap"><div class="score-bar"><div class="score-fill" style="width:' + sc + '%;background:' + scoreColor(sc) + '"></div></div><span class="score-num" style="color:' + scoreColor(sc) + '">' + sc + '</span></div></td>' +
          '<td><span class="status-badge ' + (statusMap[c.status]||'status-review') + '">' + (statusLabel[c.status]||c.status) + '</span></td>' +
          '<td class="date-cell">' + date + '</td>' +
          '<td><button class="row-action-btn" data-href="/adaylar/' + c.id + '">İncele →</button></td>' +
        '</tr>';
      }).join('');
      // İstatistikleri güncelle
      var avg = updatedCands.length ? Math.round(updatedCands.reduce(function(s,c){return s+(c.score||0);},0)/updatedCands.length) : 0;
      var avgEl = document.getElementById('ps-avg');
      if (avgEl) avgEl.textContent = avg || '—';
    } catch(e) {}
  }

  (async function() {
    var results = await Promise.all([
      fetch(SB_URL + '/rest/v1/positions?id=eq.' + posId + '&select=*', { headers: sbHeaders() }).then(function(r){ return r.json(); }),
      fetch(SB_URL + '/rest/v1/candidates?position_id=eq.' + posId + '&select=*&order=score.desc', { headers: sbHeaders() }).then(function(r){ return r.json(); }),
    ]);

    document.getElementById('pos-loading').style.display = 'none';

    var pos  = results[0][0];
    var cands = results[1] || [];

    if (!pos) { document.getElementById('pos-notfound').style.display = 'block'; return; }
    currentPos = pos;

    document.getElementById('pos-content').style.display = 'block';
    document.getElementById('pos-breadcrumb').textContent = pos.title;
    document.getElementById('pos-all-cands-link').href = '/adaylar?pos=' + posId;

    document.getElementById('pos-title').textContent = pos.title;

    var badge = document.getElementById('pos-status-badge');
    badge.textContent = pos.status === 'aktif' ? 'Aktif' : 'Kapalı';
    badge.className = 'status-badge ' + (pos.status === 'aktif' ? 'status-active' : 'status-closed');

    document.getElementById('pos-meta').textContent =
      [pos.dept, pos.type, pos.level, pos.location].filter(Boolean).join(' · ');

    var toggleBtn = document.getElementById('toggle-status-btn');
    toggleBtn.textContent = pos.status === 'aktif' ? 'Pasife Al' : 'Aktive Et';

    if (pos.description) {
      var descEl = document.getElementById('pos-desc');
      descEl.textContent = pos.description;
      descEl.style.display = 'block';
    }

    var reqChips = document.getElementById('pos-required-chips');
    var prefChips = document.getElementById('pos-preferred-chips');
    (pos.required_skills||[]).forEach(function(s){
      var span = document.createElement('span');
      span.className = 'skill-chip skill-chip-req';
      span.textContent = s;
      reqChips.appendChild(span);
    });
    (pos.preferred_skills||[]).forEach(function(s){
      var span = document.createElement('span');
      span.className = 'skill-chip skill-chip-pref';
      span.textContent = s;
      prefChips.appendChild(span);
    });

    // icon rengi
    var iconWrap = document.getElementById('pos-icon-wrap');
    iconWrap.style.background = 'rgba(124,92,250,0.15)';
    iconWrap.style.color = '#a48bff';

    // istatistikler
    var total = cands.length;
    var avg = total ? Math.round(cands.reduce(function(s,c){return s+(c.score||0);},0)/total) : 0;
    var interviewCount = cands.filter(function(c){return c.status==='mulakat';}).length;
    var offerCount     = cands.filter(function(c){return c.status==='teklif';}).length;

    document.getElementById('ps-total').textContent    = total;
    document.getElementById('ps-avg').textContent      = avg || '—';
    document.getElementById('ps-interview').textContent = interviewCount;
    document.getElementById('ps-offer').textContent    = offerCount;

    // aday tablosu
    if (cands.length === 0) {
      document.getElementById('pos-cand-empty').style.display = 'flex';
    } else {
      document.getElementById('pos-cand-table').style.display = 'block';
      document.getElementById('pos-cand-tbody').addEventListener('click', function(e) {
        var btn = e.target.closest('button[data-href]');
        if (btn) window.location.href = btn.getAttribute('data-href');
      });
      document.getElementById('pos-cand-tbody').innerHTML = cands.map(function(c, idx) {
        var initials = c.name.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2);
        var sc = c.score || 0;
        var date = new Date(c.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});
        return '<tr>' +
          '<td><div class="candidate-cell"><div class="cand-avatar" style="background:' + colors[idx%colors.length] + '">' + initials + '</div><div><div class="cand-name">' + c.name + '</div><div class="cand-email">' + c.email + '</div></div></div></td>' +
          '<td><div class="score-wrap"><div class="score-bar"><div class="score-fill" style="width:' + sc + '%;background:' + scoreColor(sc) + '"></div></div><span class="score-num" style="color:' + scoreColor(sc) + '">' + sc + '</span></div></td>' +
          '<td><span class="status-badge ' + (statusMap[c.status]||'status-review') + '">' + (statusLabel[c.status]||c.status) + '</span></td>' +
          '<td class="date-cell">' + date + '</td>' +
          '<td><button class="row-action-btn" data-href="/adaylar/' + c.id + '">İncele →</button></td>' +
        '</tr>';
      }).join('');
    }

    // ── Silme Modalı ──
    document.getElementById('delete-pos-btn').addEventListener('click', function() {
      document.getElementById('delete-pos-name').textContent = pos.title;
      document.getElementById('delete-pos-modal').style.display = 'flex';
    });
    document.getElementById('delete-modal-close').addEventListener('click', function(){ document.getElementById('delete-pos-modal').style.display='none'; });
    document.getElementById('delete-modal-cancel').addEventListener('click', function(){ document.getElementById('delete-pos-modal').style.display='none'; });
    document.getElementById('delete-pos-modal').addEventListener('click', function(e){ if(e.target===this) this.style.display='none'; });

    document.getElementById('delete-pos-confirm-btn').addEventListener('click', async function() {
      this.disabled = true; this.textContent = 'Siliniyor…';
      var res = await fetch(SB_URL + '/rest/v1/positions?id=eq.' + posId, {
        method: 'DELETE', headers: sbHeaders()
      });
      if (res.ok || res.status === 204) {
        showToast('Pozisyon silindi.', true);
        setTimeout(function(){ window.location.href = '/pozisyonlar'; }, 800);
      } else {
        showToast('Silme işlemi başarısız.', false);
        this.disabled = false; this.textContent = 'Evet, Sil';
      }
    });

    // CV Yükle butonu
    document.getElementById('cv-yükle-btn').addEventListener('click', function() {
      window.location.href = '/adaylar?pos=' + posId;
    });

    // ── Edit Modal ──
    function openEditModal() {
      document.getElementById('ep-title').value = pos.title || '';
      document.getElementById('ep-dept').value = pos.dept || '';
      document.getElementById('ep-type').value = pos.type || 'Tam Zamanlı';
      document.getElementById('ep-level').value = pos.level || 'Mid-level';
      document.getElementById('ep-location').value = pos.location || '';
      document.getElementById('ep-required-skills').value = (pos.required_skills||[]).join(', ');
      document.getElementById('ep-preferred-skills').value = (pos.preferred_skills||[]).join(', ');
      document.getElementById('ep-desc').value = pos.description || '';
      document.getElementById('edit-pos-modal').style.display = 'flex';
    }
    function closeEditModal() { document.getElementById('edit-pos-modal').style.display = 'none'; }

    document.getElementById('edit-pos-btn').addEventListener('click', openEditModal);
    document.getElementById('edit-modal-close').addEventListener('click', closeEditModal);
    document.getElementById('edit-modal-cancel').addEventListener('click', closeEditModal);
    document.getElementById('edit-pos-modal').addEventListener('click', function(e){ if(e.target===this) closeEditModal(); });

    document.getElementById('edit-pos-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = document.getElementById('ep-submit-btn');
      btn.disabled = true; btn.textContent = 'Kaydediliyor…';
      var updates = {
        title:            document.getElementById('ep-title').value.trim(),
        dept:             document.getElementById('ep-dept').value.trim(),
        type:             document.getElementById('ep-type').value,
        level:            document.getElementById('ep-level').value,
        location:         document.getElementById('ep-location').value.trim(),
        required_skills:  document.getElementById('ep-required-skills').value.split(',').map(function(s){return s.trim();}).filter(Boolean),
        preferred_skills: document.getElementById('ep-preferred-skills').value.split(',').map(function(s){return s.trim();}).filter(Boolean),
        description:      document.getElementById('ep-desc').value.trim(),
      };
      var res = await fetch(SB_URL + '/rest/v1/positions?id=eq.' + posId, {
        method: 'PATCH', headers: sbHeaders(), body: JSON.stringify(updates)
      });
      btn.disabled = false; btn.textContent = 'Kaydet';
      if (res.ok) {
        Object.assign(currentPos, updates);
        Object.assign(pos, updates);
        document.getElementById('pos-title').textContent = updates.title;
        document.getElementById('pos-breadcrumb').textContent = updates.title;
        document.getElementById('pos-meta').textContent = [updates.dept, updates.type, updates.level, updates.location].filter(Boolean).join(' · ');
        if (updates.description) { var d = document.getElementById('pos-desc'); d.textContent = updates.description; d.style.display='block'; }
        // skill chips yenile
        var reqWrap = document.getElementById('pos-required-chips');
        var prefWrap = document.getElementById('pos-preferred-chips');
        reqWrap.innerHTML = ''; prefWrap.innerHTML = '';
        updates.required_skills.forEach(function(s){ var sp=document.createElement('span'); sp.className='skill-chip skill-chip-req'; sp.textContent=s; reqWrap.appendChild(sp); });
        updates.preferred_skills.forEach(function(s){ var sp=document.createElement('span'); sp.className='skill-chip skill-chip-pref'; sp.textContent=s; prefWrap.appendChild(sp); });
        closeEditModal();
        showToast('Pozisyon güncellendi. Aday skorları yeniden hesaplanıyor…', true);
        // Skill değişince adayların skorlarını yeniden hesapla
        recalcCandidateScores(updates.required_skills, updates.preferred_skills);
      } else {
        showToast('Güncelleme başarısız.', false);
      }
    });

    // Durum toggle
    toggleBtn.addEventListener('click', async function() {
      var newStatus = currentPos.status === 'aktif' ? 'kapali' : 'aktif';
      var res = await fetch(SB_URL + '/rest/v1/positions?id=eq.' + posId, {
        method: 'PATCH',
        headers: sbHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        currentPos.status = newStatus;
        badge.textContent = newStatus === 'aktif' ? 'Aktif' : 'Kapalı';
        badge.className = 'status-badge ' + (newStatus === 'aktif' ? 'status-active' : 'status-closed');
        toggleBtn.textContent = newStatus === 'aktif' ? 'Pasife Al' : 'Aktive Et';
      }
    });
  })();
})();
</script>
${sidebarScript}
`;

export default pozisyonDetayMarkup;
