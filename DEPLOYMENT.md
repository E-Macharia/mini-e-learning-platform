# 🚀 Deployment Guide: Render + Vercel

This guide shows you how to deploy your e-learning platform with:
- **Backend**: Deployed on Render (free tier)
- **Frontend**: Deployed on Vercel (free tier)
- **Database**: JSON file storage (upgrade to PostgreSQL for production)

## 📋 Prerequisites

- GitHub account
- Render account (free)
- Vercel account (free)
- Git installed locally

## 🔧 Step 1: Prepare Backend for Render

### 1.1 Update package.json
```json
{
  "name": "e-learning-platform",
  "version": "1.0.0",
  "description": "Advanced e-learning platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### 1.2 Environment Variables
Create these environment variables in Render:
- `NODE_ENV=production`
- `JWT_SECRET=your-super-secret-jwt-key`
- `FRONTEND_URL=https://your-frontend.vercel.app`

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub repository

### 2.2 Deploy Backend Service
1. **New Web Service**
   - Connect GitHub repository
   - Choose "Web Service"
   - Name: `e-learning-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`

2. **Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://your-app.onrender.com`

### 2.3 Test Backend
```bash
curl https://your-app.onrender.com/api/courses
```

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend
1. **Update script.js** to use production API:
   ```javascript
   const API_BASE = 'https://your-app.onrender.com/api';
   ```

2. **Create vercel.json**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.html",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

### 3.2 Deploy to Vercel
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Or use Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Deploy automatically

### 3.3 Update Backend CORS
Update your Render backend environment variable:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update API Base URL
In your frontend code, update the API base URL:

```javascript
// In script.js or script-production.js
const API_BASE = 'https://your-app.onrender.com/api';
```

### 4.2 Test Integration
1. Open your Vercel frontend URL
2. Try to register a new user
3. Check if data is saved in Render backend
4. Test all features

## 🗄️ Step 5: Database Setup (Optional)

### 5.1 Upgrade to PostgreSQL (Recommended)
1. **Add PostgreSQL to Render**:
   - Go to your Render dashboard
   - Create new PostgreSQL database
   - Note connection details

2. **Update server.js**:
   ```javascript
   const { Pool } = require('pg');
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL
   });
   ```

### 5.2 Keep JSON Database (Free)
- Current setup uses JSON file storage
- Works for small to medium applications
- Upgrade to PostgreSQL for production

## 🔧 Step 6: Environment Configuration

### 6.1 Backend Environment Variables (Render)
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend.vercel.app
PORT=10000
```

### 6.2 Frontend Environment Variables (Vercel)
```
REACT_APP_API_URL=https://your-app.onrender.com/api
```

## 🧪 Step 7: Testing Your Deployment

### 7.1 Backend Testing
```bash
# Test API endpoints
curl https://your-app.onrender.com/api/courses
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 7.2 Frontend Testing
1. **Open your Vercel URL**
2. **Test user registration**
3. **Test course enrollment**
4. **Test video lessons**
5. **Test progress tracking**
6. **Test certificate generation**

## 🚀 Step 8: Production Optimizations

### 8.1 Performance
- Enable gzip compression
- Add caching headers
- Optimize images
- Use CDN for static assets

### 8.2 Security
- Use HTTPS (automatic with Render/Vercel)
- Set secure JWT secrets
- Add rate limiting
- Validate all inputs

### 8.3 Monitoring
- Add logging
- Monitor performance
- Set up error tracking
- Monitor database usage

## 🔄 Step 9: Continuous Deployment

### 9.1 Automatic Deployments
- **Render**: Auto-deploys on git push to main branch
- **Vercel**: Auto-deploys on git push to main branch

### 9.2 Manual Deployments
```bash
# Backend
git push origin main  # Auto-deploys to Render

# Frontend
vercel --prod  # Manual Vercel deployment
```

## 📊 Step 10: Monitoring & Maintenance

### 10.1 Render Monitoring
- Check deployment logs
- Monitor resource usage
- Set up alerts

### 10.2 Vercel Monitoring
- Check deployment status
- Monitor performance
- Review analytics

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in Render environment variables
   - Ensure URLs match exactly

2. **API Not Responding**
   - Check Render deployment logs
   - Verify environment variables
   - Test API endpoints directly

3. **Frontend Not Loading**
   - Check Vercel deployment status
   - Verify build configuration
   - Check browser console for errors

4. **Database Issues**
   - Check JSON file permissions
   - Verify database connection
   - Review error logs

### Debug Commands
```bash
# Check backend logs
curl https://your-app.onrender.com/api/health

# Test frontend
curl https://your-frontend.vercel.app

# Check environment variables
echo $NODE_ENV
echo $JWT_SECRET
```

## 🎉 Success Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] API endpoints working
- [ ] User authentication working
- [ ] Course data loading
- [ ] Video lessons playing
- [ ] Progress tracking functional
- [ ] Certificate generation working
- [ ] Discussion forums functional
- [ ] Analytics dashboard working
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] CORS configured correctly

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Create issues for bugs
- **Community**: Stack Overflow, Reddit

## 🎯 Next Steps

1. **Custom Domain**: Add custom domain to Vercel
2. **SSL Certificate**: Automatic with Vercel/Render
3. **Database Upgrade**: Move to PostgreSQL
4. **CDN**: Add CloudFlare for better performance
5. **Monitoring**: Add Sentry for error tracking
6. **Analytics**: Add Google Analytics
7. **SEO**: Optimize for search engines

Your e-learning platform is now live and production-ready! 🚀

