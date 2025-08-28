# NEXTSTEP

## Overview
NEXTSTEP is a full-stack platform for internships, resume analysis, and career guidance. It consists of a React frontend, Node.js/Express backend, and a Python microservice for resume analysis.

---

## nextstep-frontend

To install dependencies:
```bash
npm install
```
To run:
```bash
npm run dev
```

---

## nextstep-backend

To install dependencies:
```bash
npm install
```
To run:
```bash
npm run dev
```

---

## ResumeAnalyzer (Python Microservice)

A FastAPI-based microservice for analyzing PDF resumes. Integrates with the frontend for quick scan analysis.

To install dependencies:
```bash
cd ResumeAnalyzer
pip install -r requirements.txt
```
To run:
```bash
uvicorn main:app --reload --port 8000
```

---

## Project Structure
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js, Prisma ORM
- Database: PostgreSQL
- Microservice: Python, FastAPI

## Features
- Internship listings and applications
- Resume quick scan analysis
- HR and student dashboards
- Profile management
- Announcements/Notices