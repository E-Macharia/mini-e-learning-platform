# 🚀 Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Start the Backend Server
```bash
npm start
```
The server will run on `http://localhost:3000`

## Step 3: Test the Platform
1. Open `http://localhost:3000` in your browser
2. Sign up for a new account
3. Browse courses and enroll
4. Watch video lessons
5. Track your progress
6. Earn certificates!

## 🎯 Testing Checklist

### ✅ Basic Functionality
- [ ] Server starts without errors
- [ ] Home page loads with course catalog
- [ ] User registration works
- [ ] User login works
- [ ] Course detail pages load
- [ ] Video lessons play
- [ ] Progress tracking works
- [ ] Certificate generation works

### ✅ Advanced Features
- [ ] Discussion forums work
- [ ] Analytics dashboard loads
- [ ] Mobile responsive design
- [ ] Real-time progress updates
- [ ] User authentication persists

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Check Node.js version
node --version

# Install dependencies
npm install

# Check for port conflicts
netstat -an | grep 3000
```

### CORS Errors
- Ensure backend is running on port 3000
- Check browser console for errors
- Try refreshing the page

### Video Not Loading
- Check YouTube URLs in db.json
- Ensure videos are publicly accessible
- Try different video URLs

## 📱 Mobile Testing
1. Open browser developer tools
2. Toggle device toolbar
3. Test on different screen sizes
4. Check touch interactions

## 🎨 Customization
- Edit `db.json` to add new courses
- Modify `styles.css` for custom themes
- Update `server.js` for backend changes

## 🚀 Deployment
1. **Heroku**: `git push heroku main`
2. **Vercel**: Connect GitHub repository
3. **DigitalOcean**: Deploy with Docker
4. **AWS**: Use Elastic Beanstalk

## 📊 Performance Testing
- Use browser dev tools to check load times
- Test with multiple users
- Monitor server logs for errors
- Check database performance

## 🔒 Security Testing
- Test authentication flows
- Verify password hashing
- Check JWT token expiration
- Test input validation

## 📈 Analytics Testing
- Complete a course
- Check progress tracking
- Verify certificate generation
- Test analytics dashboard

## 🎓 Educational Features Testing
- Enroll in multiple courses
- Complete video lessons
- Participate in forums
- View learning analytics
- Download certificates

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution**: Run `npm install` to install dependencies

### Issue: "Port 3000 already in use"
**Solution**: Kill the process using port 3000 or change the port in server.js

### Issue: "CORS policy error"
**Solution**: Ensure backend is running and accessible

### Issue: "Video not loading"
**Solution**: Check YouTube URLs and ensure they're embeddable

### Issue: "Authentication not working"
**Solution**: Clear browser localStorage and try again

## 🎉 Success Indicators
- ✅ Server starts without errors
- ✅ All pages load correctly
- ✅ User authentication works
- ✅ Video lessons play
- ✅ Progress tracking functions
- ✅ Certificates generate
- ✅ Forums work
- ✅ Analytics display
- ✅ Mobile responsive
- ✅ All features functional

## 📞 Need Help?
- Check the README.md for detailed documentation
- Review the troubleshooting section
- Check browser console for errors
- Verify all dependencies are installed
- Ensure Node.js version is compatible

