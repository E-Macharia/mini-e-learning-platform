# Advanced E-Learning Platform

A comprehensive, full-stack e-learning platform with backend integration, video lessons, certificates, discussion forums, and advanced analytics. Built with modern web technologies for a production-ready experience.

## 🔴 Live Demo
- Frontend (Vercel): https://mini-e-learning-platform.vercel.app
- Backend API (Render): https://mini-e-learning-platform.onrender.com

## 🚀 Enhanced Features

### Core Learning Features
- 🎓 **Course Catalog**: Browse courses with ratings, instructors, and pricing
- 📚 **Video Lessons**: Embedded video player with lesson progression
- ✅ **Progress Tracking**: Real-time progress tracking with completion percentages
- 🏆 **Certificate Generation**: Automatic certificate generation upon course completion
- 📊 **Advanced Analytics**: Detailed learning analytics and progress charts

### Social & Community Features
- 💬 **Discussion Forums**: Course-specific discussion boards
- 👥 **User Profiles**: User management with enrollment tracking
- 🔐 **Secure Authentication**: JWT-based authentication system

### Technical Features
- 🗄️ **Backend Integration**: RESTful API with persistent data storage
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🎨 **Modern UI**: Professional design with smooth animations
- 🔄 **Real-time Updates**: Live progress updates and notifications

## Course Catalog

The platform includes 3 sample courses:

1. **Web Development Fundamentals** - Learn HTML, CSS, and JavaScript
2. **Python Programming** - Master Python from basics to advanced concepts
3. **Data Science with R** - Explore data analysis and statistical modeling

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`

4. **Open the platform**
   - Navigate to `http://localhost:3000` in your browser
   - Or open `index.html` directly for frontend-only testing

### File Structure

```
e-learning-platform/
├── server.js           # Express.js backend server
├── package.json        # Node.js dependencies
├── db.json            # JSON database
├── index.html         # Main page with course listing
├── course-detail.html # Course detail page with video player
├── styles.css         # Enhanced styling with animations
├── script.js          # Frontend JavaScript
├── script-enhanced.js # Enhanced JavaScript with backend integration
└── README.md          # This file
```

## 🎯 How to Use

### For Students
1. **Sign Up/Login**: Create an account or login to track your progress
2. **Browse Courses**: Explore the course catalog with ratings and pricing
3. **Enroll in Courses**: Click "Enroll Now" to start learning
4. **Watch Video Lessons**: Click on lessons to watch embedded videos
5. **Track Progress**: Monitor your completion percentage and lesson status
6. **Earn Certificates**: Complete courses to earn certificates
7. **Join Discussions**: Participate in course forums and discussions
8. **View Analytics**: Check your learning progress and achievements

### For Instructors
- Course management through the backend API
- Student progress monitoring
- Certificate generation system

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox, grid, and animations
- **JavaScript (ES6+)**: Interactive functionality and API integration
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **JSON Database**: File-based data storage

### Features
- **Video Integration**: YouTube embed support
- **Real-time Updates**: Live progress tracking
- **Responsive Design**: Works on all devices
- **Modern UI**: Professional design with smooth animations

## 🚀 Deployment Options

### Local Development
```bash
npm install
npm start
```

### Production Deployment
1. **Heroku**: Easy deployment with git
2. **Vercel**: Serverless deployment
3. **DigitalOcean**: VPS deployment
4. **AWS**: Scalable cloud deployment

### Environment Variables
```env
PORT=3000
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details

### Progress & Analytics
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Update lesson progress
- `GET /api/analytics/:userId` - Get learning analytics

### Certificates
- `POST /api/certificates` - Generate certificate

### Forums
- `GET /api/forums/:courseId` - Get course forums
- `POST /api/forums` - Create forum
- `GET /api/posts/:forumId` - Get forum posts
- `POST /api/posts` - Create post

## 🎨 Customization

### Adding New Courses
Edit `db.json` to add new courses with video lessons:

```json
{
  "id": "4",
  "title": "New Course",
  "description": "Course description",
  "instructor": "Instructor Name",
  "videoLessons": [
    {
      "id": 1,
      "title": "Lesson Title",
      "videoUrl": "https://youtube.com/embed/VIDEO_ID",
      "duration": "30 min"
    }
  ]
}
```

### Styling Customization
- Modify `styles.css` for custom themes
- Update color schemes in CSS variables
- Add custom animations and effects

## 🔧 Troubleshooting

### Common Issues
1. **Backend not starting**: Check Node.js version and dependencies
2. **CORS errors**: Ensure backend is running on correct port
3. **Video not loading**: Check YouTube URLs and embed settings
4. **Authentication issues**: Clear localStorage and try again

### Debug Mode
```bash
DEBUG=* npm start
```

## 📈 Performance Optimization

- **Lazy Loading**: Videos load only when needed
- **Caching**: API responses cached for better performance
- **Compression**: Gzip compression for static assets
- **CDN**: Use CDN for video content delivery

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configured for security
- **Input Validation**: Server-side validation

## 📱 Mobile Support

- **Responsive Design**: Works on all screen sizes
- **Touch Gestures**: Mobile-friendly interactions
- **Offline Support**: Basic offline functionality
- **PWA Ready**: Can be converted to Progressive Web App

## 🎓 Educational Features

- **Progress Tracking**: Detailed progress monitoring
- **Certificates**: Automatic certificate generation
- **Analytics**: Learning analytics and insights
- **Forums**: Community discussion features
- **Video Lessons**: Embedded video content

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide
