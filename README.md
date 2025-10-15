<div align="center">

<img src="assets/icons/logo.png" alt="Rent My Ride - Car Rental Platform" width="350" height="auto" style="margin: 30px 0; border-radius: 15px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); transform: scale(1.05);" />

# **Rent My Ride** - Premium Car Rental Platform

<p style="font-size: 1.2em; color: #6B7280; margin: 10px 0 30px 0;">
  <em>Drive Your Dreams, Rent with Confidence</em>
</p>

</div> 

<div align="center">

> **A modern, full-stack car rental platform built with React, Express.js, and MongoDB.**  
> **Features real-time availability, automated workflows, and comprehensive admin dashboard.**

</div>

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

<br/>

<p style="font-size: 0.9em; color: #9CA3AF; margin-top: 20px;">
  <img src="assets/icons/star.png" alt="Star" width="16" height="16" style="vertical-align:-2px; margin-right:4px" /> <strong>Star this repository if you found it helpful!</strong> <img src="assets/icons/star.png" alt="Star" width="16" height="16" style="vertical-align:-2px; margin-left:4px" />
</p>

</div>

---

## Table of Contents

- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [🚀 Quick Start](#-quick-start)
- [📱 Screenshots](#-screenshots)
- [🔧 Advanced Features](#-advanced-features)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## <img src="assets/icons/key-feature.png" alt="Key Features" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Key Features

### <img src="assets/icons/target.png" alt="Target" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> **User Experience**
- **Real-time Car Availability** - Live availability checking prevents booking conflicts
- **Smart Booking System** - Multi-step booking with date validation and location filtering
- **Bilingual Support** - Full English/French internationalization (i18n)
- **Interactive Maps** - Leaflet integration for office location selection
- **PDF Receipt Generation** - Automated booking confirmations with professional styling

### <img src="assets/icons/security.png" alt="Security" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> **Authentication & Security**
- **JWT-based Authentication** - Secure token-based user sessions
- **Role-based Access Control** - Admin/User permission system
- **Password Encryption** - bcryptjs hashing for secure password storage
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive server-side validation

### <img src="assets/icons/dashboard.png" alt="Dashboard" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> **Admin Dashboard**
- **Comprehensive Analytics** - Revenue, bookings, users, and fleet analytics
- **Real-time Charts** - Interactive data visualization with Recharts
- **Fleet Management** - Complete CRUD operations for vehicle inventory
- **Booking Management** - Status tracking with automated workflows
- **User Management** - Customer account administration
- **Performance Metrics** - Business intelligence and reporting

### <img src="assets/icons/rocket.png" alt="Rocket" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> **Advanced Functionality**
- **Automatic Status Management** - Cron-based booking lifecycle automation
- **Dynamic Pricing** - Flexible pricing with options and extras
- **Location-based Filtering** - Cars filtered by office availability
- **Time Slot Validation** - Operating hours and buffer time enforcement
- **Image Gallery** - Multi-image car showcases with zoom functionality
- **Search & Filtering** - Advanced car search with multiple criteria

---

## <img src="assets/icons/tech-stack.png" alt="Tech Stack" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Tech Stack

### **Frontend**
```javascript
React 18.2.0          // Modern React with Hooks & Context API
Vite 6.2.0            // Lightning-fast build tool
Tailwind CSS 4.0.9    // Utility-first CSS framework
React Router 6.22.1   // Client-side routing
Framer Motion 12.23   // Smooth animations
Recharts 3.2.1        // Data visualization
Leaflet Maps          // Interactive mapping
React Select 5.10.1   // Enhanced dropdowns
React Toastify 11.0   // Toast notifications
```

### **Backend**
```javascript
Node.js + Express 4.18.2  // RESTful API server
MongoDB + Mongoose 8.0.3   // NoSQL database with ODM
JWT 9.0.2                  // Authentication tokens
bcryptjs 2.4.3            // Password hashing
Node-cron 4.2.1           // Scheduled tasks
Multer 1.4.5              // File upload handling
Express Validator 7.0.1    // Input validation
Helmet 7.1.0              // Security headers
```

### **Development & Deployment**
```javascript
ESLint 9.21.0         // Code linting
Nodemon 3.0.2         // Development server
Git + GitHub          // Version control
Docker + Compose      // Containerization & orchestration
Nginx                 // Production web server
```

---

## <img src="assets/icons/architecture.png" alt="Architecture" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Architecture

### **Project Structure**
```
Car_Rental_Website/
├── 📁 frontend/                 # React application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── 📁 Admin/        # Admin dashboard components
│   │   │   ├── 📁 Booking/      # Booking flow components
│   │   │   ├── 📁 Charts/       # Data visualization
│   │   │   └── 📁 UI/           # Common UI elements
│   │   ├── 📁 pages/            # Route components
│   │   ├── 📁 context/          # React Context providers
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   ├── 📁 utils/            # Helper functions
│   │   └── 📁 translations/     # i18n language files
│   └── 📄 package.json
├── 📁 backend/                  # Express.js API
│   ├── 📁 models/               # MongoDB schemas
│   ├── 📁 routes/               # API endpoints
│   ├── 📁 middleware/           # Custom middleware
│   ├── 📁 services/             # Business logic
│   ├── 📁 utils/                # Helper utilities
│   └── 📄 server.js
└── 📄 README.md
```

## <img src="assets/icons/quick-start.png" alt="Quick Start" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Quick Start

### **Prerequisites**
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Car_Rental_Website.git
cd Car_Rental_Website
```

2. **Install all dependencies**
```bash
npm run install:all  # Installs root, backend, and frontend dependencies
```

3. **Configure Environment Variables**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev  # Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev  # Runs on http://localhost:5173
```

5. **Database Seeding** (Optional)
```bash
cd backend
npm run seed:users   # Create sample users
```

> **⚠️ SECURITY NOTE**: Never commit `.env` files!

---

### **🐳 Docker Deployment** (Recommended)

For production deployment or simplified setup, use Docker:

**Quick Start with Docker:**
```bash
# 1. Copy environment configuration
cp .env.docker.example .env.docker

# 2. Edit .env.docker with your settings (IMPORTANT: Change JWT_SECRET and passwords!)

# 3. Start all services
docker-compose --env-file .env.docker up -d

# Access the application:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000/api
# - Mongo Express: http://localhost:8081 (dev mode)
```

**Development Mode:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.docker up
```

**Common Docker Commands:**
```bash
docker-compose --env-file .env.docker ps              # Show running services
docker-compose --env-file .env.docker logs -f         # View logs
docker-compose --env-file .env.docker down            # Stop all services
docker-compose --env-file .env.docker restart         # Restart services
docker-compose --env-file .env.docker down -v         # Stop and remove volumes
```

**Benefits of Docker Deployment:**
- ✅ Consistent environment across all machines
- ✅ No manual MongoDB installation required
- ✅ Isolated services with proper networking
- ✅ Easy scaling and deployment
- ✅ Production-ready configuration
- ✅ Automated health checks

---

## <img src="assets/icons/screenshot.png" alt="Screenshots" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Screenshots

---

## <img src="assets/icons/feature.png" alt="Advanced Features" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Advanced Features

### **<img src="assets/icons/robot.png" alt="Robot" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> Automated Booking Management**
```javascript
// Automatic status transitions
pending → confirmed (admin approval)
confirmed → active (pickup date arrives)
active → completed (return date passes)
```

### **<img src="assets/icons/globe.png" alt="Globe" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> Real-time Availability System**
- Live car availability checking
- Booking conflict prevention
- Location-based inventory management
- Operating hours validation

### **<img src="assets/icons/chart.png" alt="Chart" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> Business Intelligence**
- Revenue analytics with trend analysis
- Fleet utilization metrics
- Customer engagement tracking
- Performance reporting

### **<img src="assets/icons/lock.png" alt="Lock" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> Security Features**
- JWT token authentication
- Password encryption (bcryptjs)
- Rate limiting protection
- Input sanitization
- CORS configuration

### **<img src="assets/icons/international.png" alt="International" width="24" height="24" style="vertical-align:-4px; margin-right:8px" /> Internationalization**
- English/French language support
- Dynamic content translation
- Localized date/time formatting
- Currency formatting

## <img src="assets/icons/deployment.png" alt="Deployment" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Deployment

### **Frontend Deployment** (Netlify/Vercel)
```bash
npm run build        # Create production build
npm run preview      # Preview production build
```

### **Backend Deployment** (Heroku/DigitalOcean)
```bash
npm start           # Production server
```

### **Environment Setup**
- Configure MongoDB Atlas for production
- Set up JWT secrets and API keys
- Configure CORS for production domains
- Set up automated backups

---

## <img src="assets/icons/contibution.png" alt="Contributing" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## <img src="assets/icons/contact.png" alt="Contact" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Contact

**Please Contact me on my Professional Gmail** - walid.houssaf.dev@gmail.com

**Project Link**: [https://github.com/WalidHoussaf/Car_Rental_Website](https://github.com/WalidHoussaf/Car_Rental_Website)

---

## <img src="assets/icons/licence.png" alt="License" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## <img src="assets/icons/acknowledgments.png" alt="Acknowledgments" width="28" height="28" style="vertical-align:-5px; margin-right:8px" /> Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first approach
- All open-source contributors who made this project possible
- GitHub for the version control
- Attribution for the icons, videos and images used in the project that are not created by me
---

<div align="center">

Designed and developed by Walid Houssaf . <img src="assets/icons/dragon.png" alt="Dragon" width="24" height="24" style="vertical-align:-4px; margin-left:8px" />

</div>
