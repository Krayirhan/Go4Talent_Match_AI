import { SB_URL, SB_KEY } from '../lib/supabaseConfig';

const loginMarkup = /* html */`
<div class="auth-root">
  <div class="auth-wrapper">

    <a href="/" class="auth-logo">
      <div class="auth-logo-mark">G4</div>
      <span class="auth-logo-name">Go4Talent MatchAI</span>
    </a>

    <div class="auth-card">
      <span class="auth-eyebrow">Tekrar Hoş Geldiniz</span>
      <h1 class="auth-title">Hesabınıza giriş yapın</h1>
      <p class="auth-subtitle">İşe alım kararlarınızı yönetmeye kaldığınız yerden devam edin.</p>

      <div id="auth-error" style="display:none;background:rgba(250,92,92,0.1);border:1px solid rgba(250,92,92,0.3);border-radius:10px;padding:0.75rem 1rem;font-size:0.85rem;color:#fa5c5c;margin-bottom:1rem"></div>
      <div id="auth-info" style="display:none;background:rgba(124,92,250,0.1);border:1px solid rgba(124,92,250,0.3);border-radius:10px;padding:0.75rem 1rem;font-size:0.85rem;color:#7c5cfa;margin-bottom:1rem"></div>

      <form class="auth-form" id="login-form" novalidate autocomplete="on">

        <div class="form-field">
          <label class="form-label" for="email">E-posta</label>
          <input class="form-input" id="email" name="email" type="email"
            placeholder="ornek@sirket.com" autocomplete="email" required />
        </div>

        <div class="form-field">
          <label class="form-label" for="password">Şifre</label>
          <input class="form-input" id="password" name="password" type="password"
            placeholder="••••••••" autocomplete="current-password" required />
        </div>

        <div class="auth-row">
          <label class="auth-check-label">
            <input type="checkbox" name="remember" id="remember-me" />
            Beni hatırla
          </label>
          <button type="button" class="auth-link" id="forgot-password-btn" style="background:none;border:0;padding:0;cursor:pointer;font-size:0.85rem">Şifremi unuttum</button>
        </div>

        <button type="submit" class="auth-btn" id="login-btn">Giriş Yap</button>

      </form>
    </div>

    <p class="auth-footer">
      Hesabınız yok mu?
      <a href="/register" class="auth-link" style="font-weight:600">Kayıt olun</a>
    </p>

  </div>
</div>

<script>
(function () {
  var SB_URL = '${SB_URL}';
  var SB_KEY = '${SB_KEY}';

  // ── Token geçerlilik kontrolü ──
  // Sadece token VAR diye değil, süresi dolmamış olması gerekiyor
  function isTokenValid() {
    try {
      var token = localStorage.getItem('sb_access_token') || sessionStorage.getItem('sb_access_token');
      var email = localStorage.getItem('g4_user_email')   || sessionStorage.getItem('g4_user_email');
      if (!token || !email) return false;
      var payload = JSON.parse(atob(token.split('.')[1]));
      var exp = payload.exp;
      // Token süresi 60 saniyeden fazla kaldıysa geçerli say
      return exp && (Date.now() / 1000) < (exp - 60);
    } catch(e) { return false; }
  }

  // Token geçerliyse dashboard'a yönlendir
  if (isTokenValid()) {
    window.location.replace('/dashboard');
    return;
  }

  // Geçersiz/süresi dolmuş token varsa temizle (yeni giriş yapılabilsin)
  try {
    localStorage.removeItem('sb_access_token');
    localStorage.removeItem('sb_refresh_token');
    localStorage.removeItem('g4_user_email');
    sessionStorage.removeItem('sb_access_token');
    sessionStorage.removeItem('sb_refresh_token');
    sessionStorage.removeItem('g4_user_email');
  } catch(e) {}

  var form    = document.getElementById('login-form');
  var btn     = document.getElementById('login-btn');
  var errBox  = document.getElementById('auth-error');
  var infoBox = document.getElementById('auth-info');
  var forgotBtn = document.getElementById('forgot-password-btn');

  function showError(msg) { errBox.textContent = msg; errBox.style.display = 'block'; infoBox.style.display = 'none'; }
  function showInfo(msg)  { infoBox.textContent = msg; infoBox.style.display = 'block'; errBox.style.display = 'none'; }
  function hideMessages() { errBox.style.display = 'none'; infoBox.style.display = 'none'; }

  // ── Şifremi unuttum ──
  if (forgotBtn) forgotBtn.addEventListener('click', async function() {
    var email = document.getElementById('email').value.trim();
    if (!email) { showError('Lütfen önce e-posta adresinizi girin.'); return; }

    hideMessages();
    forgotBtn.disabled = true;
    forgotBtn.textContent = 'Gönderiliyor…';
    try {
      var res = await fetch(SB_URL + '/auth/v1/recover', {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, redirect_to: window.location.origin + '/login' })
      });
      if (res.ok) {
        showInfo('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
      } else {
        var data = await res.json().catch(function(){ return {}; });
        showError(data.error_description || data.msg || 'Şifre sıfırlama isteği gönderilemedi.');
      }
    } catch (e) {
      showError('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
    forgotBtn.disabled = false;
    forgotBtn.textContent = 'Şifremi unuttum';
  });

  // ── Giriş formu ──
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideMessages();
    btn.disabled = true;
    btn.textContent = 'Giriş yapılıyor…';

    var email    = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var remember = document.getElementById('remember-me').checked;

    if (!email || !password) {
      showError('E-posta ve şifre alanları boş bırakılamaz.');
      btn.disabled = false;
      btn.textContent = 'Giriş Yap';
      return;
    }

    try {
      var res = await fetch(SB_URL + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });
      var data = await res.json();
      if (!res.ok) {
        showError(data.error_description || data.msg || 'Giriş başarısız. E-posta veya şifre hatalı.');
        btn.disabled = false;
        btn.textContent = 'Giriş Yap';
        return;
      }

      // "Beni hatırla" seçilmediyse sessionStorage kullan (sekme/tarayıcı kapanınca silinir)
      // "Beni hatırla" seçildiyse localStorage kullan (kalıcı)
      var storage = remember ? localStorage : sessionStorage;
      try {
        storage.setItem('g4_user_email', email);
        if (data.access_token)  storage.setItem('sb_access_token',  data.access_token);
        if (data.refresh_token) storage.setItem('sb_refresh_token', data.refresh_token);
      } catch(e) {}

      window.location.href = '/dashboard';
    } catch(err) {
      showError('Bağlantı hatası. Lütfen tekrar deneyin.');
      btn.disabled = false;
      btn.textContent = 'Giriş Yap';
    }
  });
})();
</script>
`;

export default loginMarkup;
