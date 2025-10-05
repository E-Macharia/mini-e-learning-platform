// Production E-Learning Platform with Render Backend Integration
const API_BASE = process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com/api';
let currentUser = null;
let currentCourse = null;
let currentLesson = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    if (window.location.pathname.includes('course-detail.html')) {
        loadCourseDetail();
    } else {
        loadCourses();
    }
    
    setupEventListeners();
});

// Check authentication status
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const user = await response.json();
                currentUser = user;
                updateUserInterface();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Modal controls
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const newPostForm = document.getElementById('newPostForm');

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
    if (newPostForm) {
        newPostForm.addEventListener('submit', handleNewPost);
    }

    // Video lesson controls
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    const newPostBtn = document.getElementById('newPostBtn');

    if (markCompleteBtn) {
        markCompleteBtn.addEventListener('click', markLessonComplete);
    }
    if (nextLessonBtn) {
        nextLessonBtn.addEventListener('click', nextLesson);
    }
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => showModal('newPostModal'));
    }
}

// Load courses from backend
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`);
        const courses = await response.json();
        
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        container.innerHTML = courses.map(course => {
            const progress = getCourseProgress(course.id);
            const completedLessons = progress.lessonsCompleted ? progress.lessonsCompleted.length : 0;
            const totalLessons = course.videoLessons.length;
            const progressPercentage = (completedLessons / totalLessons) * 100;

            return `
                <div class="course-card" onclick="viewCourse('${course.id}')">
                    <div class="course-image">
                        ${course.icon}
                    </div>
                    <div class="course-content">
                        <div class="course-instructor">Instructor: ${course.instructor}</div>
                        <h3 class="course-title">${course.title}</h3>
                        <p class="course-description">${course.description}</p>
                        <div class="course-rating">
                            <div class="stars">${'★'.repeat(Math.floor(course.rating))}${'☆'.repeat(5-Math.floor(course.rating))}</div>
                            <span class="rating-text">${course.rating} (${course.students} students)</span>
                        </div>
                        <div class="course-meta">
                            <span class="course-duration">${course.duration}</span>
                            <span class="course-level">${course.level}</span>
                        </div>
                        <div class="course-price ${course.price === 0 ? 'free' : 'paid'}">
                            ${course.price === 0 ? 'FREE' : `$${course.price}`}
                        </div>
                        <div class="course-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                            </div>
                            <div class="progress-text">${completedLessons}/${totalLessons} lessons completed</div>
                        </div>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); enrollInCourse('${course.id}')">
                            ${progress.isCompleted ? 'Completed ✓' : 'Enroll Now'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load courses:', error);
        showNotification('Failed to load courses. Please try again.', 'error');
    }
}

