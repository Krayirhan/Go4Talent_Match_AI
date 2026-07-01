# Skill taxonomy — her skill için canonical isim + alias listesi
# Eşleştirme: alias → canonical

SKILL_TAXONOMY = {
    # ── Frontend ──
    "React": ["react", "react.js", "reactjs", "react js"],
    "Vue.js": ["vue", "vuejs", "vue.js", "vue js"],
    "Angular": ["angular", "angularjs", "angular.js"],
    "Next.js": ["next", "nextjs", "next.js"],
    "TypeScript": ["typescript", "ts"],
    "JavaScript": ["javascript", "js", "es6", "es2015", "ecmascript"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
    "Redux": ["redux", "redux toolkit", "rtk"],
    "GraphQL": ["graphql", "gql"],
    "Webpack": ["webpack"],
    "Vite": ["vite"],

    # ── Backend ──
    "Node.js": ["node", "nodejs", "node.js"],
    "Python": ["python", "python3"],
    "Java": ["java"],
    "Go": ["go", "golang"],
    "Rust": ["rust"],
    "PHP": ["php"],
    "Ruby": ["ruby", "ruby on rails", "rails"],
    "C#": ["c#", "csharp", "c sharp"],
    "C++": ["c++", "cpp"],
    "FastAPI": ["fastapi", "fast api"],
    "Django": ["django"],
    "Flask": ["flask"],
    "Spring": ["spring", "spring boot", "springboot"],
    "Express.js": ["express", "expressjs", "express.js"],
    "Fastify": ["fastify"],
    "NestJS": ["nestjs", "nest.js", "nest"],
    "Laravel": ["laravel"],
    ".NET": [".net", "dotnet", "asp.net", "asp .net"],

    # ── Veritabanı ──
    "PostgreSQL": ["postgresql", "postgres", "pg"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo"],
    "Redis": ["redis"],
    "Supabase": ["supabase"],
    "Firebase": ["firebase"],
    "SQLite": ["sqlite"],
    "Elasticsearch": ["elasticsearch", "elastic search", "elastic"],
    "Cassandra": ["cassandra"],
    "Oracle": ["oracle", "oracle db"],
    "SQL": ["sql", "t-sql", "pl/sql"],

    # ── Cloud & DevOps ──
    "AWS": ["aws", "amazon web services", "amazon aws"],
    "Azure": ["azure", "microsoft azure"],
    "GCP": ["gcp", "google cloud", "google cloud platform"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "CI/CD": ["ci/cd", "cicd", "ci cd", "continuous integration"],
    "Terraform": ["terraform"],
    "Ansible": ["ansible"],
    "Jenkins": ["jenkins"],
    "GitHub Actions": ["github actions", "github action"],
    "Linux": ["linux", "ubuntu", "centos", "debian"],
    "Nginx": ["nginx"],

    # ── Veri Bilimi / ML ──
    "Machine Learning": ["machine learning", "ml", "makine öğrenmesi", "makine öğrenimi"],
    "Deep Learning": ["deep learning", "derin öğrenme"],
    "NLP": ["nlp", "natural language processing", "doğal dil işleme"],
    "TensorFlow": ["tensorflow", "tf"],
    "PyTorch": ["pytorch", "torch"],
    "scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy", "np"],
    "Matplotlib": ["matplotlib"],
    "OpenCV": ["opencv", "open cv"],
    "Hugging Face": ["hugging face", "huggingface", "transformers"],
    "LLM": ["llm", "large language model", "gpt", "chatgpt"],

    # ── Mobil ──
    "React Native": ["react native", "rn"],
    "Flutter": ["flutter"],
    "iOS": ["ios", "swift", "objective-c"],
    "Android": ["android", "kotlin", "java android"],
    "Swift": ["swift"],
    "Kotlin": ["kotlin"],

    # ── Test ──
    "Jest": ["jest"],
    "Cypress": ["cypress"],
    "Selenium": ["selenium"],
    "Playwright": ["playwright"],
    "Unit Testing": ["unit test", "unit testing", "birim test"],

    # ── Araçlar & Metodoloji ──
    "Git": ["git", "github", "gitlab", "bitbucket"],
    "Agile": ["agile", "scrum", "kanban", "sprint"],
    "REST API": ["rest", "rest api", "restful", "restful api"],
    "Microservices": ["microservices", "microservice", "mikro servis"],
    "GraphQL": ["graphql", "gql"],

    # ── İK / İş Analizi ──
    "İşe Alım": ["işe alım", "recruitment", "talent acquisition", "headhunting"],
    "Performans Yönetimi": ["performans yönetimi", "performance management"],
    "Yetkinlik Değerlendirme": ["yetkinlik değerlendirme", "competency assessment"],
    "İş Analizi": ["iş analizi", "business analysis", "ba"],
    "Proje Yönetimi": ["proje yönetimi", "project management", "pmp"],
    "SAP HR": ["sap hr", "sap hcm", "successfactors"],
}

# alias → canonical reverse map (küçük harf)
ALIAS_MAP: dict[str, str] = {}
for canonical, aliases in SKILL_TAXONOMY.items():
    ALIAS_MAP[canonical.lower()] = canonical
    for alias in aliases:
        ALIAS_MAP[alias.lower()] = canonical
