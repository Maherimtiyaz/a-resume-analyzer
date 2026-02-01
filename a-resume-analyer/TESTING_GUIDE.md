# 🧪 Testing Guide - AI Resume Analyzer

**Date:** February 1, 2026  
**Status:** Servers Running & Ready to Test

---

## 🌐 Server Status

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5173 | ✅ Running |
| **Backend API** | http://localhost:8000 | ✅ Running |
| **API Docs** | http://localhost:8000/docs | ✅ Available |
| **Health Check** | http://localhost:8000/api/health | ✅ Passing |

**PowerShell Windows:** 2 windows are open (Backend & Frontend)

---

## 📋 Features to Test

### 1. 🔐 Authentication (PRIORITY - Test First)

#### Sign Up
1. Go to http://localhost:5173
2. Click **"Sign Up"** button
3. Enter **any valid email**: 
   - Examples: `test@example.com`, `john.doe@company.org`, `user+tag@gmail.com`
4. Enter **password** (minimum 8 characters)
5. Click **"Submit"**

**Expected Result:**
- ✅ Success message
- ✅ Automatic login
- ✅ Redirect to dashboard
- ✅ User info displayed
- ✅ JWT token stored in localStorage

**Database Check:**
```bash
cd Backend
sqlite3 resume_analyzer.db "SELECT * FROM users;"
sqlite3 resume_analyzer.db "SELECT * FROM subscriptions;"
```

#### Login
1. Click **"Login"** button
2. Enter the email you just registered
3. Enter the password
4. Click **"Submit"**

**Expected Result:**
- ✅ Success message
- ✅ Redirect to dashboard
- ✅ JWT token refreshed

#### View Profile
1. After login, click on **"Profile"** or user icon
2. Should display:
   - Email address
   - Account status
   - Created date
   - Subscription plan

---

### 2. 📄 Resume Matching (Core Feature)

#### Text-to-Text Matching
1. Go to **"Match Resume"** page
2. **Resume Text Area:**
   ```
   Software Engineer with 5 years of experience in Python, FastAPI, 
   and React. Expert in building REST APIs, database design with 
   PostgreSQL, and cloud deployment on AWS. Strong knowledge of 
   Docker, CI/CD, and microservices architecture.
   ```

3. **Job Description Area:**
   ```
   Looking for a Senior Python Developer with FastAPI experience. 
   Must have knowledge of React, PostgreSQL, Docker, and AWS. 
   Experience with microservices and CI/CD pipelines required.
   ```

4. Click **"Match"**

**Expected Result:**
- ✅ Match Score: 0.75-0.95 (75-95%)
- ✅ Matched Keywords: python, fastapi, react, postgresql, docker, aws, microservices, ci/cd
- ✅ Missing Keywords: (if any)
- ✅ Suggestions: (improvements)
- ✅ ATS Score breakdown

**Database Check:**
```bash
sqlite3 Backend/resume_analyzer.db "SELECT * FROM match_history ORDER BY created_at DESC LIMIT 1;"
```

#### PDF Upload & Match
1. Go to **"Upload Resume"** page
2. Click **"Choose File"**
3. Select a PDF resume
4. Enter job description
5. Click **"Upload & Match"**

**Expected Result:**
- ✅ PDF parsed successfully
- ✅ Text extracted from PDF
- ✅ Match score calculated
- ✅ Results displayed

**Test PDFs:** Any standard resume PDF

---

### 3. 🎨 Resume Builder

#### Create Resume
1. Go to **"Resume Builder"** page
2. Select a template (e.g., "Professional", "Modern")
3. Fill in information:
   - Personal Details (Name, Email, Phone)
   - Summary
   - Work Experience
   - Education
   - Skills
4. Click **"Generate Resume"**

**Expected Result:**
- ✅ Preview displayed
- ✅ PDF generated
- ✅ Download button available
- ✅ Saved to database

**Database Check:**
```bash
sqlite3 Backend/resume_analyzer.db "SELECT id, user_id, template_name, score FROM resume_builds;"
```

---

### 4. 💳 Subscription Management

#### View Subscription
1. Go to **"Subscription"** or **"Account"** page
2. Should display:
   - Current Plan: "free"
   - Remaining Credits: 1
   - Trial Status
   - Upgrade options

**Expected Result:**
- ✅ Free plan displayed
- ✅ 1 credit available
- ✅ Upgrade buttons visible

**Database Check:**
```bash
sqlite3 Backend/resume_analyzer.db "SELECT user_id, plan, remaining_credits, trial_used FROM subscriptions;"
```

---

### 5. 🔍 Batch Processing (Advanced)

#### Multiple Resume Matching
1. Go to **"Batch Match"** page (if available)
2. Upload multiple resumes
3. Enter job description
4. Click **"Process Batch"**

**Expected Result:**
- ✅ All resumes processed
- ✅ Scores calculated for each
- ✅ Results table displayed
- ✅ Downloadable results

---

## 🗄️ Database Verification

### Location
```
Backend/resume_analyzer.db
```

### View with SQLite CLI
```bash
# Navigate to Backend folder
cd Backend

# Open database
sqlite3 resume_analyzer.db

# View all tables
.tables

# Check users
SELECT * FROM users;

# Check subscriptions
SELECT * FROM subscriptions;

# Check resumes
SELECT * FROM resume_builds;

# Check match history
SELECT * FROM match_history;

# Exit
.quit
```

