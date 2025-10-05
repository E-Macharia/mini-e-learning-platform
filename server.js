const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use(express.static('.'));

// Database files
const dbPath = './db.json';
let db = {};

// Initialize database
function initializeDB() {
    if (!fs.existsSync(dbPath)) {
        db = {
            users: [],
            courses: [],
            enrollments: [],
            progress: [],
            certificates: [],
            forums: [],
            posts: [],
            analytics: []
        };
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } else {
        db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
}

// Auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// User routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            role: 'student'
        };

        db.users.push(user);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
        
        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
        
        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Course routes
app.get('/api/courses', (req, res) => {
    res.json(db.courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = db.courses.find(c => c.id === req.params.id);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
});

// Enrollment routes
app.post('/api/enrollments', authenticateToken, (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.userId;

    const enrollment = {
        id: uuidv4(),
        userId,
        courseId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
    };

    db.enrollments.push(enrollment);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(enrollment);
});

// Progress routes
app.get('/api/progress/:userId', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    const userProgress = db.progress.filter(p => p.userId === userId);
    res.json(userProgress);
});

app.post('/api/progress', authenticateToken, (req, res) => {
    const { courseId, lessonId, completed } = req.body;
    const userId = req.user.userId;

    const existingProgress = db.progress.find(p => p.userId === userId && p.courseId === courseId);
    
    if (existingProgress) {
        existingProgress.lessonsCompleted = completed ? 
            [...new Set([...existingProgress.lessonsCompleted, lessonId])] :
            existingProgress.lessonsCompleted.filter(id => id !== lessonId);
        existingProgress.updatedAt = new Date().toISOString();
    } else {
        const progress = {
            id: uuidv4(),
            userId,
            courseId,
            lessonsCompleted: completed ? [lessonId] : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.progress.push(progress);
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({ success: true });
});

// Certificate routes
app.post('/api/certificates', authenticateToken, (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.userId;

    const certificate = {
        id: uuidv4(),
        userId,
        courseId,
        issuedAt: new Date().toISOString(),
        certificateUrl: `/certificates/${uuidv4()}.pdf`
    };

    db.certificates.push(certificate);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(certificate);
});

// Forum routes
app.get('/api/forums/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const courseForums = db.forums.filter(f => f.courseId === courseId);
    res.json(courseForums);
});

app.post('/api/forums', authenticateToken, (req, res) => {
    const { courseId, title, description } = req.body;
    const userId = req.user.userId;

    const forum = {
        id: uuidv4(),
        courseId,
        title,
        description,
        createdBy: userId,
        createdAt: new Date().toISOString()
    };

    db.forums.push(forum);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(forum);
});

// Post routes
app.get('/api/posts/:forumId', (req, res) => {
    const forumId = req.params.forumId;
    const posts = db.posts.filter(p => p.forumId === forumId);
    res.json(posts);
});

app.post('/api/posts', authenticateToken, (req, res) => {
    const { forumId, content } = req.body;
    const userId = req.user.userId;

    const post = {
        id: uuidv4(),
        forumId,
        content,
        authorId: userId,
        createdAt: new Date().toISOString()
    };

    db.posts.push(post);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(post);
});

// Analytics routes
app.get('/api/analytics/:userId', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    const userProgress = db.progress.filter(p => p.userId === userId);
    const userEnrollments = db.enrollments.filter(e => e.userId === userId);
    const userCertificates = db.certificates.filter(c => c.userId === userId);

    const analytics = {
        totalCourses: userEnrollments.length,
        completedCourses: userCertificates.length,
        totalLessons: userProgress.reduce((acc, p) => acc + p.lessonsCompleted.length, 0),
        certificates: userCertificates.length,
        progress: userProgress
    };

    res.json(analytics);
});

// Initialize database and start server
initializeDB();
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints available at /api/*');
});
