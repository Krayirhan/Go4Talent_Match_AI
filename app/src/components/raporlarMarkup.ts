import { sidebar, sidebarScript } from './sidebarMarkup';
import { SB_URL, SB_KEY, sbHelpers } from '../lib/supabaseConfig';

const raporlarMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('raporlar')}

  <main class="dash-main">
    <div class="dash-topbar">
      <div>
        <div class="dash-greeting-eyebrow">Analitik</div>
        <h1 class="dash-greeting-title">Raporlar</h1>
        <p class="dash-greeting-sub">İşe alım sürecinizin tüm metriklerini takip edin.</p>
      </div>
      <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
        <select class="filter-select" id="rap-date-filter">
          <option value="all">Tüm Zamanlar</option>
          <option value="30">Son 30 Gün</option>
          <option value="90">Son 90 Gün</option>
          <option value="365">Son 1 Yıl</option>
        </select>
        <button class="outline-btn" id="rap-export-btn" style="display:flex;align-items:center;gap:0.4rem">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          CSV İndir
        </button>
      </div>
    </div>

    <div id="rap-loading" style="text-align:center;padding:3rem;color:var(--text-tertiary)">Yükleniyor…</div>
    <div id="rap-content" style="display:none">

      <!-- özet stat kartları -->
      <div class="dash-stats" style="margin-bottom:1.5rem">
        <div class="dash-stat-card" data-color="purple">
          <div class="dash-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <div class="dash-stat-label">Toplam Başvuru</div>
          <div class="dash-stat-value" id="rap-total">0</div>
          <div class="dash-stat-delta" id="rap-total-delta">—</div>
        </div>
        <div class="dash-stat-card" data-color="lime">
          <div class="dash-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="dash-stat-label">Eşleşme Oranı</div>
          <div class="dash-stat-value" id="rap-match">%0</div>
          <div class="dash-stat-delta" id="rap-match-delta">Skor ≥ 70 olanlar</div>
        </div>
        <div class="dash-stat-card" data-color="blue">
          <div class="dash-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="dash-stat-label">Ort. Eşleşme Skoru</div>
          <div class="dash-stat-value" id="rap-avg-score">0</div>
          <div class="dash-stat-delta">Tüm adayların ortalaması</div>
        </div>
        <div class="dash-stat-card" data-color="pink">
          <div class="dash-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="dash-stat-label">Teklif Aşamasında</div>
          <div class="dash-stat-value" id="rap-offer">0</div>
          <div class="dash-stat-delta">Teklif bekleyen adaylar</div>
        </div>
      </div>

      <!-- funnel -->
      <div class="dash-grid" style="margin-bottom:1.5rem">
        <div class="dash-panel">
          <div class="dash-panel-header">
            <span class="dash-panel-title">İşe Alım Hunisi</span>
          </div>
          <div class="funnel" id="rap-funnel">
            <div style="text-align:center;padding:2rem;color:var(--text-tertiary);font-size:0.85rem">Veri yükleniyor…</div>
          </div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel-header">
            <span class="dash-panel-title">Skor Dağılımı</span>
          </div>
          <div class="chart-wrap">
            <div class="bar-chart" id="rap-score-chart">
              <div style="text-align:center;padding:2rem;color:var(--text-tertiary);font-size:0.85rem">Veri yükleniyor…</div>
            </div>
          </div>
        </div>
      </div>

      <!-- pozisyon tablosu -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <span class="dash-panel-title">Pozisyon Bazlı Performans</span>
        </div>
        <div id="rap-pos-empty" class="dash-empty" style="display:none;padding:2rem">
          <div class="dash-empty-title">Henüz pozisyon yok</div>
          <p class="dash-empty-text">Pozisyon ekleyip aday yükledikten sonra burada görünür.</p>
        </div>
        <div class="data-table-wrap" id="rap-pos-table" style="border-radius:0;display:none">
          <table class="data-table">
            <thead>
              <tr>
                <th>Pozisyon</th>
                <th>Başvuru</th>
                <th>Eşleşme Oranı</th>
                <th>Ort. Skor</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody id="rap-pos-tbody"></tbody>
          </table>
        </div>
      </div>

    </div>
  </main>
</div>

