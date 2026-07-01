# Go4Talent MatchAI

> **Akıllı işe alım platformu** — CV'den mülakata, tekliften rapora kadar tüm süreci tek yerden yönetin.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase) ![Fastify](https://img.shields.io/badge/Fastify-Node.js-000000?logo=fastify) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## Nedir Bu Proje?

Go4Talent MatchAI, küçük ve orta ölçekli şirketlerin **işe alım sürecini baştan sona dijitalleştiren** bir SaaS platformudur. Pahalı İK yazılımlarına uygun fiyatlı, hızlı kurulumlu alternatif olarak geliştirilmiştir.

**Temel fark:** Kural tabanlı skill-eşleştirme algoritması sayesinde her CV'ye otomatik bir **uyum skoru** (0–100) verir. İK uzmanı hangi adayın önce inceleneceğini tek bakışta görür.

---

## Özellikler

### Aday Yönetimi
- CV yükleme (PDF/DOCX → Supabase Storage)
- Otomatik skill eşleştirme skoru (%70 zorunlu + %30 tercih edilen skill ağırlığı)
- Canlı skor önizleme (form doldurulurken anlık hesaplama)
- Durum takibi: İnceleniyor → Mülakat → Teklif → Reddedildi
- Not ekleme, skill analizi görüntüleme
- Arama, filtre (pozisyon + durum), 20'li sayfalama

### Pozisyon Yönetimi
- Pozisyon oluşturma, düzenleme, silme (onay modalıyla)
- Zorunlu / tercih edilen skill tanımlama
- Pasif/aktif duruma alma
- Pozisyon bazlı aday listesi ve istatistikler

### Ön Görüşme Modülü
- Pozisyona özel soru oluşturma (açık uçlu, evet/hayır, 1–5 skala, kısa metin)
- Aday için paylaşılabilir form linki otomatik üretimi
- Giriş gerektirmeyen public form (adaylar hesap açmadan doldurur)
- Tamamlanan yanıtları HR panelinde accordion ile görüntüleme

### Raporlar & Analitik
- İşe alım hunisi (gerçek statü geçiş sayıları — anlık snapshot değil, trigger bazlı)
- Skor dağılım grafiği
- Pozisyon bazlı performans tablosu
- Tarih filtresi (son 30 / 90 / 365 gün veya tüm zamanlar)
- CSV export (UTF-8 BOM, tüm aday verisi)

### Bildirim Sistemi
- Yeni aday başvurusunda anlık bildirim
- Statü değişikliğinde bildirim
- Mülakat formu tamamlandığında bildirim
- Okundu/okunmadı takibi, 30 saniyelik polling
- Sidebar bildirim zili + dropdown

### KVKK Uyumluluğu
- Kullanıcı verilerini JSON olarak indirme
- Veri silme talebi gönderme ve durum takibi
- KVKK hakları bilgi paneli

---

## Teknik Mimari

```
┌─────────────────────────────────────────────────┐
│                   Kullanıcı                      │
└──────────┬──────────────────────┬───────────────┘
           │                      │
           ▼                      ▼
┌─────────────────┐    ┌───────────────────────┐
│  Frontend        │    │  Aday Form (Public)   │
│  Next.js 16      │    │  /mulakat/[id]        │
│  Port 5000       │    │  Giriş gerektirmez    │
│  TypeScript      │    └──────────┬────────────┘
│  Tailwind CSS    │               │
└──────┬──────────┘               │
       │                          │
       ▼                          ▼
┌─────────────────────────────────────────────────┐
│              Supabase (BaaS)                     │
│  PostgreSQL · REST API · Auth · Storage · RLS    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│           Backend API (Fastify)                  │
│  Port 5001 · Node.js                            │
│  /api/match-score · /api/interview/:id/submit    │
└─────────────────────────────────────────────────┘
```

### Frontend — Next.js 16 (App Router)

- **Pattern:** Tüm sayfalar `dangerouslySetInnerHTML` ile HTML string template'leri render eder. Markup TypeScript dosyalarında (`*Markup.ts`) tanımlanır.
- **Auth:** Supabase Auth REST API, JWT `sb_access_token` + `sb_refresh_token` localStorage'da saklanır. Token süresi dolmadan 5 dakika önce otomatik yenileme (refresh_token flow) yapılır.
- **Veri:** Supabase REST API'ye doğrudan `fetch()` ile erişilir (supabase-js kullanılmaz).
- **Güvenlik:** Her istek `sbHeaders()` helper'ı ile `apikey` + `Authorization: Bearer <token>` header'ı gönderir. 401 yanıtında localStorage temizlenir ve `/login`'e yönlendirilir.

### Backend — Fastify (Node.js)

