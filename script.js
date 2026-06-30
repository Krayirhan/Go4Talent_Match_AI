// Scroll reveal animation
const revealItems = document.querySelectorAll(
  ".hero-copy, .hero-card, .trust-strip, .section-heading, .info-card, .solution-flow article, .playground-layout, .why-card, .architecture-panel, .cta-card"
);

revealItems.forEach((item) => item.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

// Theme Toggle logic
const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  const sunIcon = themeToggleBtn.querySelector(".sun-icon");
  const moonIcon = themeToggleBtn.querySelector(".moon-icon");

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    if (theme === "light") {
      sunIcon.style.display = "inline";
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline";
    }
  }

  setTheme(initialTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  });
}

// ==========================================
// CV MATCHING SIMULATOR LOGIC
// ==========================================
const simRunBtn = document.getElementById("sim-run-btn");
const candidateSelect = document.getElementById("candidate-select");
const roleSelect = document.getElementById("role-select");
const simConsole = document.getElementById("sim-console");
const simResultPanel = document.getElementById("sim-result-panel");
const simScoreValue = document.getElementById("sim-score-value");
const simCircleVal = document.getElementById("sim-circle-val");
const simHardTags = document.getElementById("sim-hard-tags");
const simSoftTags = document.getElementById("sim-soft-tags");
const simSummaryText = document.getElementById("sim-summary-text");
const simRecBadge = document.getElementById("sim-rec-badge");

const simDatabase = {
  "developer-backend": {
    score: 92,
    rec: "Şiddetle Önerilir",
    class: "rec-high",
    hard: ["Go (Golang)", "Docker", "PostgreSQL", "gRPC", "REST APIs", "Git"],
    soft: ["Analitik Düşünme", "Problem Çözme", "Bireysel Öğrenme Hızı"],
    summary: "Adayın 3 yıllık Go deneyimi, aranılan teknik altyapı ile birebir örtüşmektedir. Mikroservis mimarisi ve veritabanı optimizasyonu konularında güçlü sinyaller tespit edilmiştir. Düşük riskli, yüksek uyumlu bir profildir."
  },
  "developer-sales-lead": {
    score: 18,
    rec: "Önerilmez",
    class: "rec-low",
    hard: [],
    soft: ["Analitik Mantık Kurma"],
    summary: "Pozisyonun gerektirdiği kurumsal satış, müşteri yönetimi ve B2B müzakere deneyimleri adayda bulunmamaktadır. Teknik odaklı bir profil olup bu rol için uygun değildir."
  },
  "developer-hr-recruiter": {
    score: 32,
    rec: "Önerilmez",
    class: "rec-low",
    hard: ["Teknoloji Terminolojisi"],
    soft: ["Teknoloji Merakı"],
    summary: "Yazılım geçmişi teknik terminoloji hakimiyeti sağlasa da, seçme yerleştirme operasyonları, aday bulma (sourcing) ve aday takip sistemleri deneyimi bulunmamaktadır. Rol için önerilmez."
  },
  "sales-backend": {
    score: 12,
    rec: "Önerilmez",
    class: "rec-low",
    hard: [],
    soft: ["İletişim Becerileri"],
    summary: "Adayın profilinde Go programlama dili, sunucu yönetimi veya veritabanı geliştirme yetkinliklerine dair hiçbir sinyal bulunmamaktadır. Tamamen satış odaklı bir profildir."
  },
  "sales-sales-lead": {
    score: 95,
    rec: "Şiddetle Önerilir",
    class: "rec-high",
    hard: ["B2B Kurumsal Satış", "Müşteri Yönetimi (CRM)", "Fiyat Müzakeresi", "Sales Pipeline Yönetimi"],
    soft: ["İkna Kabiliyeti", "Hitabet ve Sunum", "Stres Yönetimi", "Sonuç Odaklılık"],
    summary: "5 yıllık B2B kurumsal satış deneyimi, aranılan Enterprise Sales Executive profiliyle üst düzey uyumludur. Pipeline yönetimi ve CRM araçları yetkinliği mükemmel seviyededir."
  },
  "sales-hr-recruiter": {
    score: 45,
    rec: "Geliştirilebilir",
    class: "rec-mid",
    hard: ["Network İlişkileri"],
    soft: ["Empati", "İnsan İlişkileri"],
    summary: "Kurumsal ilişkiler kurma ve B2B iş geliştirme kabiliyeti, aday bulma operasyonlarında avantaj sağlayabilir. Ancak İK süreçleri ve aday değerlendirme alanlarında oryantasyona ihtiyaç vardır."
  },
  "recruiter-backend": {
    score: 15,
    rec: "Önerilmez",
    class: "rec-low",
    hard: [],
    soft: ["Sorgulayıcı Yaklaşım"],
    summary: "Teknik yazılım geliştirme yetkinliği aday profilinde yer almamaktadır. İK ve işe alım süreçlerine odaklı bir özgeçmiştir."
  },
  "recruiter-sales-lead": {
    score: 58,
    rec: "Geliştirilebilir",
    class: "rec-mid",
    hard: ["LinkedIn Network Kurma", "Müşteri Görüşmeleri"],
    soft: ["Aktif Dinleme", "Empati"],
    summary: "Adayın LinkedIn araçlarını kullanma ve aday mülakatlarındaki iletişim becerileri kurumsal satış için temel seviyede uyumludur. Ancak B2B satış kapatma ve pipeline yönetimi konularında desteklenmesi gerekir."
  },
  "recruiter-hr-recruiter": {
    score: 88,
    rec: "Önerilir",
    class: "rec-high",
    hard: ["Sourcing", "Aday Takip Sistemleri (ATS)", "Ön Eleme Mülakatı", "Yetenek Keşfi"],
    soft: ["İletişim Kabiliyeti", "Organizasyon Becerileri", "Zaman Yönetimi"],
    summary: "1 yıllık İK deneyimi, Junior Technical Recruiter rolünün operasyonel beklentilerini karşılamaktadır. Aday bulma (sourcing) ve ilk aşama ön eleme süreçlerinde verimlilik vadeden bir profildir."
  }
};

