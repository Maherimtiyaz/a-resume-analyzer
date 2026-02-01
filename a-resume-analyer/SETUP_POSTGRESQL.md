# PostgreSQL Setup - Quick Guide

## 🗄️ Your PostgreSQL Database

You mentioned you've already created the PostgreSQL database. Great!

---

## 🔧 Configure Backend Connection

### Step 1: Update Backend/.env file

I've created `Backend/.env` for you. Please update it with your PostgreSQL credentials:

**Edit this file:** `Backend/.env`

```env
# Update this line with YOUR credentials:
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE_NAME

# Example:
# DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/resume_analyzer_db
```

### Step 2: Replace these values:

- `YOUR_USERNAME` → Your PostgreSQL username (usually `postgres`)
- `YOUR_PASSWORD` → Your PostgreSQL password
- `YOUR_DATABASE_NAME` → Your database name (e.g., `resume_analyzer_db`)

---

## ✅ Example Configurations

### Example 1: Local PostgreSQL
```env
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/resume_analyzer_db
```

### Example 2: Custom User
```env
DATABASE_URL=postgresql://resume_admin:securepass@localhost:5432/resume_analyzer_db
```

### Example 3: Remote Database
```env
DATABASE_URL=postgresql://myuser:mypass@192.168.1.100:5432/resume_db
```

---

## 📋 Quick Setup Steps

### 1. What's your database name?
```
Database name: ________________
```

### 2. What's your PostgreSQL username?
```
Username: ________________ (usually 'postgres')
```

### 3. What's your PostgreSQL password?
```
Password: ________________
```

### 4. Update Backend/.env

Open `Backend/.env` and update the DATABASE_URL line:

```env
DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[database_name]
```

### 5. Initialize Database

```bash
cd Backend
python init_db.py
```

This will create all tables:
- users
- subscriptions  
- resume_builds
- match_history

### 6. Restart Backend

```bash
cd Backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## ✅ Verify Connection

### Test 1: Backend Health
```bash
curl http://localhost:8000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Test 2: Check Database
```sql
-- Connect to PostgreSQL
psql -U postgres -d resume_analyzer_db

-- List tables
\dt

-- Should show:
--  users
--  subscriptions
--  resume_builds
--  match_history

-- Exit
\q
```

---

## 🐛 Troubleshooting

### Error: "could not connect to server"
- ✅ Check PostgreSQL is running
- ✅ Check username/password are correct
- ✅ Check database name exists

### Error: "password authentication failed"
- ✅ Verify password in .env file
- ✅ Check no extra spaces in DATABASE_URL

### Error: "database does not exist"
```sql
-- Create database
psql -U postgres
CREATE DATABASE resume_analyzer_db;
\q
```

---

## 📝 What I Need From You

Please provide your PostgreSQL connection details:

```
1. Database Name: _______________
2. Username: _______________  
3. Password: _______________
4. Host: _______________ (usually localhost)
5. Port: _______________ (usually 5432)
```

**Then I'll update the .env file for you!**

---

## 🚀 After Setup

Once configured:

1. Backend will use PostgreSQL ✅
2. All data saved to PostgreSQL ✅
3. Production-ready database ✅
4. Industry-level schema ✅

---

**Current Status:**
- ✅ Backend: Running (currently on SQLite)
- ⏳ Frontend: Starting  
- ⏳ PostgreSQL: Waiting for your credentials
