# Ikonex Academy - Student Management System 
 
## Brief User Guide 
 
### Setup, Deployment, System Usage, Grading, Reports and Support 
 
--- 
 
## 1. Platform Overview 
 
Ikonex Academy is a web-based Student Management System for schools to manage classes, students, subjects, scores, and generate performance reports. 
 
### Live URLs 
- **Live Application:** https://ikonex-academy.vercel.app 
- **GitHub Repository:** https://github.com/vincentmulonzi2-creator/ikonex-academy 
- **API Health:** https://ikonex-academy.vercel.app/api/health 
 
### Core Modules 
 
 
--- 
 
## 2. Setup and Deployment 
 
### Local Setup 
 
**Prerequisites:** 
- Node.js 18+ 
- PostgreSQL database (or Neon.tech account) 
- Git 
 
**Installation Steps:** 
 
```bash 
git clone https://github.com/vincentmulonzi2-creator/ikonex-academy.git 
cd ikonex-academy 
npm install 
npx prisma db push 
npx prisma generate 
npm run dev -- --port 3001 
``` 
 
**Local URLs:** 
- App: http://localhost:3001 
- API: http://localhost:3001/api/health 
 
### Production Deploy to Vercel 
 
```bash 
npm install -g vercel 
vercel login 
vercel --prod 
``` 
 
### Environment Variables 
 
 
--- 
 
## 3. System Usage 
 
### 3.1 Dashboard 
 
**URL:** `/` 
 
The dashboard shows: 
- Total Students 
- Class Streams 
- Subjects 
- Total Marks 
- Average Score 
 
### 3.2 Class Management 
 
**URL:** `/classes` 
 
 
### 3.3 Student Management 
 
**URL:** `/students` 
 
 
### 3.4 Subject Management 
 
**URL:** `/subjects` 
 
 
### 3.5 Score Recording 
 
**URL:** `/scores/record` 
 
 
**Duplicate Prevention:** Cannot record same assessment type for same student, subject, and term. 
 
### 3.6 View All Scores 
 
**URL:** `/scores` 
- View all recorded scores 
- Click "Edit" to modify a score 
- Click "Delete" to remove a score 
 
--- 
 
## 4. Reports and Rankings 
 
### 4.1 Class Performance Report 
 
**URL:** `/reports` 
 
1. Select a class from dropdown 
2. Click "Generate Report" 
3. View rankings with ?????? medals 
4. Click "Download PDF Report" for PDF version 
 
### 4.2 Subject Performance Report 
 
**URL:** `/reports/subject` 
 
1. Select a class 
2. Select a subject 
3. Select a term 
4. Click "Generate Subject Performance Report" 
5. Click "Download PDF Report" 
 
### 4.3 Student Report Card (PDF) 
 
**URL:** `/students`  Click "View" on any student  "Download Report Card" 
 
**PDF Includes:** 
- Student personal information 
- Subject-wise CA and EXAM scores 
- Total marks and average 
- Overall grade and class position 
 
### 4.4 Rankings Page 
 
**URL:** `/rankings` 
 
1. Select a class from dropdown 
2. Click "Show Rankings" 
3. View podium for top 3 students ?????? 
4. View full rankings table with grades 
 
--- 
 
## 5. Grading System 
 
**URL:** `/grade-scales` 
 
 
--- 
 
## 6. Navigation 
 
 
--- 
 
## 7. Troubleshooting 
 
### Common Issues and Solutions 
 
 
--- 
 
## 8. Support 
 
 
--- 
 
*Generated from the Ikonex Academy Student Management System* 