if (simRunBtn) {
  simRunBtn.addEventListener("click", () => {
    simResultPanel.style.display = "none";
    simConsole.style.display = "block";
    simConsole.innerHTML = "";
    simRunBtn.disabled = true;
    simRunBtn.textContent = "Analiz Ediliyor...";

    const candidate = candidateSelect.value;
    const role = roleSelect.value;
    const key = `${candidate}-${role}`;
    const result = simDatabase[key] || { score: 50, rec: "İncelenmeli", class: "rec-mid", hard: ["Temel Uyum"], soft: ["Genel Yetenek"], summary: "Aday verisi analiz edildi." };

    // Simulator terminal steps animation
    const steps = [
      "🔄 CV Yükleniyor...",
      "📝 Doğal Dil İşleme (NLP) ile Metin Çözümleniyor...",
      "🔍 Aday Yetenek Matrisi Çıkartılıyor...",
      "⚖️ Pozisyon Kriterleri Ağırlıklandırılıyor...",
      "🧠 MatchAI Algoritması Uyum Skorunu Hesaplıyor..."
    ];

    let currentStep = 0;
    function printStep() {
      if (currentStep < steps.length) {
        const line = document.createElement("div");
        line.className = "console-line";
        line.textContent = steps[currentStep];
        simConsole.appendChild(line);
        simConsole.scrollTop = simConsole.scrollHeight;
        currentStep++;
        setTimeout(printStep, 350);
      } else {
        setTimeout(showResults, 300);
      }
    }

    function showResults() {
      simConsole.style.display = "none";
      simResultPanel.style.display = "block";
      simRunBtn.disabled = false;
      simRunBtn.textContent = "Analizi Yeniden Başlat";

      simScoreValue.textContent = `${result.score}%`;
      
      // Animate circular chart
      const radius = 24;
      const circumference = 2 * Math.PI * radius; // 150.8
      const offset = circumference - (result.score / 100) * circumference;
      simCircleVal.style.strokeDashoffset = offset;

      // Render tags
      simHardTags.innerHTML = "";
      if (result.hard.length > 0) {
        result.hard.forEach(tag => {
          const span = document.createElement("span");
          span.className = "tag tag-extracted";
          span.textContent = tag;
          simHardTags.appendChild(span);
        });
      } else {
        simHardTags.innerHTML = '<span class="tag tag-empty">Eşleşen Sert Yetenek Bulunamadı</span>';
      }

      simSoftTags.innerHTML = "";
      if (result.soft.length > 0) {
        result.soft.forEach(tag => {
          const span = document.createElement("span");
          span.className = "tag tag-soft";
          span.textContent = tag;
          simSoftTags.appendChild(span);
        });
      }

      // Render decision summary
      simSummaryText.textContent = result.summary;

      // Render recommendation badge
      simRecBadge.className = `rec-badge ${result.class}`;
      simRecBadge.textContent = result.rec;
    }

    printStep();
  });
}

// ==========================================
// INTERACTIVE FEATURE PLAYGROUND TABS
// ==========================================
const tabs = document.querySelectorAll(".playground-tab");
const views = document.querySelectorAll(".preview-view");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    views.forEach(v => v.classList.remove("active"));

    tab.classList.add("active");

    const tabName = tab.getAttribute("data-tab");
    const targetView = document.getElementById(`view-${tabName}`);
    if (targetView) {
      targetView.classList.add("active");
    }
  });
});
