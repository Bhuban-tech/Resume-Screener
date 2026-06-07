# Resume Screener — Spring Boot Backend

## Folder Structure

```
resume-screener/
├── pom.xml
└── src/
    └── main/
        ├── java/com/resumescreener/
        │   ├── ResumeScreenerApplication.java     ← Entry point
        │   ├── config/
        │   │   └── WebConfig.java                 ← CORS config
        │   ├── controller/
        │   │   └── ResumeController.java           ← REST endpoints
        │   ├── dto/
        │   │   ├── ScoreDto.java                   ← Score breakdown
        │   │   ├── ResumeResponseDto.java          ← API response
        │   │   └── UploadRequestDto.java           ← Upload request
        │   ├── entity/
        │   │   ├── JobDescription.java             ← JPA entity
        │   │   └── Resume.java                     ← JPA entity
        │   ├── exception/
        │   │   ├── GlobalExceptionHandler.java     ← @RestControllerAdvice
        │   │   └── ResourceNotFoundException.java
        │   ├── repository/
        │   │   ├── JobDescriptionRepository.java
        │   │   └── ResumeRepository.java
        │   └── service/
        │       ├── PDFParserService.java           ← PDFBox text extraction
        │       ├── SkillExtractorService.java      ← Regex + skill matching
        │       ├── ScoringService.java             ← Weighted scoring
        │       └── ResumeService.java              ← Orchestration
        └── resources/
            └── application.properties
```

---

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+

---

## Database Setup

```sql
CREATE DATABASE resume_screener CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/resume_screener?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=yourpassword
```

Hibernate auto-creates tables on first run (`ddl-auto=update`).

---

## Run the Application

```bash
# Clone / navigate to project root
cd resume-screener

# Build
mvn clean install

# Run
mvn spring-boot:run
```

Server starts at: `http://localhost:8080`

---

## API Endpoints

### 1. Upload & Screen Resumes

```
POST /api/resumes/upload
Content-Type: multipart/form-data
```

| Field | Type | Description |
|-------|------|-------------|
| jobTitle | String | e.g. "Senior Java Developer" |
| jobDescription | String | Full job description text |
| requiredSkills | String | Comma-separated: "Java,Spring Boot,Docker" |
| minExperience | Integer | e.g. 3 |
| files | MultipartFile[] | One or more PDF files |

**cURL example:**
```bash
curl -X POST http://localhost:8080/api/resumes/upload \
  -F "jobTitle=Senior Java Developer" \
  -F "jobDescription=We need a Java expert..." \
  -F "requiredSkills=Java,Spring Boot,Docker,PostgreSQL" \
  -F "minExperience=3" \
  -F "files=@resume1.pdf" \
  -F "files=@resume2.pdf"
```

**Response:** Ranked list (highest score first)
```json
[
  {
    "resumeId": 1,
    "candidateName": "John Doe",
    "candidateEmail": "john@example.com",
    "candidatePhone": "+91 9876543210",
    "scores": {
      "skill": 75.0,
      "experience": 100.0,
      "education": 80.0,
      "total": 86.0
    },
    "matchedSkills": ["Java", "Spring Boot", "PostgreSQL"],
    "missingSkills": ["Docker"],
    "recommendations": ["Learn Docker to improve skill score."],
    "fileName": "resume1.pdf",
    "experienceYears": 5,
    "education": "Bachelor(Tech)"
  }
]
```

---

### 2. Get Resume by ID

```
GET /api/resumes/{id}
```

```bash
curl http://localhost:8080/api/resumes/1
```

---

### 3. Delete Resume

```
DELETE /api/resumes/{id}
```

```bash
curl -X DELETE http://localhost:8080/api/resumes/1
```

---

## Scoring Algorithm

| Component | Weight | Logic |
|-----------|--------|-------|
| Skills | 60% | (matched / required) × 100 |
| Experience | 30% | 100% if met, 66% if -1yr, 33% if -2yr, 0% otherwise |
| Education | 10% | PhD=100, Masters=90, B.Tech=80, BA=70, Diploma=50, HS=30 |

**Total = (skillScore × 0.6) + (expScore × 0.3) + (eduScore × 0.1)**

---

## SOLID Principles Applied

| Principle | Where |
|-----------|-------|
| **Single Responsibility** | Each service has one job: PDFParser, SkillExtractor, Scoring, Orchestration |
| **Open/Closed** | ScoringService is closed for modification; extend skill list without changing core logic |
| **Liskov Substitution** | Repository interfaces — swap implementations without breaking services |
| **Interface Segregation** | JpaRepository slices per entity (Resume, JobDescription) |
| **Dependency Inversion** | Services injected via constructor (`@RequiredArgsConstructor`) |
