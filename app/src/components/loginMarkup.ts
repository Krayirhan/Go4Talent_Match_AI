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

      <form class="auth-form" id="login-form" novalidate>

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
            <input type="checkbox" name="remember" />
            Beni hatırla
          </label>
          <a href="#" class="auth-link">Şifremi unuttum</a>
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

  // Zaten giriş yapmışsa dashboard'a yönlendir
  try {
    if (localStorage.getItem('sb_access_token') && localStorage.getItem('g4_user_email')) {
      window.location.replace('/dashboard'); return;
    }
  } catch(e) {}

  var form = document.getElementById('login-form');
  var btn  = document.getElementById('login-btn');
  var errBox = document.getElementById('auth-error');

  function showError(msg) { errBox.textContent = msg; errBox.style.display = 'block'; }
  function hideError() { errBox.style.display = 'none'; }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideError();
    btn.disabled = true;
    btn.textContent = 'Giriş yapılıyor…';

    var email    = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;

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
      try {
        localStorage.setItem('g4_user_email', email);
        if (data.access_token) localStorage.setItem('sb_access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('sb_refresh_token', data.refresh_token);
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
