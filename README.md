# <img src="assets/icons/car.svg" alt="Car" width="28" height="28" style="vertical-align:-4px; margin-right:6px" /> Premium Car Rental Website

> A full-stack, production-ready car rental platform built with modern web technologies, featuring real-time availability, comprehensive admin dashboard, and seamless user experience.

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

</div>

## <img src="assets/icons/demo.svg" alt="Live Demo" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Live Demo

🔗 **[View Live Demo](https://your-demo-link.com)**

---

## <img src="assets/icons/toc.svg" alt="Table of Contents" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Table of Contents

- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [🚀 Quick Start](#-quick-start)
- [📱 Screenshots](#-screenshots)
- [🔧 Advanced Features](#-advanced-features)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## <img src="assets/icons/features.svg" alt="Key Features" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Key Features

### 🎯 **User Experience**
- **Real-time Car Availability** - Live availability checking prevents booking conflicts
- **Smart Booking System** - Multi-step booking with date validation and location filtering
- **Bilingual Support** - Full English/French internationalization (i18n)
- **Interactive Maps** - Leaflet integration for office location selection
- **PDF Receipt Generation** - Automated booking confirmations with professional styling

### 🔐 **Authentication & Security**
- **JWT-based Authentication** - Secure token-based user sessions
- **Role-based Access Control** - Admin/User permission system
- **Password Encryption** - bcryptjs hashing for secure password storage
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive server-side validation

### 📊 **Admin Dashboard**
- **Comprehensive Analytics** - Revenue, bookings, users, and fleet analytics
- **Real-time Charts** - Interactive data visualization with Recharts
- **Fleet Management** - Complete CRUD operations for vehicle inventory
- **Booking Management** - Status tracking with automated workflows
- **User Management** - Customer account administration
- **Performance Metrics** - Business intelligence and reporting

### 🚀 **Advanced Functionality**
- **Automatic Status Management** - Cron-based booking lifecycle automation
- **Dynamic Pricing** - Flexible pricing with options and extras
- **Location-based Filtering** - Cars filtered by office availability
- **Time Slot Validation** - Operating hours and buffer time enforcement
- **Image Gallery** - Multi-image car showcases with zoom functionality
- **Search & Filtering** - Advanced car search with multiple criteria

---

## <img src="assets/icons/stack.svg" alt="Tech Stack" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Tech Stack

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

### **Development Tools**
```javascript
ESLint 9.21.0         // Code linting
Nodemon 3.0.2         // Development server
Git + GitHub          // Version control
```

---

## <img src="assets/icons/architecture.svg" alt="Architecture" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Architecture

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

## <img src="assets/icons/quickstart.svg" alt="Quick Start" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Quick Start

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

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev           # Start development server on port 5000
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev          # Start Vite dev server on port 3000
```

4. **Environment Variables**
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/car_rental
JWT_SECRET=your_super_secure_jwt_secret
PORT=5000
NODE_ENV=development
```

5. **Database Seeding** (Optional)
```bash
cd backend
npm run seed         # Populate with sample data
```

---

## <img src="assets/icons/screenshots.svg" alt="Screenshots" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Screenshots

### **🏠 Homepage - Modern Hero Design**
![Homepage](screenshots/homepage.png)
*Responsive hero section with featured cars and smooth animations*

### **🚗 Car Catalog - Smart Filtering**
![Car Catalog](screenshots/cars-page.png)
*Real-time availability checking with advanced search filters*

### **📅 Booking Flow - Intuitive Process**
![Booking Process](screenshots/booking-flow.png)
*Multi-step booking with date validation and location selection*

### **📊 Admin Dashboard - Comprehensive Analytics**
![Admin Dashboard](screenshots/admin-dashboard.png)
*Real-time business metrics with interactive charts*

### **📱 Mobile Experience - Fully Responsive**
![Mobile Views](screenshots/mobile-responsive.png)
*Optimized mobile interface across all devices*

---

## <img src="assets/icons/advanced.svg" alt="Advanced Features" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Advanced Features

### **🤖 Automated Booking Management**
```javascript
// Automatic status transitions
pending → confirmed (admin approval)
confirmed → active (pickup date arrives)
active → completed (return date passes)
```

### **🌍 Real-time Availability System**
- Live car availability checking
- Booking conflict prevention
- Location-based inventory management
- Operating hours validation

### **📈 Business Intelligence**
- Revenue analytics with trend analysis
- Fleet utilization metrics
- Customer engagement tracking
- Performance reporting

### **🔒 Security Features**
- JWT token authentication
- Password encryption (bcryptjs)
- Rate limiting protection
- Input sanitization
- CORS configuration

### **🌐 Internationalization**
- English/French language support
- Dynamic content translation
- Localized date/time formatting
- Currency formatting

## <img src="assets/icons/deployment.svg" alt="Deployment" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Deployment

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

## <img src="assets/icons/contributing.svg" alt="Contributing" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## <img src="assets/icons/contact.svg" alt="Contact" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Contact

**My Name** - [@WalidHoussafX] - walid.houssaf.dev@gmail.com

**Project Link**: [https://github.com/WalidHoussaf/Car_Rental_Website](https://github.com/WalidHoussaf/Car_Rental_Website)

---

## <img src="assets/icons/license.svg" alt="License" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## <img src="assets/icons/thanks.svg" alt="Acknowledgments" width="22" height="22" style="vertical-align:-4px; margin-right:6px" /> Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first approach
- All open-source contributors who made this project possible
- GitHub for the version control
- Attribution for the icons and images used in the project that are not created by me
---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by Walid Houssaf.

</div>
