# Car Rental Website Backend

A robust Express.js backend API for a car rental website with MongoDB database integration.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Car Management**: CRUD operations for cars with advanced filtering
- **Booking System**: Complete booking lifecycle management
- **Admin Panel**: Administrative functions for managing users, cars, and bookings
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   ```

4. **Configure Environment Variables**
   Update the `.env` file with your settings:
   ```env
   MONGODB_URI=mongodb://localhost:27017/car_rental_db
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system

6. **Seed the Database (Optional)**
   ```bash
   node scripts/seedData.js
   ```

7. **Start the Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - User login
- `GET /profile` - Get current user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `GET /verify` - Verify JWT token (Protected)

### Car Routes (`/api/cars`)

- `GET /` - Get all cars with filtering and pagination
- `GET /:id` - Get single car by ID
- `POST /` - Create new car (Admin only)
- `PUT /:id` - Update car (Admin only)
- `DELETE /:id` - Delete car (Admin only)
- `GET /:id/availability` - Check car availability for dates
- `GET /meta/categories` - Get available car categories
- `GET /meta/locations` - Get available locations

### Booking Routes (`/api/bookings`)

- `GET /my-bookings` - Get user's bookings (Protected)
- `GET /all` - Get all bookings (Admin only)
- `GET /:id` - Get single booking (Protected)
- `POST /` - Create new booking (Protected)
- `PATCH /:id/status` - Update booking status (Admin only)
- `PATCH /:id/cancel` - Cancel booking (Protected)

### User Routes (`/api/users`)

- `GET /` - Get all users (Admin only)
- `GET /:id` - Get single user (Admin only)
- `PATCH /:id/role` - Update user role (Admin only)
- `PATCH /:id/verify` - Verify user account (Admin only)
- `DELETE /:id` - Delete user (Admin only)
- `GET /dashboard/stats` - Get user dashboard stats (Protected)

### Health Check

- `GET /api/health` - API health check

## Data Models

### User Model
- Personal information (name, email, phone, date of birth)
- Driver license information
- Address details
- Role-based access (customer/admin)
- Password hashing and validation

### Car Model
- Vehicle details (make, model, year, category)
- Technical specifications (transmission, fuel type, seats, doors)
- Pricing and availability
- Location and branch information
- Features and images
- Maintenance status

### Booking Model
- User and car references
- Booking dates and locations
- Pricing calculations
- Payment information
- Status tracking
- Driver information
- Cancellation handling

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if applicable)
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation using express-validator
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Expiration**: Configurable token expiration

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node scripts/seedData.js` - Seed database with sample data

### Default Admin Account

After running the seed script, you can login with:
- **Email**: admin@carrental.com
- **Password**: admin123

## Database Schema

The application uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `cars` - Vehicle inventory
- `bookings` - Rental bookings and transactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
