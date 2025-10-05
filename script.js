// Enhanced E-Learning Platform with Backend Integration
const API_BASE = 'https://mini-e-learning-platform.onrender.com/api';
let currentUser = null;
let currentCourse = null;
let currentLesson = null;

// Sample course data (fallback if backend is not available)
const courses = [
    {
        id: 1,
        title: "Web Development Fundamentals",
        description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites. Perfect for beginners who want to start their journey in web development.",
        duration: "8 weeks",
        level: "Beginner",
        lessons: 24,
        icon: "🌐",
        lessons: [
            { id: 1, title: "Introduction to HTML", duration: "45 min", completed: false },
            { id: 2, title: "CSS Styling Basics", duration: "60 min", completed: false },
            { id: 3, title: "JavaScript Fundamentals", duration: "90 min", completed: false },
            { id: 4, title: "Responsive Design", duration: "75 min", completed: false },
            { id: 5, title: "DOM Manipulation", duration: "80 min", completed: false },
            { id: 6, title: "Project: Personal Portfolio", duration: "120 min", completed: false }
        ]
    },
    {
        id: 2,
        title: "Python Programming",
        description: "Master Python programming from basics to advanced concepts. Learn data structures, algorithms, and build real-world projects.",
        duration: "12 weeks",
        level: "Intermediate",
        lessons: 36,
        icon: "🐍",
        lessons: [
            { id: 1, title: "Python Basics", duration: "50 min", completed: false },
            { id: 2, title: "Data Types and Variables", duration: "60 min", completed: false },
            { id: 3, title: "Control Structures", duration: "70 min", completed: false },
            { id: 4, title: "Functions and Modules", duration: "85 min", completed: false },
            { id: 5, title: "Object-Oriented Programming", duration: "100 min", completed: false },
            { id: 6, title: "File Handling", duration: "65 min", completed: false },
            { id: 7, title: "Error Handling", duration: "55 min", completed: false },
            { id: 8, title: "Project: To-Do App", duration: "150 min", completed: false }
        ]
    },
    {
        id: 3,
        title: "Data Science with R",
        description: "Explore data analysis, visualization, and statistical modeling using R. Perfect for aspiring data scientists.",
        duration: "10 weeks",
        level: "Advanced",
        lessons: 30,
        icon: "📊",
        lessons: [
            { id: 1, title: "R Basics and Environment", duration: "55 min", completed: false },
            { id: 2, title: "Data Import and Export", duration: "65 min", completed: false },
            { id: 3, title: "Data Manipulation with dplyr", duration: "90 min", completed: false },
            { id: 4, title: "Data Visualization with ggplot2", duration: "95 min", completed: false },
            { id: 5, title: "Statistical Analysis", duration: "110 min", completed: false },
            { id: 6, title: "Machine Learning Basics", duration: "120 min", completed: false },
            { id: 7, title: "Project: Sales Analysis", duration: "180 min", completed: false }
        ]
    }
];

// User data
let currentUser = null;
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the course detail page
    if (window.location.pathname.includes('course-detail.html')) {
        loadCourseDetail();
    } else {
        loadCourses();
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Modal controls
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => showModal('loginModal'));
    }
    if (signupBtn) {
        signupBtn.addEventListener('click', () => showModal('signupModal'));
    }

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Load courses on main page
function loadCourses() {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    container.innerHTML = courses.map(course => {
        const progress = getCourseProgress(course.id);
        const completedLessons = progress.completedLessons || 0;
        const totalLessons = course.lessons.length;
        const progressPercentage = (completedLessons / totalLessons) * 100;

        return `
            <div class="course-card" onclick="viewCourse(${course.id})">
                <div class="course-image">
                    ${course.icon}
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <span class="course-duration">${course.duration}</span>
                        <span class="course-level">${course.level}</span>
                    </div>
                    <div class="course-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="progress-text">${completedLessons}/${totalLessons} lessons completed</div>
                    </div>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); markCourseComplete(${course.id})">
                        ${progress.isCompleted ? 'Completed ✓' : 'Mark as Complete'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Load course detail page
function loadCourseDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        document.getElementById('courseDetail').innerHTML = '<h2>Course not found</h2>';
        return;
    }

    const progress = getCourseProgress(courseId);
    const completedLessons = progress.completedLessons || 0;
    const totalLessons = course.lessons.length;
    const progressPercentage = (completedLessons / totalLessons) * 100;

    document.getElementById('courseDetail').innerHTML = `
        <div class="course-header">
            <div class="course-header-image">
                ${course.icon}
            </div>
            <div class="course-header-content">
                <h1>${course.title}</h1>
                <p>${course.description}</p>
                <div class="course-stats">
                    <div class="stat">
                        <div class="stat-number">${course.duration}</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${totalLessons}</div>
                        <div class="stat-label">Lessons</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${course.level}</div>
                        <div class="stat-label">Level</div>
                    </div>
                </div>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="progress-text">${completedLessons}/${totalLessons} lessons completed (${Math.round(progressPercentage)}%)</div>
                </div>
                <button class="btn btn-success" onclick="markCourseComplete(${course.id})">
                    ${progress.isCompleted ? 'Course Completed ✓' : 'Mark Course as Complete'}
                </button>
            </div>
        </div>
        
        <div class="lessons-section">
            <h3>Course Lessons</h3>
            <ul class="lesson-list">
                ${course.lessons.map(lesson => {
                    const isCompleted = progress.completedLessons && progress.completedLessons >= lesson.id;
                    return `
                        <li class="lesson-item ${isCompleted ? 'completed' : ''}">
                            <div class="lesson-icon ${isCompleted ? 'completed' : 'pending'}">
                                ${isCompleted ? '✓' : lesson.id}
                            </div>
                            <div class="lesson-content">
                                <div class="lesson-title">${lesson.title}</div>
                                <div class="lesson-duration">${lesson.duration}</div>
                            </div>
                        </li>
                    `;
                }).join('')}
            </ul>
        </div>
    `;
}

// View course details
function viewCourse(courseId) {
    window.location.href = `course-detail.html?id=${courseId}`;
}

// Mark course as complete
function markCourseComplete(courseId) {
    if (!userProgress[courseId]) {
        userProgress[courseId] = { completedLessons: 0, isCompleted: false };
    }
    
    userProgress[courseId].isCompleted = true;
    userProgress[courseId].completedLessons = courses.find(c => c.id === courseId).lessons.length;
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    
    // Show success message
    showNotification('Course marked as completed! 🎉', 'success');
    
    // Reload the current view
    if (window.location.pathname.includes('course-detail.html')) {
        loadCourseDetail();
    } else {
        loadCourses();
    }
}

// Get course progress
function getCourseProgress(courseId) {
    return userProgress[courseId] || { completedLessons: 0, isCompleted: false };
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (email && password) {
        currentUser = { email, name: email.split('@')[0] };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        document.getElementById('loginModal').style.display = 'none';
        showNotification('Login successful! Welcome back!', 'success');
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simple validation
    if (name && email && password) {
        currentUser = { email, name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        document.getElementById('signupModal').style.display = 'none';
        showNotification('Account created successfully! Welcome to E-Learn!', 'success');
    }
}

// Update user interface
function updateUserInterface() {
    const nav = document.querySelector('.nav');
    if (currentUser) {
        nav.innerHTML = `
            <div class="user-status">
                <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                <span class="user-name">${currentUser.name}</span>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        `;
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check for existing user on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
});
