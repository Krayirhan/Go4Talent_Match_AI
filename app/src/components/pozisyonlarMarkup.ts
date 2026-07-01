import { sidebar, sidebarScript } from './sidebarMarkup';
import { SB_URL, SB_KEY, sbHelpers } from '../lib/supabaseConfig';

const pozisyonlarMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('pozisyonlar')}

  <main class="dash-main">
    <div class="dash-topbar">
      <div>
        <div class="dash-greeting-eyebrow">Açık Roller</div>
        <h1 class="dash-greeting-title">Pozisyonlar</h1>
        <p class="dash-greeting-sub">Aktif iş ilanlarını ve aday havuzunu yönetin.</p>
      </div>
      <button class="dash-cta" id="btn-new-pos">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Yeni Pozisyon
      </button>
    </div>

    <div class="page-toolbar">
      <div class="search-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" id="pos-search" type="text" placeholder="Pozisyon ara…" />
      </div>
      <div class="filter-row">
        <select class="filter-select" id="pos-filter-status">
          <option value="">Tüm Durumlar</option>
          <option value="aktif">Aktif</option>
          <option value="pasif">Pasif</option>
          <option value="kapali">Kapalı</option>
        </select>
      </div>
    </div>

    <div id="pos-loading" style="text-align:center;padding:3rem;color:var(--text-tertiary)">Yükleniyor…</div>
    <div id="pos-grid" class="pos-grid" style="display:none"></div>
    <div id="pos-empty" class="dash-empty" style="display:none;margin-top:2rem;border:1.5px dashed rgba(124,92,250,0.2);border-radius:18px;padding:3rem 1rem">
      <div class="dash-empty-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
      <div class="dash-empty-title">Henüz pozisyon yok</div>
      <p class="dash-empty-text">İlk pozisyonunuzu oluşturun ve aday eşleştirmeye başlayın.</p>
      <button class="dash-empty-btn" id="btn-new-pos-2">+ Pozisyon Oluştur</button>
    </div>
  </main>
</div>

<!-- ── Yeni Pozisyon Modalı ── -->
<div id="pos-modal" class="modal-backdrop" style="display:none">
  <div class="modal-box">
    <div class="modal-head">
      <h2 class="modal-title">Yeni Pozisyon</h2>
      <button class="modal-close" id="pos-modal-close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <form id="pos-form" class="modal-form">
      <div class="form-grid">
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Pozisyon Adı *</label>
          <input class="sett-input" id="pf-title" type="text" placeholder="ör. Kıdemli Frontend Geliştirici" required />
        </div>
        <div class="sett-field">
          <label class="sett-label">Departman *</label>
          <input class="sett-input" id="pf-dept" type="text" placeholder="ör. Mühendislik" required />
        </div>
        <div class="sett-field">
          <label class="sett-label">Çalışma Tipi</label>
          <select class="sett-input" id="pf-type">
            <option>Tam Zamanlı</option>
            <option>Yarı Zamanlı</option>
            <option>Sözleşmeli</option>
            <option>Staj</option>
          </select>
        </div>
        <div class="sett-field">
          <label class="sett-label">Seviye</label>
          <select class="sett-input" id="pf-level">
            <option>Junior</option>
            <option>Mid-level</option>
            <option>Senior</option>
            <option>Lead</option>
            <option>Direktör</option>
          </select>
        </div>
        <div class="sett-field">
          <label class="sett-label">Lokasyon</label>
          <input class="sett-input" id="pf-location" type="text" placeholder="ör. İstanbul / Uzaktan" />
        </div>
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Zorunlu Skill'ler <span style="color:var(--color-primary-500);font-size:0.75rem">(ağırlık %70)</span></label>
          <input class="sett-input" id="pf-required-skills" type="text" placeholder="ör. React, TypeScript, Node.js (virgülle ayırın)" />
        </div>
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Tercih Edilen Skill'ler <span style="color:var(--text-tertiary);font-size:0.75rem">(ağırlık %30)</span></label>
          <input class="sett-input" id="pf-preferred-skills" type="text" placeholder="ör. GraphQL, Docker, AWS (virgülle ayırın)" />
        </div>
        <div class="sett-field" style="grid-column:1/-1">
          <label class="sett-label">Pozisyon Açıklaması</label>
          <textarea class="sett-input" id="pf-desc" rows="4" placeholder="Pozisyon hakkında kısa açıklama…" style="resize:vertical"></textarea>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="outline-btn" id="pos-modal-cancel">İptal</button>
        <button type="submit" class="dash-cta" style="height:42px;font-size:0.875rem" id="pos-submit-btn">Pozisyon Oluştur</button>
      </div>
    </form>
  </div>
</div>

