export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vewfghckacbdgacpnqef.supabase.co';
export const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld2ZnaGNrYWNiZGdhY3BucWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDUwNTcsImV4cCI6MjA5ODQyMTA1N30.FqXZJibHciSDwi3w1RDSEZK3GJNyZ1u7vQXXdvsNc6w';
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
export const ML_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:5002';

// Inline script'lerde kullanılacak ortak yardımcı kod (string olarak embed edilir)
export const sbHelpers = `
  var SB_URL = '${SB_URL}';
  var SB_KEY = '${SB_KEY}';
  function getToken() { try { return localStorage.getItem('sb_access_token') || SB_KEY; } catch(e) { return SB_KEY; } }
  function isTokenExpired() {
    try {
      var t = localStorage.getItem('sb_access_token');
      if (!t) return true;
      var exp = JSON.parse(atob(t.split('.')[1])).exp;
      return exp && (Date.now() / 1000) > (exp - 60);
    } catch(e) { return false; }
  }
  async function refreshTokenIfNeeded() {
    if (!isTokenExpired()) return;
    try {
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
    } catch(e) {}
  }
  function getUserId() {
    try {
      var t = localStorage.getItem('sb_access_token');
      if (!t) return null;
      var payload = JSON.parse(atob(t.split('.')[1]));
      return payload.sub || null;
    } catch(e) { return null; }
  }
  function sbHeaders(extra) {
    var token = getToken();
    return Object.assign({ 'apikey': SB_KEY, 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, extra || {});
  }
  function showToast(msg, ok) {
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:0.75rem 1.25rem;border-radius:12px;font-size:0.85rem;font-weight:600;box-shadow:0 4px 24px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;word-break:break-word;' + (ok !== false ? 'background:rgba(20,18,36,0.97);border:1px solid rgba(194,245,66,0.4);color:#c2f542;' : 'background:rgba(20,18,36,0.97);border:1px solid rgba(250,92,92,0.4);color:#fa5c5c;');
    document.body.appendChild(el);
    setTimeout(function(){ el.style.opacity='0'; setTimeout(function(){ el.remove(); },300); },3000);
  }
`;
