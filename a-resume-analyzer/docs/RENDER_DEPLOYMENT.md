# 🚀 Render Deployment Guide

## Deployment Error Fixed

**Previous Error:**
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

**Solution:** Recreated requirements.txt files in proper UTF-8 encoding instead of UTF-16.

---

## 📋 Prerequisites

1. **Render Account** - https://render.com
2. **GitHub Repository** - https://github.com/Maherimtiyaz/a-resume-analyzer
3. **PostgreSQL Database** - Created via Render Dashboard
4. **Environment Variables** - Set in Render Dashboard

---

## 🔧 Deploy Steps

### Step 1: Connect Repository
1. Log in to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Search for `a-resume-analyzer` repository
5. Click **"Connect"**

### Step 2: Configure Service
- **Name:** `ai-resume-analyzer-backend`
- **Environment:** Python
- **Region:** Select nearest (US East/Oregon)
- **Plan:** Free (or Paid for production)
- **Branch:** `main`

### Step 3: Build & Start Commands
- **Build Command:**
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command:**
  ```bash
  uvicorn Backend.main:app --host 0.0.0.0 --port 10000
  ```

### Step 4: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. **Name:** `ai-resume-analyzer-db`
3. **Plan:** Free
4. **Region:** Same as web service
5. Create database

### Step 5: Set Environment Variables
In the Web Service, go to **"Environment"** and add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Auto-populated from PostgreSQL |
| `SECRET_KEY` | Generate random 32-char string |
| `PYTHON_VERSION` | `3.11` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `CORS_ORIGINS` | `*` (or specific domain) |
| `LOG_LEVEL` | `INFO` |
| `APP_NAME` | `AI Resume Analyzer` |
| `VERSION` | `0.2.1` |
| `ADMIN_EMAIL` | Your email |

**Optional (for Stripe):**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe public key

### Step 6: Deploy
1. Click **"Create Web Service"**
2. Watch the build logs
3. Once deployed, you'll get a URL like: `https://ai-resume-analyzer-backend.onrender.com`

---

## ✅ Deployment Checklist

- [ ] Repository connected to Render
- [ ] Python 3.11 selected
- [ ] requirements.txt readable (UTF-8 encoding)
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] Database URL configured
- [ ] Build command runs successfully
- [ ] No ModuleNotFoundError
- [ ] Health check endpoint responds
- [ ] API endpoints accessible

---

## 🧪 Verify Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-render-url.onrender.com/health

# API documentation
https://your-render-url.onrender.com/docs

# Signup
curl -X POST https://your-render-url.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST https://your-render-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

## 🔍 Debugging

### Build Fails: "Could not open requirements file"
**Solution:** Ensure `requirements.txt` is in root directory and UTF-8 encoded
```bash
# Check encoding (should show "UTF-8")
file requirements.txt
```

### Build Fails: "No module named..."
**Solution:** Package missing from requirements.txt
```bash
# Add to requirements.txt and push
echo "package-name==1.0.0" >> requirements.txt
git add requirements.txt
git commit -m "fix: add missing package"
git push origin main
```

### Database Connection Error
**Solution:** Verify `DATABASE_URL` is set correctly
```bash
# Check environment variable
echo $DATABASE_URL
```

### ModuleNotFoundError: No module named 'Backend'
**Solution:** Ensure PYTHONPATH includes root directory
- Render usually handles this automatically
- If not, add to start command: `PYTHONPATH=/opt/render/project/src`

### API Not Responding
**Solution:** Check logs in Render dashboard
1. Click on web service
2. Scroll down to **"Logs"**
3. Look for error messages

---

## 📊 Production Configuration

### For Production (Paid Plan)

1. **Enable Auto-Deploy** - Redeploy on push
2. **Enable Health Checks** - Render monitors service
3. **Set Max Processes** - Based on plan
4. **Enable SSL/TLS** - Auto-configured by Render
5. **Set Custom Domain** - Add your domain

### Performance Settings

```yaml
maxInstances: 3          # For paid plans
cpuAllocation: high      # For intensive operations
memoryAllocation: 3GB    # For ML operations
```

---

## 🔐 Security Best Practices

1. **Never commit secrets** - Use .env.example template
2. **Set strong SECRET_KEY** - 32+ character random string
3. **Enable CORS carefully** - Restrict to your domain
4. **Use HTTPS only** - Render auto-enables
5. **Rotate credentials regularly** - Update environment variables
6. **Monitor logs** - Check for suspicious activity

---

## 📱 API Endpoints

Once deployed at `https://your-url.onrender.com/`:

```
POST   /api/auth/signup              # Create account
POST   /api/auth/login               # Login
GET    /api/health                   # Health check
POST   /api/resumes/upload           # Upload resume
POST   /api/resumes/parse            # Parse resume
POST   /api/resumes/match            # Match resume to jobs
GET    /api/resumes/list             # List resumes
GET    /api/admin/stats              # Admin statistics
```

See [Backend API Documentation](Backend/README.md) for details.

---

## 🆘 Support

- **Render Docs:** https://render.com/docs
- **API Reference:** https://docs.render.com
- **Status Page:** https://status.render.com
- **GitHub Issues:** https://github.com/Maherimtiyaz/a-resume-analyzer/issues

---

**Status: ✅ Ready to deploy to Render!**

Deploy now: https://dashboard.render.com/new/web
