# 📄 Resume Screener

**Automatically scores resumes against job descriptions using keyword matching. Helps screen resumes faster.**

## 🎯 Problem Solved
HR spends hours reading resumes manually. This app automates keyword matching and ranks candidates based on job requirements.

## 🔧 How It Works
1. HR pastes job description (skills, experience required)
2. Upload PDF resumes (max 50 files)
3. App extracts text from PDF using Apache PDFBox
4. Scoring algorithm calculates match percentage based on keywords
5. Ranked results: Top candidates highlighted

## 📊 Scoring Algorithm
| Component | Weight | What It Checks |
|-----------|--------|----------------|
| Skills | 60% | Required keywords vs extracted text |
| Experience | 30% | Years mentioned vs requirement |
| Education | 10% | Degree level match |

## 🛠 Tech Stack
- **Frontend:** React, Tailwind CSS, React Dropzone
- **Backend:** Spring Boot, Java
- **Database:** PostgreSQL
- **PDF Parsing:** Apache PDFBox
- **Deployment:** Railway + Vercel

## 📈 Current Features
- Processes multiple PDF resumes at once
- Extracts candidate name, email from resume text
- Skills keyword matching from predefined list
- Exports results to CSV


## 🧪 Test with Sample Data
1. Download sample resumes from `samples/` folder
2. Upload to app
3. Paste job description: "Need Java Spring Boot developer"
4. See ranked results based on keyword matches

## 🔧 Local Setup
```bash
# Backend (Spring Boot)
cd backend
./mvnw spring-boot:run

# Frontend (React)
cd frontend
npm install
npm run dev

# Database (PostgreSQL)
# Create database named 'resume_screener'
# Update application.properties with your DB credentials