<script>
(function () {
  ${sbHelpers}

  var allPositions = [];

  async function fetchPositions() {
    var res = await fetch(SB_URL + '/rest/v1/positions?select=*,candidates(id)&order=created_at.desc', { headers: sbHeaders() });
    if (!res.ok) return [];
    return await res.json();
  }

  async function insertPosition(pos) {
    var res = await fetch(SB_URL + '/rest/v1/positions', {
      method: 'POST',
      headers: sbHeaders({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(pos)
    });
    if (res.status === 401) {
      localStorage.removeItem('sb_access_token');
      localStorage.removeItem('g4_user_email');
      window.location.replace('/login');
      return false;
    }
    if (!res.ok) {
      try {
        var err = await res.json();
        console.error('Position insert error:', res.status, err);
      } catch(e) {}
    }
    return res.ok;
  }

  function colorForDept(dept) {
    var d = (dept || '').toLowerCase();
    if (d.includes('müh') || d.includes('tech') || d.includes('yazılım')) return { bg:'rgba(124,92,250,0.15)', color:'#a48bff' };
    if (d.includes('veri') || d.includes('data')) return { bg:'rgba(92,184,250,0.1)', color:'#5cb8fa' };
    if (d.includes('ürün') || d.includes('product')) return { bg:'rgba(194,245,66,0.1)', color:'#c2f542' };
    if (d.includes('ik') || d.includes('insan')) return { bg:'rgba(250,92,200,0.1)', color:'#fa5cc8' };
    return { bg:'rgba(124,92,250,0.15)', color:'#a48bff' };
  }

  function renderPositions(filter, search) {
    var loading = document.getElementById('pos-loading');
    var grid = document.getElementById('pos-grid');
    var empty = document.getElementById('pos-empty');
    if (!grid) return;

    var filtered = allPositions.filter(function(p) {
      var matchStatus = !filter || p.status === filter;
      var matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.dept||'').toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });

    loading.style.display = 'none';

    if (filtered.length === 0) {
      grid.style.display = 'none';
      grid.innerHTML = '';
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';
    grid.style.display = 'grid';

    grid.innerHTML = filtered.map(function(p) {
      var c = colorForDept(p.dept);
      var isClosed = p.status === 'kapali';
      var badgeClass = isClosed ? 'status-closed' : 'status-active';
      var badgeText = isClosed ? 'Kapalı' : 'Aktif';
      var candCount = (p.candidates || []).length;
      var reqChips = (p.required_skills||[]).slice(0,4).map(function(s){ return '<span class="skill-chip skill-chip-req">'+s+'</span>'; }).join('');
      var prefChips = (p.preferred_skills||[]).slice(0,2).map(function(s){ return '<span class="skill-chip skill-chip-pref">'+s+'</span>'; }).join('');
      return '<div class="pos-card' + (isClosed ? ' pos-card-closed' : '') + '">' +
        '<div class="pos-card-head">' +
          '<div class="pos-icon" style="background:' + c.bg + ';color:' + c.color + '">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>' +
          '</div>' +
          '<span class="status-badge ' + badgeClass + '">' + badgeText + '</span>' +
        '</div>' +
        '<div class="pos-title">' + p.title + '</div>' +
        '<div class="pos-dept">' + (p.dept||'') + ' · ' + (p.type||'Tam Zamanlı') + ' · ' + (p.location||'—') + '</div>' +
        '<div class="pos-skill-chips">' + reqChips + prefChips + '</div>' +
        '<div class="pos-stats">' +
          '<div class="pos-stat"><span class="pos-stat-val">' + candCount + '</span><span class="pos-stat-lbl">Başvuru</span></div>' +
          '<div class="pos-stat"><span class="pos-stat-val">' + (p.level||'—') + '</span><span class="pos-stat-lbl">Seviye</span></div>' +
        '</div>' +
        '<div class="pos-footer">' +
          '<span class="pos-date">' + new Date(p.created_at).toLocaleDateString("tr-TR", {day:"numeric",month:"short",year:"numeric"}) + '</span>' +
          '<button class="row-action-btn" data-href="/pozisyonlar/' + p.id + '">Detay →</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ── Modal ──
  function openModal() { document.getElementById('pos-modal').style.display = 'flex'; }
  function closeModal() { document.getElementById('pos-modal').style.display = 'none'; document.getElementById('pos-form').reset(); }

  document.getElementById('btn-new-pos').addEventListener('click', openModal);
  var btn2 = document.getElementById('btn-new-pos-2');
  if (btn2) btn2.addEventListener('click', openModal);
  document.getElementById('pos-modal-close').addEventListener('click', closeModal);
  document.getElementById('pos-modal-cancel').addEventListener('click', closeModal);
  document.getElementById('pos-modal').addEventListener('click', function(e){ if (e.target === this) closeModal(); });

  // ── Form Submit ──
  document.getElementById('pos-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var submitBtn = document.getElementById('pos-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Kaydediliyor…';

    var newPos = {
      id: 'pos_' + Date.now(),
      title: document.getElementById('pf-title').value.trim(),
      dept: document.getElementById('pf-dept').value.trim(),
      type: document.getElementById('pf-type').value,
      level: document.getElementById('pf-level').value,
      location: document.getElementById('pf-location').value.trim(),
      required_skills: document.getElementById('pf-required-skills').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean),
      preferred_skills: document.getElementById('pf-preferred-skills').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean),
      description: document.getElementById('pf-desc').value.trim(),
      status: 'aktif',
      user_id: getUserId(),
    };

    var ok = await insertPosition(newPos);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Pozisyon Oluştur';

    if (ok) {
      allPositions = await fetchPositions();
      closeModal();
      renderPositions(document.getElementById('pos-filter-status').value, document.getElementById('pos-search').value);
      showToast('Pozisyon başarıyla oluşturuldu.', true);
    } else {
      showToast('Pozisyon kaydedilemedi. Lütfen tekrar deneyin.', false);
    }
  });

  document.getElementById('pos-grid').addEventListener('click', function(e) {
    var btn = e.target.closest('button[data-href]');
    if (btn) window.location.href = btn.getAttribute('data-href');
  });

  // ── Filtre & Arama ──
  document.getElementById('pos-search').addEventListener('input', function() {
    renderPositions(document.getElementById('pos-filter-status').value, this.value);
  });
  document.getElementById('pos-filter-status').addEventListener('change', function() {
    renderPositions(this.value, document.getElementById('pos-search').value);
  });

  // ── İlk yükleme ──
  (async function() {
    allPositions = await fetchPositions();
    renderPositions('', '');
  })();
})();
</script>
${sidebarScript}
`;

export default pozisyonlarMarkup;
