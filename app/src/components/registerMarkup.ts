import { SB_URL, SB_KEY } from '../lib/supabaseConfig';

const registerMarkup = /* html */`
<div class="auth-root">
  <div class="auth-wrapper">

    <a href="/" class="auth-logo">
      <div class="auth-logo-mark">G4</div>
      <span class="auth-logo-name">Go4Talent MatchAI</span>
    </a>

    <div class="auth-card">
      <span class="auth-eyebrow">Hemen Başlayın</span>
      <h1 class="auth-title">Ücretsiz hesap oluşturun</h1>
      <p class="auth-subtitle">Kredi kartı gerekmez. Dakikalar içinde ilk adayınızı eşleştirin.</p>

      <div id="auth-error" style="display:none;background:rgba(250,92,92,0.1);border:1px solid rgba(250,92,92,0.3);border-radius:10px;padding:0.75rem 1rem;font-size:0.85rem;color:#fa5c5c;margin-bottom:1rem"></div>
      <div id="auth-success" style="display:none;background:rgba(194,245,66,0.1);border:1px solid rgba(194,245,66,0.3);border-radius:10px;padding:0.75rem 1rem;font-size:0.85rem;color:#c2f542;margin-bottom:1rem"></div>

      <form class="auth-form" id="register-form" novalidate>

        <div class="form-field">
          <label class="form-label" for="name">Ad Soyad</label>
          <input class="form-input" id="name" name="name" type="text"
            placeholder="Adınız Soyadınız" autocomplete="name" required />
        </div>

        <div class="form-field">
          <label class="form-label" for="company">Şirket</label>
          <input class="form-input" id="company" name="company" type="text"
            placeholder="Şirket adı" autocomplete="organization" />
        </div>

        <div class="form-field">
          <label class="form-label" for="email">E-posta</label>
          <input class="form-input" id="email" name="email" type="email"
            placeholder="ornek@sirket.com" autocomplete="email" required />
        </div>

        <div class="form-field">
          <label class="form-label" for="password">Şifre</label>
          <input class="form-input" id="password" name="password" type="password"
            placeholder="En az 8 karakter" autocomplete="new-password" minlength="8" required />
        </div>

        <label class="auth-kvkk">
          <input type="checkbox" name="kvkk" id="kvkk" required />
          <span>
            <a href="#" class="auth-link">Kullanım Şartları</a> ve
            <a href="#" class="auth-link">KVKK Aydınlatma Metni</a>'ni
            okudum, kabul ediyorum.
          </span>
        </label>

        <button type="submit" class="auth-btn" id="register-btn">Ücretsiz Hesap Oluştur</button>

      </form>
    </div>

    <p class="auth-footer">
      Zaten hesabınız var mı?
      <a href="/login" class="auth-link" style="font-weight:600">Giriş yapın</a>
    </p>

  </div>
</div>

<script>
(function () {
  var SB_URL = '${SB_URL}';
  var SB_KEY = '${SB_KEY}';

  var form    = document.getElementById('register-form');
  var btn     = document.getElementById('register-btn');
  var errBox  = document.getElementById('auth-error');
  var succBox = document.getElementById('auth-success');

  function showError(msg)   { errBox.textContent  = msg; errBox.style.display  = 'block'; succBox.style.display = 'none'; }
  function showSuccess(msg) { succBox.textContent = msg; succBox.style.display = 'block'; errBox.style.display  = 'none'; }
  function hideAll()        { errBox.style.display = 'none'; succBox.style.display = 'none'; }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideAll();

    var name     = document.getElementById('name').value.trim();
    var email    = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var kvkk     = document.getElementById('kvkk').checked;

    if (!kvkk) { showError('Devam etmek için kullanım şartlarını kabul etmelisiniz.'); return; }
    if (password.length < 8) { showError('Şifre en az 8 karakter olmalıdır.'); return; }

    btn.disabled = true;
    btn.textContent = 'Hesap oluşturuluyor…';

    try {
      var res = await fetch(SB_URL + '/auth/v1/signup', {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          data: { full_name: name, company: document.getElementById('company').value.trim() }
        })
      });
      var data = await res.json();

      if (!res.ok) {
        showError(data.msg || data.error_description || 'Kayıt başarısız. Lütfen tekrar deneyin.');
        btn.disabled = false;
        btn.textContent = 'Ücretsiz Hesap Oluştur';
        return;
      }

      // E-posta doğrulama gönderildi mi?
      if (data.user && !data.session) {
        showSuccess('Hesabınız oluşturuldu! E-posta adresinize doğrulama bağlantısı gönderildi.');
        btn.textContent = 'E-posta gönderildi ✓';
        return;
      }

      // Doğrulama kapalıysa direkt giriş
      try {
        localStorage.setItem('g4_user_email', email);
        if (data.access_token) localStorage.setItem('sb_access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('sb_refresh_token', data.refresh_token);
      } catch(e) {}
      window.location.href = '/dashboard';

    } catch(err) {
      showError('Bağlantı hatası. Lütfen tekrar deneyin.');
      btn.disabled = false;
      btn.textContent = 'Ücretsiz Hesap Oluştur';
    }
  });
})();
</script>
`;

export default registerMarkup;
