export function sidebar(active: 'dashboard' | 'adaylar' | 'pozisyonlar' | 'raporlar' | 'ayarlar' | 'mulakat'): string {
  const link = (id: string, href: string, icon: string, label: string) => `
    <a href="${href}" class="dash-nav-link${active === id ? ' active' : ''}">
      ${icon}
      ${label}
    </a>`;

  const icons = {
    dashboard:   `<svg class="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
    adaylar:     `<svg class="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    pozisyonlar: `<svg class="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    raporlar:    `<svg class="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
    mulakat:     `<svg class="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    ayarlar:     `<svg class="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>`,
  };

  return `
  <button class="dash-hamburger" id="dash-hamburger" aria-label="Menüyü Aç">
    <span></span><span></span><span></span>
  </button>
  <div class="dash-sidebar-overlay" id="dash-sidebar-overlay"></div>
  <aside class="dash-sidebar" id="dash-sidebar">
    <a href="/" class="dash-logo">
      <div class="dash-logo-mark">G4</div>
      <span class="dash-logo-name">Go4Talent<br>MatchAI</span>
    </a>
    <div>
      <div class="dash-nav-label">Ana Menü</div>
      <nav class="dash-nav">
        ${link('dashboard',   '/dashboard',   icons.dashboard,   'Genel Bakış')}
        ${link('adaylar',     '/adaylar',     icons.adaylar,     'Adaylar')}
        ${link('pozisyonlar', '/pozisyonlar', icons.pozisyonlar, 'Pozisyonlar')}
        ${link('raporlar',    '/raporlar',    icons.raporlar,    'Raporlar')}
        ${link('mulakat',     '/mulakat',     icons.mulakat,     'Ön Görüşme')}
      </nav>
    </div>
    <div>
      <div class="dash-nav-label">Sistem</div>
      <nav class="dash-nav">
        ${link('ayarlar', '/ayarlar', icons.ayarlar, 'Ayarlar')}
      </nav>
    </div>
    <div class="dash-sidebar-footer">
      <div class="dash-user">
        <div class="dash-user-avatar" id="dash-user-initial">G</div>
        <div>
          <div class="dash-user-name" id="dash-user-name">Kullanıcı</div>
          <div class="dash-user-role">Admin</div>
        </div>
      </div>
      <div style="position:relative">
        <button id="notif-bell" title="Bildirimler" style="background:var(--surface-overlay);border:1px solid var(--surface-stroke);border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);position:relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span id="notif-badge" style="display:none;position:absolute;top:-4px;right:-4px;background:#fa5c7c;color:#fff;border-radius:50%;font-size:0.6rem;font-weight:700;min-width:16px;height:16px;align-items:center;justify-content:center;padding:0 3px"></span>
        </button>
        <div id="notif-popup" style="display:none;position:absolute;bottom:calc(100% + 8px);right:0;width:300px;background:var(--surface-card);border:1px solid var(--surface-stroke);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:500;overflow:hidden">
          <div style="padding:0.75rem 1rem;border-bottom:1px solid var(--surface-stroke);font-size:0.8rem;font-weight:700;color:var(--text-secondary)">Bildirimler</div>
          <div id="notif-dropdown" style="max-height:300px;overflow-y:auto"></div>
        </div>
      </div>
      <button class="dash-logout" id="dash-logout" title="Çıkış Yap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
  </aside>`;
}

export const sidebarScript = `
<script>
(function () {
  var SB_URL = 'https://vewfghckacbdgacpnqef.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld2ZnaGNrYWNiZGdhY3BucWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDUwNTcsImV4cCI6MjA5ODQyMTA1N30.FqXZJibHciSDwi3w1RDSEZK3GJNyZ1u7vQXXdvsNc6w';

  // ── Session kontrolü ──
  var email = '';
  var displayName = '';
  try { email = localStorage.getItem('g4_user_email') || ''; } catch(e) {}

  if (!email) { window.location.replace('/login'); return; }

  // Token expire yakınsa refresh et
  (async function() {
    try {
      var t = localStorage.getItem('sb_access_token');
      if (!t) return;
      var exp = JSON.parse(atob(t.split('.')[1])).exp;
      if (exp && (Date.now() / 1000) > (exp - 300)) {
        var rt = localStorage.getItem('sb_refresh_token');
        if (!rt) return;
        var res = await fetch(SB_URL + '/auth/v1/token?grant_type=refresh_token', {
          method: 'POST',
          headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: rt })
        });
        if (res.ok) {
          var data = await res.json();
          if (data.access_token) localStorage.setItem('sb_access_token', data.access_token);
          if (data.refresh_token) localStorage.setItem('sb_refresh_token', data.refresh_token);
        } else {
          localStorage.removeItem('sb_access_token');
          localStorage.removeItem('sb_refresh_token');
          localStorage.removeItem('g4_user_email');
          window.location.replace('/login');
        }
      }
    } catch(e) {}
  })();

  displayName = email.split('@')[0];
  var initial = displayName.charAt(0).toUpperCase() || 'G';

  var n = document.getElementById('dash-user-name');
  var i = document.getElementById('dash-user-initial');
  if (n) n.textContent = displayName;
  if (i) i.textContent = initial;

  // Supabase'den kullanıcı adını çek (varsa)
  (async function() {
    try {
      var res = await fetch(SB_URL + '/auth/v1/user', {
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + (localStorage.getItem('sb_access_token') || '') }
      });
      if (res.ok) {
        var u = await res.json();
        var fullName = (u.user_metadata && u.user_metadata.full_name) ? u.user_metadata.full_name : '';
        if (fullName && n) { n.textContent = fullName.split(' ')[0]; }
        if (fullName && i) { i.textContent = fullName.charAt(0).toUpperCase(); }
      }
    } catch(e) {}
  })();

  var btn = document.getElementById('dash-logout');
  if (btn) btn.addEventListener('click', async function () {
    try {
      var token = localStorage.getItem('sb_access_token') || '';
      if (token) {
        await fetch(SB_URL + '/auth/v1/logout', {
          method: 'POST',
          headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + token }
        });
      }
    } catch(e) {}
    try { localStorage.removeItem('g4_user_email'); localStorage.removeItem('sb_access_token'); localStorage.removeItem('sb_refresh_token'); } catch(e) {}
    window.location.href = '/login';
  });

  // ── Bildirim Zili ──
  (function() {
    var bellBtn = document.getElementById('notif-bell');
    var popup = document.getElementById('notif-popup');
    var dropdown = document.getElementById('notif-dropdown');
    var badge = document.getElementById('notif-badge');
    if (!bellBtn) return;

    async function loadNotifications() {
      try {
        var token = localStorage.getItem('sb_access_token') || SB_KEY;
        var res = await fetch(SB_URL + '/rest/v1/notifications?read=eq.false&order=created_at.desc&limit=10', {
          headers: { apikey: SB_KEY, Authorization: 'Bearer ' + token }
        });
        var notifs = await res.json();
        if (!Array.isArray(notifs)) notifs = [];
        if (badge) {
          badge.textContent = notifs.length > 0 ? (notifs.length > 9 ? '9+' : notifs.length) : '';
          badge.style.display = notifs.length > 0 ? 'flex' : 'none';
        }
        if (dropdown) {
          dropdown.innerHTML = notifs.length === 0
            ? '<div style="padding:1.5rem;text-align:center;color:var(--text-tertiary);font-size:0.85rem">Yeni bildirim yok</div>'
            : notifs.map(function(n) {
                return '<div class="notif-item" data-id="'+n.id+'">' +
                  '<div class="notif-title">' + (n.title||'Bildirim') + '</div>' +
                  '<div class="notif-body">' + (n.body||'') + '</div>' +
                  '<div class="notif-time">' + new Date(n.created_at).toLocaleString('tr-TR',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'}) + '</div>' +
                '</div>';
              }).join('');

          dropdown.querySelectorAll('.notif-item').forEach(function(el) {
            el.addEventListener('click', async function() {
              var id = el.dataset.id;
              await fetch(SB_URL + '/rest/v1/notifications?id=eq.' + id, {
                method: 'PATCH',
                headers: { apikey: SB_KEY, Authorization: 'Bearer ' + (localStorage.getItem('sb_access_token')||SB_KEY), 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
              });
              loadNotifications();
            });
          });
        }
      } catch(e) {}
    }

    bellBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (popup) {
        var isOpen = popup.style.display === 'block';
        popup.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) loadNotifications();
      }
    });
    document.addEventListener('click', function() {
      if (popup) popup.style.display = 'none';
    });
    if (popup) popup.addEventListener('click', function(e) { e.stopPropagation(); });
    loadNotifications();
    setInterval(loadNotifications, 30000);
  })();

  // ── Hamburger ──
  var hamburger = document.getElementById('dash-hamburger');
  var sidebar2   = document.getElementById('dash-sidebar');
  var overlay   = document.getElementById('dash-sidebar-overlay');
  function openSidebar() {
    sidebar2 && sidebar2.classList.add('open');
    overlay && overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar2 && sidebar2.classList.remove('open');
    overlay && overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
})();
<\/script>`;
