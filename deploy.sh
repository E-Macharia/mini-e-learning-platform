#!/bin/bash

# E-Learning Platform Deployment Script
# This script helps you deploy to Render (backend) and Vercel (frontend)

echo "🚀 E-Learning Platform Deployment Script"
echo "========================================"

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        echo "⚠️  Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    echo "✅ All requirements met!"
}

# Prepare backend for Render
prepare_backend() {
    echo "🔧 Preparing backend for Render deployment..."
    
    # Update package.json for production
    cat > package.json << EOF
{
  "name": "e-learning-platform",
  "version": "1.0.0",
  "description": "Advanced e-learning platform with backend integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "json-server": "^0.17.4",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF
    
    echo "✅ Backend prepared for Render!"
}

# Prepare frontend for Vercel
prepare_frontend() {
    echo "🎨 Preparing frontend for Vercel deployment..."
    
    # Create vercel.json
    cat > vercel.json << EOF
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
EOF
    
    # Update script.js to use production API
    if [ -f "script.js" ]; then
        sed -i 's|const API_BASE = .*|const API_BASE = "https://your-app.onrender.com/api";|g' script.js
    fi
    
    echo "✅ Frontend prepared for Vercel!"
}

# Deploy to Render
deploy_render() {
    echo "🌐 Deploying backend to Render..."
    echo ""
    echo "📝 Manual steps for Render deployment:"
    echo "1. Go to https://render.com"
    echo "2. Sign up with GitHub"
    echo "3. Click 'New Web Service'"
    echo "4. Connect your GitHub repository"
    echo "5. Configure:"
    echo "   - Name: e-learning-backend"
    echo "   - Environment: Node"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "   - Plan: Free"
    echo "6. Add Environment Variables:"
    echo "   - NODE_ENV=production"
    echo "   - JWT_SECRET=your-super-secret-jwt-key"
    echo "   - FRONTEND_URL=https://your-frontend.vercel.app"
    echo "7. Click 'Create Web Service'"
    echo ""
    echo "⏳ Wait for deployment to complete..."
    echo "📝 Note your backend URL (e.g., https://your-app.onrender.com)"
    echo ""
    read -p "Press Enter when Render deployment is complete..."
}

# Deploy to Vercel
deploy_vercel() {
    echo "🎨 Deploying frontend to Vercel..."
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        echo "🔐 Please login to Vercel:"
        vercel login
    fi
    
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo "✅ Frontend deployed to Vercel!"
    echo "📝 Note your frontend URL (e.g., https://your-app.vercel.app)"
}

# Update configuration
update_config() {
    echo "🔧 Updating configuration..."
    
    read -p "Enter your Render backend URL (e.g., https://your-app.onrender.com): " BACKEND_URL
    read -p "Enter your Vercel frontend URL (e.g., https://your-app.vercel.app): " FRONTEND_URL
    
    # Update script.js with actual backend URL
    if [ -f "script.js" ]; then
        sed -i "s|const API_BASE = .*|const API_BASE = '${BACKEND_URL}/api';|g" script.js
    fi
    
    echo "✅ Configuration updated!"
    echo "Backend URL: ${BACKEND_URL}"
    echo "Frontend URL: ${FRONTEND_URL}"
}

# Test deployment
test_deployment() {
    echo "🧪 Testing deployment..."
    
    read -p "Enter your frontend URL: " FRONTEND_URL
    
    echo "Testing frontend: ${FRONTEND_URL}"
    
    if curl -s "${FRONTEND_URL}" > /dev/null; then
        echo "✅ Frontend is accessible!"
    else
        echo "❌ Frontend is not accessible. Please check the URL."
    fi
    
    echo "🧪 Manual testing checklist:"
    echo "1. Open your frontend URL in browser"
    echo "2. Test user registration"
    echo "3. Test user login"
    echo "4. Test course browsing"
    echo "5. Test video lessons"
    echo "6. Test progress tracking"
    echo "7. Test certificate generation"
    echo "8. Test discussion forums"
    echo "9. Test analytics dashboard"
    echo "10. Test mobile responsiveness"
}

# Main deployment flow
main() {
    echo "🎯 Starting deployment process..."
    echo ""
    
    check_requirements
    prepare_backend
    prepare_frontend
    
    echo ""
    echo "🚀 Ready to deploy!"
    echo ""
    echo "Choose deployment option:"
    echo "1. Deploy to Render (Backend)"
    echo "2. Deploy to Vercel (Frontend)"
    echo "3. Update configuration"
    echo "4. Test deployment"
    echo "5. Full deployment (all steps)"
    echo ""
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_render
            ;;
        2)
            deploy_vercel
            ;;
        3)
            update_config
            ;;
        4)
            test_deployment
            ;;
        5)
            deploy_render
            deploy_vercel
            update_config
            test_deployment
            ;;
        *)
            echo "Invalid choice. Please run the script again."
            ;;
    esac
    
    echo ""
    echo "🎉 Deployment process completed!"
    echo "📚 Check DEPLOYMENT.md for detailed instructions."
}

# Run main function
main


