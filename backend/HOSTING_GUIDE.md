# CredNest Backend Hosting Guide

## 🚀 Hosting Options Overview

This guide covers multiple hosting platforms for your CredNest backend, from free options to production-ready solutions.

---

## 1. 🆓 Render (Recommended for Beginners)

### Why Render?
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL certificates
- ✅ Easy environment variable management
- ✅ No credit card required for free tier

### Step-by-Step Setup

#### 1. Prepare Your Code
```bash
# Make sure your package.json has the correct start script
npm run start  # Should run: node server.js
```

#### 2. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub repository

#### 3. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure settings:
   - **Name:** `crednest-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

#### 4. Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-render
ADMIN_EMAIL=admin@crednest.com
ADMIN_PASSWORD=admin123
```

#### 5. Deploy
- Click "Create Web Service"
- Render will automatically deploy your app
- Your backend will be available at: `https://crednest-backend.onrender.com`

### Render Limitations (Free Tier)
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ 750 hours/month limit
- ⚠️ Slower cold starts

---

## 2. 🌐 Railway (Great Alternative)

### Why Railway?
- ✅ $5/month credit for free
- ✅ No sleep mode
- ✅ Fast deployments
- ✅ Great developer experience

### Setup Steps

#### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Install Railway CLI (optional):
```bash
npm install -g @railway/cli
```

#### 2. Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Node.js

#### 3. Environment Variables
Add in Railway dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-railway
ADMIN_EMAIL=admin@crednest.com
ADMIN_PASSWORD=admin123
```

#### 4. Custom Domain (Optional)
- Go to Settings → Domains
- Add your custom domain
- Railway provides free SSL

---

## 3. ☁️ Heroku (Classic Choice)

### Why Heroku?
- ✅ Mature platform
- ✅ Extensive add-ons ecosystem
- ✅ Good documentation
- ❌ No free tier anymore ($7/month minimum)

### Setup Steps

#### 1. Install Heroku CLI
Download from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

#### 2. Login and Create App
```bash
heroku login
heroku create crednest-backend
```

#### 3. Configure Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-heroku"
heroku config:set ADMIN_EMAIL="admin@crednest.com"
heroku config:set ADMIN_PASSWORD="admin123"
```

#### 4. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

## 4. 🚀 Vercel (Serverless)

### Why Vercel?
- ✅ Generous free tier
- ✅ Excellent performance
- ✅ Built for modern web apps
- ⚠️ Serverless (functions timeout after 10s on free tier)

### Setup Steps

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Create vercel.json
Create this file in your backend folder:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 3. Deploy
```bash
cd backend
vercel
```

#### 4. Set Environment Variables
```bash
vercel env add NODE_ENV
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
```

---

## 5. 🐳 DigitalOcean App Platform

### Why DigitalOcean?
- ✅ $200 free credit for new users
- ✅ Predictable pricing
- ✅ Great performance
- ✅ Easy scaling

### Setup Steps

#### 1. Create DigitalOcean Account
1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up and get $200 credit

#### 2. Create App
1. Go to Apps → Create App
2. Connect GitHub repository
3. Configure:
   - **Name:** `crednest-backend`
   - **Plan:** Basic ($5/month)
   - **Instance Size:** Basic

#### 3. Environment Variables
Add in App settings:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://crednesttech_db_user:JiayEGJwITsrAhIM@cluster0.heovopj.mongodb.net/CredNest?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-do
ADMIN_EMAIL=admin@crednest.com
ADMIN_PASSWORD=admin123
```

---

## 🔧 Pre-Deployment Checklist

### 1. Update server.js for Production
Make sure your server handles the PORT environment variable:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### 2. Add Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 3. Update CORS for Production
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com', 'https://your-custom-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};

app.use(cors(corsOptions));
```

### 4. Environment Variables Security
- ✅ Never commit `.env` files
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Change default admin credentials
- ✅ Use environment-specific database names

---

## 🎯 Recommended Hosting Strategy

### For Learning/Testing: **Render**
- Free tier
- Easy setup
- Good for demos

### For Small Projects: **Railway**
- $5/month credit
- No sleep mode
- Better performance

### For Production: **DigitalOcean**
- Predictable costs
- Better control
- Professional features

---

## 📊 Monitoring Your Deployed Backend

### 1. Test Your Endpoints
```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test API endpoint
curl https://your-backend-url.com/api/loan-applications

# Test with authentication
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crednest.com","password":"admin123"}'
```

### 2. Monitor Logs
- **Render:** View logs in dashboard
- **Railway:** Use `railway logs`
- **Heroku:** Use `heroku logs --tail`
- **Vercel:** View function logs in dashboard

### 3. Set Up Uptime Monitoring
Use services like:
- [UptimeRobot](https://uptimerobot.com) (Free)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

---

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Rate Limiting
Install and configure:
```bash
npm install express-rate-limit
```

### 3. Security Headers
```bash
npm install helmet
```

### 4. Input Validation
```bash
npm install joi express-validator
```

---

## 🚨 Troubleshooting Common Issues

### 1. MongoDB Connection Issues
- ✅ Check MongoDB Atlas IP whitelist
- ✅ Verify connection string format
- ✅ Ensure database user has correct permissions

### 2. CORS Errors
- ✅ Update CORS origins for production
- ✅ Include credentials: true if needed
- ✅ Check frontend API base URL

### 3. Environment Variables Not Loading
- ✅ Verify variable names match exactly
- ✅ Check hosting platform's env var syntax
- ✅ Restart the application after changes

### 4. Port Issues
- ✅ Use `process.env.PORT` for hosting platforms
- ✅ Bind to `0.0.0.0` not just `localhost`

---

## 📞 Next Steps After Deployment

1. **Update Frontend:** Change API base URL to your hosted backend
2. **Custom Domain:** Set up your own domain name
3. **SSL Certificate:** Ensure HTTPS is enabled
4. **Database Backup:** Set up MongoDB Atlas backups
5. **Monitoring:** Add error tracking and performance monitoring
6. **CI/CD:** Set up automatic deployments from GitHub

---

## 💡 Pro Tips

- 🔄 **Auto-deploy:** Connect GitHub for automatic deployments
- 📱 **Mobile-friendly:** Test API endpoints on mobile devices
- 🔍 **SEO:** Add proper meta tags and structured data
- 📈 **Analytics:** Monitor API usage and performance
- 🛡️ **Security:** Regular security audits and updates
- 💾 **Backup:** Regular database backups and disaster recovery plan

---

**Need help?** Check the troubleshooting section or create an issue in the repository!