<script>
(function () {
  ${sbHelpers}

  var allPositions = [];
  var allCandidates = [];
  var allHistory = [];

  function filterByDate(candidates, days) {
    if (!days || days === 'all') return candidates;
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(days));
    return candidates.filter(function(c){ return new Date(c.created_at) >= cutoff; });
  }

  function exportCSV() {
    var rows = [['Ad Soyad','E-posta','Pozisyon','Skor','Durum','Tarih']];
    allCandidates.forEach(function(c){
      rows.push([
        c.name || '', c.email || '', c.position_title || '',
        c.score || 0, c.status || '', c.created_at ? new Date(c.created_at).toLocaleDateString('tr-TR') : ''
      ]);
    });
    var csv = rows.map(function(r){ return r.map(function(v){ return '"'+(String(v).replace(/"/g,'""'))+'"'; }).join(','); }).join('\r\n');
    var blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href=url; a.download='go4talent-rapor.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV indirildi.', true);
  }

  document.getElementById('rap-export-btn').addEventListener('click', exportCSV);

  function renderReport(candidates, positions, history) {
    var total   = candidates.length;
    var matched = candidates.filter(function(c){ return c.score >= 70; }).length;
    var matchPct = total ? Math.round(matched / total * 100) : 0;
    var avgScore = total ? Math.round(candidates.reduce(function(s,c){ return s + (c.score||0); }, 0) / total) : 0;
    var offerCount = candidates.filter(function(c){ return c.status === 'teklif'; }).length;

    document.getElementById('rap-total').textContent      = total;
    document.getElementById('rap-total-delta').textContent = total ? total + ' aday kayıtlı' : 'Henüz aday yok';
    document.getElementById('rap-match').textContent      = '%' + matchPct;
    document.getElementById('rap-match-delta').textContent = matched + ' uyumlu aday (skor ≥ 70)';
    document.getElementById('rap-avg-score').textContent  = avgScore || '—';
    document.getElementById('rap-offer').textContent      = offerCount;

    // ── Funnel: status_history tablosundan gerçek geçiş sayıları ──
    // Her aday için bir statüye kaç kez geçiş yapıldığını say
    // (birden fazla geçiş varsa unique aday sayısı)
    var candIds = candidates.map(function(c){ return c.id; });
    var h = (history || []).filter(function(r){ return candIds.indexOf(r.candidate_id) > -1; });

    function uniqueCandsInStatus(status) {
      var ids = {};
      h.filter(function(r){ return r.status === status; }).forEach(function(r){ ids[r.candidate_id] = true; });
      return Object.keys(ids).length;
    }

    var hInceleniyor = uniqueCandsInStatus('inceleniyor');
    var hMulakat     = uniqueCandsInStatus('mulakat');
    var hTeklif      = uniqueCandsInStatus('teklif');
    var hReddedildi  = uniqueCandsInStatus('reddedildi');
    var useHistory   = h.length > 0;

    // Fallback: history yoksa mevcut status snapshot
    var inceleniyor = useHistory ? hInceleniyor : candidates.filter(function(c){ return c.status === 'inceleniyor'; }).length;
    var mulakat     = useHistory ? hMulakat     : candidates.filter(function(c){ return c.status === 'mulakat'; }).length;
    var teklif      = useHistory ? hTeklif      : candidates.filter(function(c){ return c.status === 'teklif'; }).length;
    var reddedildi  = useHistory ? hReddedildi  : candidates.filter(function(c){ return c.status === 'reddedildi'; }).length;

    function funnelRow(label, count, max, color, note) {
      var w = max ? Math.round(count / max * 100) : 0;
      return '<div class="funnel-row">' +
        '<div class="funnel-label">' + label + (note ? '<span style="font-size:0.68rem;color:var(--text-tertiary);margin-left:0.3rem">' + note + '</span>' : '') + '</div>' +
        '<div class="funnel-bar-wrap"><div class="funnel-bar" style="width:' + w + '%;background:' + color + '"></div></div>' +
        '<div class="funnel-val">' + count + '</div>' +
      '</div>';
    }

    var historyNote = useHistory ? '(geçiş)' : '(anlık)';
    document.getElementById('rap-funnel').innerHTML = total === 0
      ? '<div style="text-align:center;padding:2rem;color:var(--text-tertiary);font-size:0.85rem">Henüz aday yok</div>'
      : funnelRow('Toplam', total, total, 'rgba(124,92,250,0.3)', '') +
        funnelRow('İnceleniyor', inceleniyor, total, 'rgba(124,92,250,0.5)', historyNote) +
        funnelRow('Mülakat', mulakat, total, 'rgba(124,92,250,0.7)', historyNote) +
        funnelRow('Teklif', teklif, total, 'var(--color-primary-500)', historyNote) +
        funnelRow('Reddedildi', reddedildi, total, '#7a4050', historyNote);

    var buckets = [0, 0, 0, 0, 0];
    candidates.forEach(function(c) {
      var s = c.score || 0;
      if (s <= 20) buckets[0]++;
      else if (s <= 40) buckets[1]++;
      else if (s <= 60) buckets[2]++;
      else if (s <= 80) buckets[3]++;
      else buckets[4]++;
    });
    var maxBucket = Math.max.apply(null, buckets) || 1;
    var labels = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    document.getElementById('rap-score-chart').innerHTML = total === 0
      ? '<div style="text-align:center;padding:2rem;color:var(--text-tertiary);font-size:0.85rem">Henüz aday yok</div>'
      : '<div class="bar-group">' +
          buckets.map(function(b){ return '<div class="bar-col"><div class="' + (b === Math.max.apply(null,buckets) ? 'bar bar-accent' : 'bar') + '" style="height:' + Math.round(b/maxBucket*100) + '%"></div></div>'; }).join('') +
        '</div>' +
        '<div class="bar-labels">' + labels.map(function(l){ return '<span>' + l + '</span>'; }).join('') + '</div>';

    if (positions.length === 0) {
      document.getElementById('rap-pos-empty').style.display = 'flex';
      document.getElementById('rap-pos-table').style.display = 'none';
    } else {
      document.getElementById('rap-pos-table').style.display = 'block';
      document.getElementById('rap-pos-empty').style.display = 'none';
      document.getElementById('rap-pos-tbody').innerHTML = positions.map(function(p) {
        var posCands = candidates.filter(function(c){ return c.position_id === p.id; });
        var cnt = posCands.length;
        var avg = cnt ? Math.round(posCands.reduce(function(s,c){ return s+(c.score||0);},0)/cnt) : 0;
        var matchedCnt = posCands.filter(function(c){ return c.score >= 70; }).length;
        var matchPct2 = cnt ? Math.round(matchedCnt/cnt*100) : 0;
        var scoreColor = avg >= 80 ? 'var(--color-accent-500)' : avg >= 60 ? '#fac85c' : '#7a6f90';
        var badgeClass = p.status === 'aktif' ? 'status-active' : 'status-closed';
        var badgeText  = p.status === 'aktif' ? 'Aktif' : 'Kapalı';
        return '<tr>' +
          '<td><span class="cand-name">' + p.title + '</span></td>' +
          '<td>' + cnt + '</td>' +
          '<td><div class="score-wrap"><div class="score-bar"><div class="score-fill" style="width:' + matchPct2 + '%;background:' + scoreColor + '"></div></div><span class="score-num" style="color:' + scoreColor + '">%' + matchPct2 + '</span></div></td>' +
          '<td>' + (avg || '—') + '</td>' +
          '<td><span class="status-badge ' + badgeClass + '">' + badgeText + '</span></td>' +
        '</tr>';
      }).join('');
    }
  }

  document.getElementById('rap-date-filter').addEventListener('change', function() {
    var days = this.value;
    var filtered = filterByDate(allCandidates, days);
    var filteredHistory = days === 'all' ? allHistory : (function() {
      var cutoff = new Date(); cutoff.setDate(cutoff.getDate() - parseInt(days));
      return allHistory.filter(function(r){ return new Date(r.changed_at) >= cutoff; });
    })();
    renderReport(filtered, allPositions, filteredHistory);
  });

  (async function () {
    var results = await Promise.all([
      fetch(SB_URL + '/rest/v1/positions?select=*', { headers: sbHeaders() }).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
      fetch(SB_URL + '/rest/v1/candidates?select=*', { headers: sbHeaders() }).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
      fetch(SB_URL + '/rest/v1/candidate_status_history?select=candidate_id,status,changed_at&order=changed_at.asc', { headers: sbHeaders() }).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }),
    ]);

    allPositions  = Array.isArray(results[0]) ? results[0] : [];
    allCandidates = Array.isArray(results[1]) ? results[1] : [];
    allHistory    = results[2];

    document.getElementById('rap-loading').style.display = 'none';
    document.getElementById('rap-content').style.display = 'block';

    renderReport(allCandidates, allPositions, allHistory);
  })();
})();
</script>
${sidebarScript}
`;

export default raporlarMarkup;