### View with DB Browser for SQLite
1. Download: https://sqlitebrowser.org/
2. Open `Backend/resume_analyzer.db`
3. Browse Data tab
4. Select table to view

---

## 🧪 API Testing (Backend Direct)

### Test with cURL

#### Health Check
```bash
curl http://localhost:8000/api/health
```

#### Sign Up
```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"api-test@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"api-test@example.com","password":"password123"}'
```

#### Match Resume
```bash
curl -X POST "http://localhost:8000/api/match" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Python Developer with FastAPI experience",
    "job_description": "Looking for Python developer with FastAPI skills"
  }'
```

### Test with Swagger UI
1. Go to: http://localhost:8000/docs
2. Click on any endpoint
3. Click **"Try it out"**
4. Fill in parameters
5. Click **"Execute"**

---

## ✅ Test Checklist

### Authentication
- [ ] Sign up with valid email
- [ ] Sign up fails with invalid email
- [ ] Sign up fails with short password
- [ ] Login with correct credentials
- [ ] Login fails with wrong credentials
- [ ] View user profile
- [ ] Logout

### Resume Matching
- [ ] Match text resume to job description
- [ ] Upload PDF resume and match
- [ ] View match score (0-1 range)
- [ ] View matched keywords
- [ ] View missing keywords
- [ ] View suggestions

### Resume Builder
- [ ] Select template
- [ ] Fill in all fields
- [ ] Generate resume
- [ ] Download PDF
- [ ] View in database

### Subscription
- [ ] View current plan
- [ ] Check remaining credits
- [ ] Credits deducted after use
- [ ] Upgrade options visible

### Database
- [ ] Users table populated
- [ ] Subscriptions auto-created
- [ ] Resume builds saved
- [ ] Match history recorded

---

## 🐛 Common Issues & Solutions

### Frontend not loading
- Check the PowerShell window for errors
- Wait 30-60 seconds on first start
- Clear browser cache: Ctrl+Shift+R
- Check: http://localhost:5173

### Backend not responding
- Check the PowerShell window for errors
- Verify: http://localhost:8000/api/health
- Check database file exists: `Backend/resume_analyzer.db`

### Signup not working
- ✅ Should be fixed now (accepts any email)
- Check browser console (F12) for errors
- Check backend logs in PowerShell window

### PDF upload fails
- Ensure PDF is valid and not corrupted
- Check file size (max 10MB typically)
- Try with a simple text-based PDF first

### Database locked
- Close all connections to database
- Restart backend server
- Check no other process is using the DB

---

## 📊 Expected Performance

| Operation | Expected Time | Score Range |
|-----------|--------------|-------------|
| Sign Up | < 1 second | N/A |
| Login | < 1 second | N/A |
| Text Match | < 2 seconds | 0.0 - 1.0 |
| PDF Upload | 2-5 seconds | 0.0 - 1.0 |
| Resume Build | 3-5 seconds | N/A |

---

## 📸 What to Look For

### Good Match (Score > 0.7)
- Many matched keywords
- Few missing keywords
- High ATS score
- Positive suggestions

### Medium Match (Score 0.4-0.7)
- Some matched keywords
- Several missing keywords
- Moderate ATS score
- Improvement suggestions

### Low Match (Score < 0.4)
- Few matched keywords
- Many missing keywords
- Low ATS score
- Major improvements needed

---

## 🎯 Test Scenarios

### Scenario 1: New User Journey
1. Sign up → Login → View Dashboard
2. Upload resume → Match with job
3. View results → Save
4. Check subscription credits

### Scenario 2: Resume Builder
1. Login → Go to Builder
2. Select template → Fill info
3. Generate → Download PDF
4. Check database

### Scenario 3: Multiple Matches
1. Login → Match resume
2. Try different job descriptions
3. Compare scores
4. View history

---

## 🔍 What to Check in Database

After each test, verify:

### Users Table
- Email saved correctly (lowercase)
- Password is hashed (not plain text)
- is_verified = False (for new users)
- created_at timestamp

### Subscriptions Table
- Auto-created with user
- Plan = "free"
- remaining_credits = 1
- trial_used = False

### Resume Builds Table
- user_id matches your user
- template_name saved
- resume_content is JSON
- score calculated

### Match History Table
- Records each matching operation
- user_id correct
- match_score between 0-1
- keywords stored as JSON

---

## ✨ Success Criteria

### ✅ All Features Working If:
- Sign up works with any email
- Login authenticates correctly
- Resume matching returns scores
- PDF upload parses text
- Resume builder generates PDF
- Subscription shows correct data
- Database records all operations

---

## 📞 Support

If you encounter issues:
1. Check both PowerShell windows for errors
2. Check browser console (F12 → Console tab)
3. Verify database: `sqlite3 Backend/resume_analyzer.db`
4. Check API docs: http://localhost:8000/docs
5. Review logs in terminal windows

---

**🎉 Ready to test! Start with Sign Up at http://localhost:5173**

---

**Last Updated:** February 1, 2026  
**Servers Running:** Backend (8000) + Frontend (5173)
