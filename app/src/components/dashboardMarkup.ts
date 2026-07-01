import { sidebar, sidebarScript } from './sidebarMarkup';
import { sbHelpers, BACKEND_URL } from '../lib/supabaseConfig';

const dashboardMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('dashboard')}

  <main class="dash-main">

    <div class="dash-topbar">
      <div>
        <div class="dash-greeting-eyebrow">Hoş Geldiniz</div>
        <h1 class="dash-greeting-title" id="dash-greeting-title">Merhaba 👋</h1>
        <p class="dash-greeting-sub">Bugün hangi pozisyon için en iyi adayı buluyoruz?</p>
      </div>
      <button class="dash-cta" onclick="window.location.href='/pozisyonlar'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Yeni Pozisyon Aç
      </button>
    </div>

    <div class="dash-stats">
      <div class="dash-stat-card" data-color="purple">
        <div class="dash-stat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        </div>
        <div class="dash-stat-label">Aktif Pozisyon</div>
        <div class="dash-stat-value" id="stat-aktif">0</div>
        <div class="dash-stat-delta" id="delta-aktif">İlk pozisyonu aç →</div>
      </div>
      <div class="dash-stat-card" data-color="blue">
        <div class="dash-stat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="dash-stat-label">Toplam Aday</div>
        <div class="dash-stat-value" id="stat-toplam">0</div>
        <div class="dash-stat-delta" id="delta-toplam">CV yükleyerek başla →</div>
      </div>
      <div class="dash-stat-card" data-color="lime">
        <div class="dash-stat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="dash-stat-label">Eşleşen Aday</div>
        <div class="dash-stat-value" id="stat-eslesen">0</div>
        <div class="dash-stat-delta" id="delta-eslesen">Eşleştirme bekleniyor</div>
      </div>
      <div class="dash-stat-card" data-color="pink">
        <div class="dash-stat-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="dash-stat-label">Ort. Karar Süresi</div>
        <div class="dash-stat-value">—</div>
        <div class="dash-stat-delta">Veri birikince hesaplanır</div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="dash-panel">
        <div class="dash-panel-header">
          <span class="dash-panel-title">Son Adaylar</span>
          <a href="/adaylar" class="dash-panel-link">Tümünü Gör →</a>
        </div>
        <div id="recent-empty" class="dash-empty">
          <div class="dash-empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="dash-empty-title">Henüz aday yok</div>
          <p class="dash-empty-text">İlk pozisyonunuzu açın, CV'leri yükleyin.</p>
          <button class="dash-empty-btn" onclick="window.location.href='/pozisyonlar'">Pozisyon Oluştur</button>
        </div>
        <div id="recent-table" class="data-table-wrap" style="display:none;border:none;border-radius:0">
          <table class="data-table">
            <thead><tr><th>Aday</th><th>Pozisyon</th><th>Skor</th><th>Durum</th><th></th></tr></thead>
            <tbody id="recent-tbody"></tbody>
          </table>
        </div>
      </div>

      <div class="dash-panel">
        <div class="dash-panel-header">
          <span class="dash-panel-title">Hızlı Başlangıç</span>
        </div>
        <a href="/pozisyonlar" class="dash-step">
          <div class="dash-step-num">1</div>
          <div><div class="dash-step-name">Pozisyon oluştur</div><div class="dash-step-desc">Rol, yetkinlik ve seviye tanımla</div></div>
          <svg class="dash-step-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
        <a href="/adaylar" class="dash-step">
          <div class="dash-step-num">2</div>
          <div><div class="dash-step-name">CV'leri yükle</div><div class="dash-step-desc">Toplu veya tek tek, PDF/Word</div></div>
          <svg class="dash-step-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
        <a href="/raporlar" class="dash-step">
          <div class="dash-step-num">3</div>
          <div><div class="dash-step-name">Eşleşmeleri incele</div><div class="dash-step-desc">Skorlara göre sırala, karar ver</div></div>
          <svg class="dash-step-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>
    </div>

    <div class="dash-features">
      <div class="dash-feature-card">
        <div class="dash-feature-icon" style="background:rgba(124,92,250,0.12);color:#a48bff">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div class="dash-feature-title">Otomatik Eşleştirme</div>
        <p class="dash-feature-text">Yüzlerce CV'yi saniyeler içinde pozisyona göre skorlar, en uygun adayları öne çıkarır.</p>
        <span class="dash-feature-tag" style="background:rgba(124,92,250,0.12);color:#a48bff">Yapay Zeka</span>
      </div>
      <div class="dash-feature-card">
        <div class="dash-feature-icon" style="background:rgba(194,245,66,0.1);color:#c2f542">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
        </div>
        <div class="dash-feature-title">Anlık Raporlama</div>
        <p class="dash-feature-text">İşe alım sürecinizin her adımını ölçün. Hangi kaynak en iyi adayı getiriyor?</p>
        <span class="dash-feature-tag" style="background:rgba(194,245,66,0.1);color:#c2f542">Analitik</span>
      </div>
      <div class="dash-feature-card">
        <div class="dash-feature-icon" style="background:rgba(92,184,250,0.1);color:#5cb8fa">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="dash-feature-title">Ekip Yönetimi</div>
        <p class="dash-feature-text">Birden fazla kullanıcı, rol bazlı yetki. İK ekibiniz birlikte çalışır, kararlar şeffaf olur.</p>
        <span class="dash-feature-tag" style="background:rgba(92,184,250,0.1);color:#5cb8fa">Çok Kullanıcı</span>
      </div>
    </div>

  </main>
</div>

