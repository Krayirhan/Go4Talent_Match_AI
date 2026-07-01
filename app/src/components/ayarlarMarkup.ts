import { sidebar, sidebarScript } from './sidebarMarkup';
import { SB_URL, SB_KEY, sbHelpers } from '../lib/supabaseConfig';

const ayarlarMarkup = /* html */`
<div class="dash-shell">
  ${sidebar('ayarlar')}

  <main class="dash-main">
    <div class="dash-topbar">
      <div>
        <div class="dash-greeting-eyebrow">Hesap</div>
        <h1 class="dash-greeting-title">Ayarlar</h1>
        <p class="dash-greeting-sub">Hesap ve organizasyon ayarlarınızı yönetin.</p>
      </div>
    </div>

    <!-- tabs -->
    <div class="settings-tabs" id="settings-tabs">
      <button class="settings-tab active" data-tab="profil">Profil</button>
      <button class="settings-tab" data-tab="organizasyon">Organizasyon</button>
      <button class="settings-tab" data-tab="ekip">Ekip</button>
      <button class="settings-tab" data-tab="entegrasyon">Entegrasyonlar</button>
      <button class="settings-tab" data-tab="bildirim">Bildirimler</button>
      <button class="settings-tab" data-tab="kvkk">KVKK</button>
    </div>

    <!-- Profil -->
    <div class="settings-panel active" id="tab-profil">
      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">Kişisel Bilgiler</h2>
          <p class="settings-section-sub">Hesabınıza ait ad ve e-posta bilgilerini güncelleyin.</p>
        </div>
        <div id="profil-save-msg" style="display:none;margin-bottom:1rem;padding:0.65rem 1rem;border-radius:10px;font-size:0.85rem"></div>
        <div class="settings-card">
          <div class="avatar-row">
            <div class="settings-avatar" id="settings-avatar">G</div>
            <div>
              <div class="cand-name" style="margin-bottom:0.3rem">Profil Fotoğrafı</div>
              <div class="cand-email">JPG veya PNG, maks. 2 MB</div>
              <button class="outline-btn" style="margin-top:0.6rem" disabled>Yakında</button>
            </div>
          </div>
          <div class="form-grid">
            <div class="sett-field">
              <label class="sett-label">Ad Soyad</label>
              <input class="sett-input" type="text" id="settings-name" placeholder="Adınız Soyadınız" />
            </div>
            <div class="sett-field">
              <label class="sett-label">E-posta</label>
              <input class="sett-input" type="email" id="settings-email" placeholder="ornek@sirket.com" disabled style="opacity:0.6" />
            </div>
            <div class="sett-field">
              <label class="sett-label">Unvan</label>
              <input class="sett-input" type="text" id="settings-title" placeholder="İK Direktörü" />
            </div>
            <div class="sett-field">
              <label class="sett-label">Şirket</label>
              <input class="sett-input" type="text" id="settings-company" placeholder="Şirket adı" />
            </div>
          </div>
          <div class="sett-actions">
            <button class="dash-cta" style="height:40px;font-size:0.85rem" id="save-profile-btn">Kaydet</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">Şifre</h2>
          <p class="settings-section-sub">Hesabınızı güvende tutmak için güçlü bir şifre kullanın.</p>
        </div>
        <div id="pass-save-msg" style="display:none;margin-bottom:1rem;padding:0.65rem 1rem;border-radius:10px;font-size:0.85rem"></div>
        <div class="settings-card">
          <div class="form-grid">
            <div class="sett-field">
              <label class="sett-label">Yeni Şifre</label>
              <input class="sett-input" type="password" id="new-password" placeholder="En az 8 karakter" />
            </div>
            <div class="sett-field">
              <label class="sett-label">Şifre Tekrar</label>
              <input class="sett-input" type="password" id="confirm-password" placeholder="••••••••" />
            </div>
          </div>
          <div class="sett-actions">
            <button class="dash-cta" style="height:40px;font-size:0.85rem" id="save-password-btn">Şifreyi Güncelle</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Organizasyon -->
    <div class="settings-panel" id="tab-organizasyon">
      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">Şirket Bilgileri</h2>
          <p class="settings-section-sub">Organizasyonunuzun genel bilgilerini düzenleyin.</p>
        </div>
        <div id="org-save-msg" style="display:none;margin-bottom:1rem;padding:0.65rem 1rem;border-radius:10px;font-size:0.85rem"></div>
        <div class="settings-card">
          <div class="form-grid">
            <div class="sett-field">
              <label class="sett-label">Şirket Adı</label>
              <input class="sett-input" type="text" id="org-name" placeholder="Şirket adı" />
            </div>
            <div class="sett-field">
              <label class="sett-label">Sektör</label>
              <select class="sett-input" id="org-sector">
                <option>Teknoloji</option>
                <option>Finans</option>
                <option>Perakende</option>
                <option>Sağlık</option>
                <option>Diğer</option>
              </select>
            </div>
            <div class="sett-field">
              <label class="sett-label">Çalışan Sayısı</label>
              <select class="sett-input" id="org-size">
                <option>1–10</option>
                <option>11–50</option>
                <option>51–200</option>
                <option>201–1000</option>
                <option>1000+</option>
              </select>
            </div>
            <div class="sett-field">
              <label class="sett-label">Web Sitesi</label>
              <input class="sett-input" type="url" id="org-website" placeholder="https://sirket.com" />
            </div>
          </div>
          <div class="sett-actions">
            <button class="dash-cta" style="height:40px;font-size:0.85rem" id="save-org-btn">Kaydet</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">Plan</h2>
        </div>
        <div class="settings-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
            <div>
              <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.4rem">
                <span class="dash-greeting-title" style="font-size:1.1rem">Ücretsiz Plan</span>
                <span class="status-badge status-review">Ücretsiz</span>
              </div>
              <p class="cand-email">3 pozisyon, 50 aday, 1 kullanıcı</p>
            </div>
            <button class="dash-cta" style="height:40px;font-size:0.85rem">Pro'ya Yükselt</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ekip -->
    <div class="settings-panel" id="tab-ekip">
      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">Ekip Üyeleri</h2>
          <p class="settings-section-sub">Takım arkadaşlarınızı davet edin ve yetki seviyelerini belirleyin.</p>
        </div>
        <div class="settings-card">
          <div class="invite-row">
            <input class="sett-input" style="flex:1" type="email" id="invite-email" placeholder="eposta@sirket.com" />
            <select class="sett-input" style="width:140px">
              <option>Admin</option>
              <option>Editör</option>
              <option>Görüntüleyici</option>
            </select>
            <button class="dash-cta" style="height:42px;font-size:0.85rem;flex-shrink:0" disabled>Yakında</button>
          </div>
          <div class="member-list">
            <div class="member-row">
              <div class="candidate-cell">
                <div class="cand-avatar" style="background:var(--gradient-accent);color:#0c0a14" id="team-avatar">G</div>
                <div><div class="cand-name" id="team-name">Kullanıcı</div><div class="cand-email" id="team-email">—</div></div>
              </div>
              <span class="status-badge status-active">Admin</span>
              <span class="cand-email">Siz</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Entegrasyonlar -->
    <div class="settings-panel" id="tab-entegrasyon">
      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">Entegrasyonlar</h2>
          <p class="settings-section-sub">İK araçlarınızı Go4Talent MatchAI'ye bağlayın.</p>
        </div>
        <div class="integ-grid">
          <div class="integ-card">
            <div class="integ-icon" style="background:#fff;color:#0a0a0a;font-weight:800;font-size:0.85rem">G</div>
            <div><div class="cand-name">Google Workspace</div><div class="cand-email">Takvim & Meet entegrasyonu</div></div>
            <button class="outline-btn" style="margin-left:auto" disabled>Yakında</button>
          </div>
          <div class="integ-card">
            <div class="integ-icon" style="background:#611f69;color:#fff;font-weight:800;font-size:0.85rem">Sl</div>
            <div><div class="cand-name">Slack</div><div class="cand-email">Bildirim ve hatırlatma</div></div>
            <button class="outline-btn" style="margin-left:auto" disabled>Yakında</button>
          </div>
          <div class="integ-card">
            <div class="integ-icon" style="background:#0052cc;color:#fff;font-weight:800;font-size:0.85rem">Ji</div>
            <div><div class="cand-name">Jira</div><div class="cand-email">İşe alım görevlerini senkronize et</div></div>
            <button class="outline-btn" style="margin-left:auto" disabled>Yakında</button>
          </div>
          <div class="integ-card">
            <div class="integ-icon" style="background:#e01e5a;color:#fff;font-weight:800;font-size:0.7rem">API</div>
            <div><div class="cand-name">REST API</div><div class="cand-email">Kendi sisteminizle entegre edin</div></div>
            <button class="outline-btn" style="margin-left:auto" disabled>Yakında</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bildirimler -->
    <div class="settings-panel" id="tab-bildirim">
      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">Bildirim Tercihleri</h2>
          <p class="settings-section-sub">Hangi olaylar için bildirim almak istediğinizi seçin.</p>
        </div>
        <div class="settings-card">
          <div class="notif-list">
            <div class="notif-row">
              <div><div class="cand-name">Yeni Başvuru</div><div class="cand-email">Bir pozisyona yeni aday başvurduğunda</div></div>
              <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
            </div>
            <div class="notif-row">
              <div><div class="cand-name">Eşleşme Tamamlandı</div><div class="cand-email">Eşleştirme skoru hesaplandığında</div></div>
              <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
            </div>
            <div class="notif-row">
              <div><div class="cand-name">Mülakat Hatırlatıcı</div><div class="cand-email">Mülakatten 1 saat önce</div></div>
              <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
            </div>
            <div class="notif-row">
              <div><div class="cand-name">Haftalık Rapor</div><div class="cand-email">Her Pazartesi özet e-posta</div></div>
              <label class="toggle"><input type="checkbox" /><span class="toggle-slider"></span></label>
            </div>
            <div class="notif-row">
              <div><div class="cand-name">Teklif Durumu</div><div class="cand-email">Aday teklifi kabul/reddettiğinde</div></div>
              <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
            </div>
          </div>
          <div class="sett-actions">
            <button class="dash-cta" style="height:40px;font-size:0.85rem" disabled>Yakında</button>
          </div>
        </div>
      </div>
    </div>

    <!-- KVKK -->
    <div class="settings-panel" id="tab-kvkk">
      <div class="settings-section">
        <div class="settings-section-head">
          <h2 class="settings-section-title">KVKK Uyumluluk</h2>
          <p class="settings-section-desc">Kişisel Verilerin Korunması Kanunu kapsamındaki haklarınızı yönetin.</p>
        </div>
        <div class="settings-card" style="margin-bottom:1.25rem">
          <div style="margin-bottom:1rem">
            <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:0.3rem">Verilerinizi İndirin</h3>
            <p style="font-size:0.85rem;color:var(--text-tertiary)">Hesabınıza ait tüm verilerin bir kopyasını JSON formatında alın.</p>
          </div>
          <button class="outline-btn" id="kvkk-export-btn" onclick="exportData()">Verilerimi İndir</button>
          <div id="kvkk-export-msg" style="display:none;margin-top:0.75rem;font-size:0.82rem;color:var(--color-accent-500)"></div>
        </div>

        <div class="settings-card" style="margin-bottom:1.25rem">
          <div style="margin-bottom:1rem">
            <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:0.3rem">Veri Silme Talebi</h3>
            <p style="font-size:0.85rem;color:var(--text-tertiary)">Hesabınızın ve tüm verilerinizin silinmesini talep edin. Bu işlem geri alınamaz.</p>
          </div>
          <div id="kvkk-delete-form" style="display:flex;flex-direction:column;gap:0.75rem;max-width:420px">
            <div>
              <label class="form-label">Talep Nedeni</label>
              <select id="kvkk-reason" class="form-input">
                <option value="">— Seçin —</option>
                <option value="veri_silme">Tüm kişisel verilerimin silinmesi</option>
                <option value="hesap_kapatma">Hesabı kapatmak istiyorum</option>
                <option value="veri_itiraz">Verilerimin işlenmesine itiraz ediyorum</option>
                <option value="diger">Diğer</option>
              </select>
            </div>
            <div>
              <label class="form-label">Açıklama (isteğe bağlı)</label>
              <textarea id="kvkk-note" class="form-input" rows="2" style="resize:vertical" placeholder="Talebinizle ilgili ek bilgi…"></textarea>
            </div>
            <div id="kvkk-delete-msg" style="display:none;font-size:0.82rem"></div>
            <div>
              <button class="dash-cta" style="background:rgba(250,92,124,0.15);border-color:rgba(250,92,124,0.3);color:#fa5c7c" onclick="submitDeletionRequest()">Silme Talebini Gönder</button>
            </div>
          </div>
        </div>

        <div class="settings-card">
          <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:0.75rem">KVKK Hakları</h3>
          <ul style="display:flex;flex-direction:column;gap:0.5rem;padding-left:1rem">
            <li style="font-size:0.85rem;color:var(--text-secondary)">Verilerinizin işlenip işlenmediğini öğrenme hakkı</li>
            <li style="font-size:0.85rem;color:var(--text-secondary)">Verilerinize erişim talep etme hakkı</li>
            <li style="font-size:0.85rem;color:var(--text-secondary)">Eksik veya yanlış verilerin düzeltilmesini isteme hakkı</li>
            <li style="font-size:0.85rem;color:var(--text-secondary)">Verilerinizin silinmesini veya yok edilmesini isteme hakkı</li>
            <li style="font-size:0.85rem;color:var(--text-secondary)">Verilerinizin otomatik sistemlerle işlenmesi sonucu aleyhinize bir sonuca itiraz hakkı</li>
          </ul>
          <div style="margin-top:1rem;padding:0.75rem 1rem;background:rgba(124,92,250,0.08);border-radius:8px;font-size:0.8rem;color:var(--text-secondary)">
            KVKK kapsamındaki talepleriniz için: <strong>kvkk@go4talent.ai</strong> — Talepler 30 gün içinde yanıtlanır.
          </div>
        </div>

        <!-- Kendi taleplerim -->
        <div class="settings-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
            <h3 style="font-size:0.95rem;font-weight:700">Taleplerim</h3>
            <button class="outline-btn" style="font-size:0.78rem;padding:0.3rem 0.75rem" onclick="loadMyRequests()">Yenile</button>
          </div>
          <div id="kvkk-requests-loading" style="font-size:0.85rem;color:var(--text-tertiary)">Yükleniyor…</div>
          <div id="kvkk-requests-empty" style="display:none;font-size:0.85rem;color:var(--text-tertiary)">Henüz talep göndermediniz.</div>
          <div id="kvkk-requests-list" style="display:flex;flex-direction:column;gap:0.5rem"></div>
        </div>
      </div>
    </div>

  </main>
</div>

<script>
(function () {
  ${sbHelpers}

  // ── Tabs ──
  var tabs = document.querySelectorAll('.settings-tab');
  var panels = document.querySelectorAll('.settings-panel');
  function activateTab(tabId) {
    tabs.forEach(function(t){ t.classList.remove('active'); });
    panels.forEach(function(p){ p.classList.remove('active'); });
    var tab = document.querySelector('[data-tab="' + tabId + '"]');
    var panel = document.getElementById('tab-' + tabId);
    if (tab) tab.classList.add('active');
    if (panel) panel.classList.add('active');
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab.dataset.tab);
      try { history.replaceState(null, '', '#' + tab.dataset.tab); } catch(e) {}
    });
  });
  // URL hash'ten aktif tab'ı başlat
  (function() {
    var hash = location.hash.slice(1);
    if (hash && document.getElementById('tab-' + hash)) activateTab(hash);
  })();

  function showMsg(elId, msg, ok) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.style.background = ok ? 'rgba(194,245,66,0.1)' : 'rgba(250,92,92,0.1)';
    el.style.border = ok ? '1px solid rgba(194,245,66,0.3)' : '1px solid rgba(250,92,92,0.3)';
    el.style.color = ok ? '#c2f542' : '#fa5c5c';
    el.style.display = 'block';
    setTimeout(function(){ el.style.display = 'none'; }, 3000);
  }

  // ── Kullanıcı bilgilerini yükle ──
  var token = getToken();
  (async function() {
    if (!token || token === SB_KEY) return;
    try {
      var res = await fetch(SB_URL + '/auth/v1/user', { headers: sbHeaders() });
      if (!res.ok) return;
      var u = await res.json();
      var meta = u.user_metadata || {};
      var email = u.email || '';

      document.getElementById('settings-email').value  = email;
      document.getElementById('settings-name').value   = meta.full_name || '';
      document.getElementById('settings-title').value  = meta.title || '';
      document.getElementById('settings-company').value = meta.company || '';
      document.getElementById('org-name').value        = meta.company || '';

      // sidebar ekip bilgisi
      var teamName = document.getElementById('team-name');
      var teamEmail = document.getElementById('team-email');
      var teamAvatar = document.getElementById('team-avatar');
      if (teamName) teamName.textContent = meta.full_name || email.split('@')[0];
      if (teamEmail) teamEmail.textContent = email;
      if (teamAvatar) teamAvatar.textContent = (meta.full_name || email).charAt(0).toUpperCase();

      var avatarEl = document.getElementById('settings-avatar');
      if (avatarEl) avatarEl.textContent = (meta.full_name || email).charAt(0).toUpperCase();
    } catch(e) {}
  })();

  // ── Profil Kaydet ──
  document.getElementById('save-profile-btn').addEventListener('click', async function() {
    this.disabled = true;
    this.textContent = 'Kaydediliyor…';
    try {
      var res = await fetch(SB_URL + '/auth/v1/user', {
        method: 'PUT',
        headers: sbHeaders(),
        body: JSON.stringify({
          data: {
            full_name: document.getElementById('settings-name').value.trim(),
            title:     document.getElementById('settings-title').value.trim(),
            company:   document.getElementById('settings-company').value.trim(),
          }
        })
      });
      showMsg('profil-save-msg', res.ok ? 'Profil başarıyla kaydedildi.' : 'Kayıt sırasında hata oluştu.', res.ok);
    } catch(e) {
      showMsg('profil-save-msg', 'Bağlantı hatası.', false);
    }
    this.disabled = false;
    this.textContent = 'Kaydet';
  });

  // ── Şifre Güncelle ──
  document.getElementById('save-password-btn').addEventListener('click', async function() {
    var newPass  = document.getElementById('new-password').value;
    var confPass = document.getElementById('confirm-password').value;
    if (newPass.length < 8) { showMsg('pass-save-msg', 'Şifre en az 8 karakter olmalıdır.', false); return; }
    if (newPass !== confPass) { showMsg('pass-save-msg', 'Şifreler eşleşmiyor.', false); return; }

    this.disabled = true;
    this.textContent = 'Güncelleniyor…';
    try {
      var res = await fetch(SB_URL + '/auth/v1/user', {
        method: 'PUT',
        headers: sbHeaders(),
        body: JSON.stringify({ password: newPass })
      });
      showMsg('pass-save-msg', res.ok ? 'Şifre başarıyla güncellendi.' : 'Güncelleme başarısız.', res.ok);
      if (res.ok) { document.getElementById('new-password').value = ''; document.getElementById('confirm-password').value = ''; }
    } catch(e) {
      showMsg('pass-save-msg', 'Bağlantı hatası.', false);
    }
    this.disabled = false;
    this.textContent = 'Şifreyi Güncelle';
  });

  // ── Organizasyon Kaydet (user_metadata'ya) ──
  document.getElementById('save-org-btn').addEventListener('click', async function() {
    this.disabled = true;
    this.textContent = 'Kaydediliyor…';
    try {
      var res = await fetch(SB_URL + '/auth/v1/user', {
        method: 'PUT',
        headers: sbHeaders(),
        body: JSON.stringify({
          data: {
            company:    document.getElementById('org-name').value.trim(),
            org_sector: document.getElementById('org-sector').value,
            org_size:   document.getElementById('org-size').value,
            org_website: document.getElementById('org-website').value.trim(),
          }
        })
      });
      // Profil şirket alanını da güncelle
      var companyInput = document.getElementById('settings-company');
      if (companyInput) companyInput.value = document.getElementById('org-name').value.trim();
      showMsg('org-save-msg', res.ok ? 'Organizasyon bilgileri kaydedildi.' : 'Kayıt başarısız.', res.ok);
    } catch(e) {}
    this.disabled = false;
    this.textContent = 'Kaydet';
  });
})();

// ── KVKK ──
window.exportData = async function() {
  var btn = document.getElementById('kvkk-export-btn');
  var msg = document.getElementById('kvkk-export-msg');
  btn.disabled = true;
  btn.textContent = 'Hazırlanıyor…';
  try {
    var uid = getUserId();
    var [posRes, candRes] = await Promise.all([
      fetch(SB_URL + '/rest/v1/positions?user_id=eq.' + uid + '&select=*', { headers: sbHeaders() }).then(function(r){ return r.json(); }),
      fetch(SB_URL + '/rest/v1/candidates?user_id=eq.' + uid + '&select=*', { headers: sbHeaders() }).then(function(r){ return r.json(); }),
    ]);
    var data = { exported_at: new Date().toISOString(), positions: posRes, candidates: candRes };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'go4talent-verilerim.json'; a.click();
    URL.revokeObjectURL(url);
    msg.textContent = 'Verileriniz indirildi.';
    msg.style.display = 'block';
  } catch(e) {}
  btn.disabled = false;
  btn.textContent = 'Verilerimi İndir';
};

window.loadMyRequests = async function() {
  var loadEl  = document.getElementById('kvkk-requests-loading');
  var emptyEl = document.getElementById('kvkk-requests-empty');
  var listEl  = document.getElementById('kvkk-requests-list');
  if (loadEl) loadEl.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';
  if (listEl) listEl.innerHTML = '';
  try {
    var res = await fetch(SB_URL + '/rest/v1/data_deletion_requests?user_id=eq.' + getUserId() + '&order=created_at.desc', { headers: sbHeaders() });
    var reqs = await res.json();
    if (loadEl) loadEl.style.display = 'none';
    if (!reqs.length) { if (emptyEl) emptyEl.style.display = 'block'; return; }
    var statusLabel = { pending:'Beklemede', processing:'İşlemde', completed:'Tamamlandı', rejected:'Reddedildi' };
    var statusColor = { pending:'#fac85c', processing:'#5cb8fa', completed:'#c2f542', rejected:'#fa5c7c' };
    if (listEl) listEl.innerHTML = reqs.map(function(r) {
      var st = r.status || 'pending';
      var date = new Date(r.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
      return '<div style="padding:0.75rem;background:var(--surface-overlay);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">' +
        '<div>' +
          '<div style="font-size:0.85rem;font-weight:600;margin-bottom:0.2rem">' + (r.reason || '—') + '</div>' +
          '<div style="font-size:0.75rem;color:var(--text-tertiary)">' + date + (r.note ? ' · ' + r.note : '') + '</div>' +
        '</div>' +
        '<span style="font-size:0.75rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:6px;background:rgba(255,255,255,0.06);color:' + (statusColor[st]||'#7a6f90') + '">' + (statusLabel[st]||st) + '</span>' +
      '</div>';
    }).join('');
  } catch(e) { if (loadEl) loadEl.style.display = 'none'; }
};
(function(){ window.loadMyRequests && window.loadMyRequests(); })();

window.submitDeletionRequest = async function() {
  var reason = document.getElementById('kvkk-reason').value;
  var note = document.getElementById('kvkk-note').value.trim();
  var msgEl = document.getElementById('kvkk-delete-msg');
  msgEl.style.display = 'none';
  if (!reason) { msgEl.textContent = 'Lütfen bir neden seçin.'; msgEl.style.color = '#fa5c7c'; msgEl.style.display = 'block'; return; }
  var res = await fetch(SB_URL + '/rest/v1/data_deletion_requests', {
    method: 'POST',
    headers: Object.assign({}, sbHeaders(), { 'Prefer': 'return=minimal' }),
    body: JSON.stringify({ user_id: getUserId(), reason: reason, note: note, status: 'pending' })
  });
  if (res.ok || res.status === 201) {
    msgEl.textContent = 'Talebiniz alındı. 30 gün içinde işleme alınacaktır.';
    msgEl.style.color = 'var(--color-accent-500)';
    document.getElementById('kvkk-reason').value = '';
    document.getElementById('kvkk-note').value = '';
    setTimeout(function(){ window.loadMyRequests(); }, 500);
  } else {
    msgEl.textContent = 'Bir hata oluştu, lütfen tekrar deneyin.';
    msgEl.style.color = '#fa5c7c';
  }
  msgEl.style.display = 'block';
};
</script>
${sidebarScript}
`;

export default ayarlarMarkup;