| Endpoint | Açıklama |
|----------|----------|
| `GET /health` | Sağlık kontrolü |
| `GET /api/positions` | Pozisyon listesi (RLS) |
| `GET /api/candidates` | Aday listesi (RLS) |
| `POST /api/match-score` | Skill eşleştirme skoru hesaplama |
| `GET /api/interview/:candidateId` | Mülakat formu verisi |
| `POST /api/interview/:candidateId/submit` | Form gönderimi |
| `GET /api/notifications` | Bildirim listesi |
| `PATCH /api/notifications/:id/read` | Okundu işaretle |

### Veritabanı — Supabase PostgreSQL

| Tablo / View | Açıklama |
|---|---|
| `candidates` | Adaylar: id, name, email, skills[], score, status, cv_url, user_id |
| `positions` | Pozisyonlar: id, title, dept, type, level, required_skills[], preferred_skills[], status |
| `interview_questions` | Mülakat soruları: question, type (open/yesno/scale/short), required, order_index |
| `interview_responses` | Form yanıtları: answers JSONB, candidate_id, position_id, completed_at |
| `notifications` | Bildirimler: title, body, type, read, link, user_id |
| `candidate_status_history` | Statü geçmiş logu (trigger tabanlı) |
| `data_deletion_requests` | KVKK silme talepleri |
| `candidates_public` (VIEW) | Sadece id, name, position_id — PII kamuya açık değil |

**Row Level Security:** Her tablo `auth.uid() = user_id` politikasıyla korunur.

**DB Trigger'ları:**
- `trg_notify_new_candidate` — yeni aday eklenince bildirim oluşturur
- `trg_notify_candidate_status` — statü değişince bildirim oluşturur
- `trg_notify_interview_done` — mülakat formu tamamlanınca bildirim oluşturur
- `trg_log_candidate_status` — her statü değişikliğini `candidate_status_history`'e kaydeder

### Skor Algoritması

```
Skor = (Zorunlu Skill Eşleşme Oranı × 70) + (Tercih Edilen Skill Eşleşme Oranı × 30)

Örnek:
  Pozisyon Zorunlu: [React, TypeScript, Node.js]   → 3 skill
  Pozisyon Tercih:  [GraphQL, Docker]               → 2 skill
  Aday Skills:      [React, TypeScript, GraphQL]

  Zorunlu Eşleşme: 2/3 = 0.667 → × 70 = 46.7
  Tercih Eşleşme:  1/2 = 0.50  → × 30 = 15.0
  Toplam Skor: 62 / 100
```

---

## Kurulum

### Gereksinimler
- Node.js 18+
- npm 9+

### Frontend

```bash
cd app
npm install
npm run dev        # http://localhost:5000
```

### Backend

```bash
cd backend
cp .env.example .env   # .env dosyasını doldurun
npm install
node src/index.js      # http://localhost:5001
```

### Environment Variables

**`backend/.env`**
```env
SUPABASE_URL=https://<proje-id>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
PORT=5001
```

> `backend/.env` hiçbir zaman Git'e eklenmez (`.gitignore` tarafından hariç tutulur).

### Kalıcı Backend (PM2)

```bash
npm install -g pm2
cd backend
pm2 start src/index.js --name go4talent-api
pm2 save
pm2 startup   # sistem başlangıcında otomatik başlat
```

---

## Proje Yapısı