<script>
(function () {
  ${sbHelpers}
  var BACKEND_URL = '${BACKEND_URL}';

  var colors = ['linear-gradient(135deg,#7c5cfa,#4530c2)','linear-gradient(135deg,#5cb8fa,#2980c2)','linear-gradient(135deg,#fa5cc8,#c23080)','linear-gradient(135deg,#fa8c5c,#c25030)','linear-gradient(135deg,#5cfaaa,#20c280)'];
  var statusMap = { inceleniyor:'status-review', mulakat:'status-interview', teklif:'status-offer', reddedildi:'status-rejected' };
  var statusLabel = { inceleniyor:'İnceleniyor', mulakat:'Mülakat', teklif:'Teklif', reddedildi:'Reddedildi' };
  function formatDuration(ms) {
    if (!ms || ms <= 0) return '—';
    var hours = Math.round(ms / (1000 * 60 * 60));
    if (hours < 24) return hours + ' sa';
    return Math.round(hours / 24) + ' gün';
  }
  var scoreColor = function(s){ return s >= 80 ? 'var(--color-accent-500)' : s >= 60 ? '#fac85c' : '#7a6f90'; };

  (async function() {
    var results = await Promise.all([
      fetch(BACKEND_URL + '/api/positions', { headers: sbHeaders() }).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
      fetch(BACKEND_URL + '/api/candidates', { headers: sbHeaders() }).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
      fetch(BACKEND_URL + '/api/candidate-status-history', { headers: sbHeaders() }).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
    ]);

    var positions  = Array.isArray(results[0]) ? results[0] : [];
    var recent     = Array.isArray(results[1]) ? results[1].slice(0, 5) : [];
    var allCands   = Array.isArray(results[1]) ? results[1] : [];
    var history    = Array.isArray(results[2]) ? results[2] : [];

    var aktif   = positions.filter(function(p){ return p.status === 'aktif'; }).length;
    var toplam  = allCands.length;
    var eslesen = allCands.filter(function(c){ return c.score >= 70; }).length;

    document.getElementById('stat-aktif').textContent   = aktif;
    document.getElementById('stat-toplam').textContent  = toplam;
    document.getElementById('stat-eslesen').textContent = eslesen;
    document.getElementById('delta-aktif').textContent   = aktif   ? aktif + ' açık pozisyon'   : 'İlk pozisyonu aç →';
    document.getElementById('delta-toplam').textContent  = toplam  ? toplam + ' aday kayıtlı'    : 'CV yükleyerek başla →';
    document.getElementById('delta-eslesen').textContent = eslesen ? eslesen + ' uyumlu aday'    : 'Eşleştirme bekleniyor';

    var decisionDurations = [];
    var firstHistoryByCandidate = {};
    history.forEach(function(item) {
      if (!item || !item.candidate_id || !item.changed_at) return;
      if (!firstHistoryByCandidate[item.candidate_id]) firstHistoryByCandidate[item.candidate_id] = item;
    });
    allCands.forEach(function(c) {
      var firstChange = firstHistoryByCandidate[c.id];
      if (!firstChange || !c.created_at) return;
      var startAt = new Date(c.created_at).getTime();
      var endAt = new Date(firstChange.changed_at).getTime();
      if (endAt > startAt) decisionDurations.push(endAt - startAt);
    });
    var avgDecision = decisionDurations.length ? Math.round(decisionDurations.reduce(function(sum, value){ return sum + value; }, 0) / decisionDurations.length) : 0;
    var decisionCard = document.querySelector('.dash-stat-card[data-color="pink"]');
    if (decisionCard) {
      var valueEl = decisionCard.querySelector('.dash-stat-value');
      var deltaEl = decisionCard.querySelector('.dash-stat-delta');
      if (valueEl) valueEl.textContent = avgDecision ? formatDuration(avgDecision) : '—';
      if (deltaEl) deltaEl.textContent = avgDecision ? decisionDurations.length + ' aday üzerinden hesaplandı' : 'Karar geçmişi oluşunca görünür';
    }

    var tbody = document.getElementById('recent-tbody');
    if (!tbody) return;

    if (recent.length === 0) {
      document.getElementById('recent-empty').style.display = 'flex';
      document.getElementById('recent-table').style.display = 'none';
      return;
    }
    document.getElementById('recent-empty').style.display = 'none';
    document.getElementById('recent-table').style.display = 'block';

    tbody.addEventListener('click', function(e) {
      var btn = e.target.closest('button[data-href]');
      if (btn) window.location.href = btn.getAttribute('data-href');
    });
    tbody.innerHTML = recent.map(function(c, idx) {
      var initials = c.name.split(' ').map(function(w){ return w[0]; }).join('').toUpperCase().slice(0,2);
      return '<tr>' +
        '<td><div class="candidate-cell"><div class="cand-avatar" style="background:' + colors[idx%colors.length] + '">' + initials + '</div><div><div class="cand-name">' + c.name + '</div><div class="cand-email">' + c.email + '</div></div></div></td>' +
        '<td><span class="pos-tag">' + (c.position_title||'—') + '</span></td>' +
        '<td><div class="score-wrap"><div class="score-bar"><div class="score-fill" style="width:' + c.score + '%;background:' + scoreColor(c.score) + '"></div></div><span class="score-num" style="color:' + scoreColor(c.score) + '">' + c.score + '</span></div></td>' +
        '<td><span class="status-badge ' + (statusMap[c.status]||'status-review') + '">' + (statusLabel[c.status]||c.status) + '</span></td>' +
        '<td><button class="row-action-btn" data-href="/adaylar/' + c.id + '">İncele →</button></td>' +
      '</tr>';
    }).join('');
  })();
})();
</script>
${sidebarScript}
`;

export default dashboardMarkup;