// Load course detail page
async function loadCourseDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    try {
        const response = await fetch(`${API_BASE}/courses/${courseId}`);
        const course = await response.json();
        
        currentCourse = course;
        
        const progress = getCourseProgress(courseId);
        const completedLessons = progress.lessonsCompleted ? progress.lessonsCompleted.length : 0;
        const totalLessons = course.videoLessons.length;
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
                        <div class="stat">
                            <div class="stat-number">${course.instructor}</div>
                            <div class="stat-label">Instructor</div>
                        </div>
                    </div>
                    <div class="course-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="progress-text">${completedLessons}/${totalLessons} lessons completed (${Math.round(progressPercentage)}%)</div>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-success" onclick="markCourseComplete('${course.id}')">
                            ${progress.isCompleted ? 'Course Completed ✓' : 'Mark Course as Complete'}
                        </button>
                        <button class="btn btn-primary" onclick="showForum()">Discussion Forum</button>
                    </div>
                </div>
            </div>
            
            <div class="lessons-section">
                <h3>Video Lessons</h3>
                <div class="video-lessons-list">
                    ${course.videoLessons.map((lesson, index) => {
                        const isCompleted = progress.lessonsCompleted && progress.lessonsCompleted.includes(lesson.id);
                        return `
                            <div class="video-lesson ${isCompleted ? 'completed' : ''}" onclick="playVideo(${lesson.id})">
                                <div class="video-lesson-icon ${isCompleted ? 'completed' : ''}">
                                    ${isCompleted ? '✓' : index + 1}
                                </div>
                                <div class="video-lesson-content">
                                    <div class="video-lesson-title">${lesson.title}</div>
                                    <div class="video-lesson-duration">${lesson.duration}</div>
                                </div>
                                <div class="video-lesson-play">▶</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // Load forum if it exists
        loadForum(courseId);
    } catch (error) {
        console.error('Failed to load course:', error);
        document.getElementById('courseDetail').innerHTML = '<h2>Course not found</h2>';
    }
}

// Play video lesson
async function playVideo(lessonId) {
    if (!currentCourse) return;
    
    const lesson = currentCourse.videoLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    currentLesson = lesson;
    
    // Show video section
    document.getElementById('videoSection').style.display = 'block';
    document.getElementById('forumSection').style.display = 'none';
    
    // Load video
    document.getElementById('videoPlayer').src = lesson.videoUrl;
    document.getElementById('videoTitle').textContent = lesson.title;
    document.getElementById('videoDescription').textContent = lesson.description;
    
    // Update lesson completion status
    const progress = getCourseProgress(currentCourse.id);
    const isCompleted = progress.lessonsCompleted && progress.lessonsCompleted.includes(lessonId);
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    
    if (isCompleted) {
        markCompleteBtn.textContent = 'Completed ✓';
        markCompleteBtn.disabled = true;
    } else {
        markCompleteBtn.textContent = 'Mark as Complete';
        markCompleteBtn.disabled = false;
    }
}

// Mark lesson as complete
async function markLessonComplete() {
    if (!currentUser || !currentCourse || !currentLesson) return;
    
    try {
        const response = await fetch(`${API_BASE}/progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                courseId: currentCourse.id,
                lessonId: currentLesson.id,
                completed: true
            })
        });
        
        if (response.ok) {
            showNotification('Lesson marked as complete! 🎉', 'success');
            loadCourseDetail(); // Refresh the course detail
        }
    } catch (error) {
        console.error('Failed to mark lesson complete:', error);
        showNotification('Failed to mark lesson complete. Please try again.', 'error');
    }
}

// Next lesson
function nextLesson() {
    if (!currentCourse || !currentLesson) return;
    
    const currentIndex = currentCourse.videoLessons.findIndex(l => l.id === currentLesson.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < currentCourse.videoLessons.length) {
        const nextLesson = currentCourse.videoLessons[nextIndex];
        playVideo(nextLesson.id);
    } else {
        showNotification('You have completed all lessons! 🎉', 'success');
    }
}

// Show forum
function showForum() {
    document.getElementById('videoSection').style.display = 'none';
    document.getElementById('forumSection').style.display = 'block';
}