```
Go4Talent_Match_AI/
├── app/                          # Next.js 16 frontend (port 5000)
│   ├── src/
│   │   ├── app/                  # App Router sayfaları
│   │   │   ├── dashboard/
│   │   │   ├── adaylar/[id]/
│   │   │   ├── pozisyonlar/[id]/
│   │   │   ├── mulakat/[id]/
│   │   │   ├── raporlar/
│   │   │   ├── ayarlar/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── components/           # HTML markup string template'leri
│   │   │   ├── dashboardMarkup.ts
│   │   │   ├── adaylarMarkup.ts
│   │   │   ├── adayDetayMarkup.ts
│   │   │   ├── pozisyonlarMarkup.ts
│   │   │   ├── pozisyonDetayMarkup.ts
│   │   │   ├── mulakatMarkup.ts
│   │   │   ├── mulakatFormMarkup.ts
│   │   │   ├── raporlarMarkup.ts
│   │   │   ├── ayarlarMarkup.ts
│   │   │   ├── loginMarkup.ts
│   │   │   ├── registerMarkup.ts
│   │   │   └── sidebarMarkup.ts
│   │   └── lib/
│   │       └── supabaseConfig.ts # SB_URL, SB_KEY, sbHelpers string
│   └── public/
│       └── dashboard.css
├── backend/                      # Fastify API (port 5001)
│   ├── src/index.js
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Kullanım Kılavuzu

### İlk Kullanım

1. **Hesap Oluştur** — `/register` sayfasından ücretsiz kayıt olun
2. **Pozisyon Ekle** — Sol menüden "Pozisyonlar" → "Yeni Pozisyon"
   - Zorunlu skill'leri virgülle girin (%70 ağırlıklı)
   - Tercih edilen skill'leri girin (%30 ağırlıklı)
3. **Aday Ekle** — "Adaylar" → "CV Yükle"
   - Pozisyon seçin → ad, e-posta, skill'leri girin
   - Sistem otomatik uyum skoru hesaplar ve önizler
   - CV dosyasını yükleyin (PDF/DOCX, isteğe bağlı)
4. **Adayı İncele** — Listeden adaya tıklayın
   - Skor detayı görün: hangi skill'ler eşleşiyor, hangisi eksik
   - Durumunu güncelleyin: Mülakat → Teklif / Reddedildi
   - Not ekleyin

### Ön Görüşme Akışı

1. **Soru Oluştur** — "Ön Görüşme" menüsü → pozisyon seçin → soruları ekleyin
2. **Link Gönder** — Her aday için form linki otomatik oluşur → kopyalayıp e-posta ile gönderin
3. **Formu Doldur** — Aday hesap açmadan linki açar ve yanıtlar
4. **Yanıtları Gör** — "Ön Görüşme" sayfasının altında "Tamamlanan Yanıtlar" accordion bölümü

### Raporlar

- **Huni** — Kaç adayın mülakat ve teklif aşamasına ilerlediğini görün (gerçek geçiş sayıları)
- **Skor Dağılımı** — Aday havuzunuzun genel kalitesini ölçün
- **CSV İndir** — Tüm aday verisi Excel'e aktarılabilir
- **Tarih Filtresi** — Son 30/90/365 gün veya tüm zamanlar

### Bildirimler

- Sidebar'daki zil ikonuna tıklayarak son bildirimleri görün
- Bildirimlere tıklayarak okundu olarak işaretleyin
- Sistem her 30 saniyede bir yeni bildirim kontrol eder

---

## Güvenlik

- **RLS:** Tüm tablolarda Row Level Security aktif — kullanıcılar yalnızca kendi verilerini görür
- **PII Koruması:** Mülakat formu anonim erişim için `candidates_public` VIEW kullanır (email, notlar gizli)
- **Token Güvenliği:** JWT 1 saat geçerli, otomatik refresh_token akışı ile yenilenir
- **401 Koruması:** Süresi dolmuş token tespit edildiğinde localStorage temizlenir ve login sayfasına yönlendirilir
- **Service Key:** `SUPABASE_SERVICE_KEY` hiçbir zaman frontend'e gönderilmez

---

## Pazarlama

### Hedef Kitle

- **5–200 çalışanlı şirketlerin İK departmanları**
- Spreadsheet ve e-posta ile aday takibi yapan ekipler
- Workday / SAP gibi kurumsal yazılımlara bütçesi yetmeyen şirketler

### Rekabet Avantajı

| Özellik | Go4Talent MatchAI | Klasik ATS |
|---------|-------------------|-----------|
| Kurulum süresi | 5 dakika | Haftalar |
| Otomatik skill skoru | ✅ | ❌ veya ücretli eklenti |
| Ön görüşme formu | ✅ (link gönder) | Genellikle yok |
| Fiyat | Açık kaynak (self-host) | $50–500/ay |
| Türkçe arayüz | ✅ Tam | Nadiren |
| KVKK araçları | ✅ Dahili | Ayrı modül |

### Değer Önerisi

> "CV incelemeye harcadığınız sürenin %60'ını azaltın. Uyum skoru sayesinde ilk 5 dakikada en iyi adayı görün."

---

## Roadmap

### v1.1
- [ ] Pozisyon düzenlenince aday skorlarını yeniden hesapla
- [ ] DB seviyesinde pagination (server-side limit/offset)
- [ ] PM2 ekosistem dosyası ile tek komut başlatma

### v1.2
- [ ] E-posta bildirimleri (Resend / SendGrid)
- [ ] Ekip üyesi daveti (çoklu kullanıcı / organizasyon)
- [ ] Google Calendar entegrasyonu (mülakat takvimi)

### v2.0
- [ ] CV otomatik parse (PDF → skill çıkarımı)
- [ ] Slack / Teams bildirimleri
- [ ] REST API (harici entegrasyon için)
- [ ] White-label desteği

---

## Lisans

MIT License — ticari ve açık kaynak kullanıma uygun.

---

Geliştirici: [@Krayirhan](https://github.com/Krayirhan)