// Load forum
async function loadForum(courseId) {
    try {
        const response = await fetch(`${API_BASE}/forums/${courseId}`);
        const forums = await response.json();
        
        const forumContent = document.getElementById('forumContent');
        if (!forumContent) return;
        
        if (forums.length === 0) {
            forumContent.innerHTML = '<p>No discussions yet. Be the first to start a conversation!</p>';
            return;
        }
        
        forumContent.innerHTML = forums.map(forum => `
            <div class="forum-post">
                <div class="post-header">
                    <span class="post-author">${forum.title}</span>
                    <span class="post-date">${new Date(forum.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="post-content">${forum.description}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load forum:', error);
    }
}

// Handle new post
async function handleNewPost(e) {
    e.preventDefault();
    if (!currentUser || !currentCourse) return;
    
    const content = document.getElementById('postContent').value;
    
    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                forumId: currentCourse.id,
                content: content
            })
        });
        
        if (response.ok) {
            showNotification('Post created successfully!', 'success');
            document.getElementById('newPostModal').style.display = 'none';
            document.getElementById('postContent').value = '';
            loadForum(currentCourse.id);
        }
    } catch (error) {
        console.error('Failed to create post:', error);
        showNotification('Failed to create post. Please try again.', 'error');
    }
}

// Enroll in course
async function enrollInCourse(courseId) {
    if (!currentUser) {
        showNotification('Please login to enroll in courses', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ courseId })
        });
        
        if (response.ok) {
            showNotification('Successfully enrolled in course!', 'success');
            loadCourses();
        }
    } catch (error) {
        console.error('Failed to enroll:', error);
        showNotification('Failed to enroll in course. Please try again.', 'error');
    }
}

// Mark course as complete
async function markCourseComplete(courseId) {
    if (!currentUser) {
        showNotification('Please login to mark courses complete', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/certificates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ courseId })
        });
        
        if (response.ok) {
            const certificate = await response.json();
            showNotification('Course completed! Certificate generated! 🎉', 'success');
            showCertificate(certificate);
            loadCourses();
        }
    } catch (error) {
        console.error('Failed to mark course complete:', error);
        showNotification('Failed to mark course complete. Please try again.', 'error');
    }
}

// Show certificate
function showCertificate(certificate) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content certificate-modal">
            <span class="close">&times;</span>
            <h3>🎉 Congratulations! You've earned a certificate!</h3>
            <div class="certificate-preview">
                <div class="certificate-border">
                    <div class="certificate-header">Certificate of Completion</div>
                    <div class="certificate-title">${currentCourse.title}</div>
                    <div class="certificate-student">Awarded to: ${currentUser.name}</div>
                    <div class="certificate-course">Course: ${currentCourse.title}</div>
                    <div class="certificate-date">Date: ${new Date(certificate.issuedAt).toLocaleDateString()}</div>
                </div>
            </div>
            <button class="btn btn-primary" onclick="downloadCertificate('${certificate.id}')">Download Certificate</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Download certificate
function downloadCertificate(certificateId) {
    // In a real application, this would generate and download a PDF
    showNotification('Certificate download started! (Demo)', 'success');
}

// Show analytics
async function showAnalytics() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/analytics/${currentUser.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.ok) {
            const analytics = await response.json();
            displayAnalytics(analytics);
            showModal('analyticsModal');
        }
    } catch (error) {
        console.error('Failed to load analytics:', error);
        showNotification('Failed to load analytics. Please try again.', 'error');
    }
}

// Display analytics
function displayAnalytics(analytics) {
    const content = document.getElementById('analyticsContent');
    if (!content) return;
    
    content.innerHTML = `
        <div class="analytics-grid">
            <div class="analytics-card">
                <div class="analytics-number">${analytics.totalCourses}</div>
                <div class="analytics-label">Courses Enrolled</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-number">${analytics.completedCourses}</div>
                <div class="analytics-label">Courses Completed</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-number">${analytics.totalLessons}</div>
                <div class="analytics-label">Lessons Completed</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-number">${analytics.certificates}</div>
                <div class="analytics-label">Certificates Earned</div>
            </div>
        </div>
        
        <div class="certificate-section">
            <div class="certificate-icon">🏆</div>
            <div class="certificate-title">Learning Achievement</div>
            <div class="certificate-description">
                You've completed ${analytics.completedCourses} courses and earned ${analytics.certificates} certificates!
            </div>
        </div>
        
        <div class="progress-chart">
            <div class="chart-title">Course Progress</div>
            ${analytics.progress.map(p => {
                const course = courses.find(c => c.id === p.courseId);
                const percentage = (p.lessonsCompleted.length / (course?.videoLessons?.length || 1)) * 100;
                return `
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>${course?.title || 'Unknown Course'}</span>
                            <span>${Math.round(percentage)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// View course details
function viewCourse(courseId) {
    window.location.href = `course-detail.html?id=${courseId}`;
}

// Get course progress
function getCourseProgress(courseId) {
    // This would normally fetch from the backend
    const progress = JSON.parse(localStorage.getItem('userProgress')) || {};
    return progress[courseId] || { lessonsCompleted: [], isCompleted: false };
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            updateUserInterface();
            document.getElementById('loginModal').style.display = 'none';
            showNotification('Login successful! Welcome back!', 'success');
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Login failed:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            updateUserInterface();
            document.getElementById('signupModal').style.display = 'none';
            showNotification('Account created successfully! Welcome to E-Learn!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Signup failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Signup failed:', error);
        showNotification('Signup failed. Please try again.', 'error');
    }
}

// Update user interface
function updateUserInterface() {
    const userStatus = document.getElementById('userStatus');
    const authButtons = document.getElementById('authButtons');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        if (userStatus) userStatus.style.display = 'flex';
        if (authButtons) authButtons.style.display = 'none';
        if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        if (userName) userName.textContent = currentUser.name;
    } else {
        if (userStatus) userStatus.style.display = 'none';
        if (authButtons) authButtons.style.display = 'flex';
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('token');
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
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
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

