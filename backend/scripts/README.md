# Database Seeding Scripts

This directory contains scripts to populate the database with sample data for development and testing.

## Available Scripts

### 1. Seed Users (`seed-users.js`)
Creates sample user accounts including admin and customer users.

**Run:**
```bash
npm run seed:users
```

**Creates:**
- 1 Admin user (walid.houssaf@gmail.com / Admin123!@#)
- 3 Sample customer users (john.doe@example.com, jane.smith@example.com, ahmed.hassan@example.com)
- All with password: Customer123!

### 2. Seed Cars (`seed-cars.js`)
Creates a diverse fleet of 15 sample cars across all categories.

**Run:**
```bash
npm run seed:cars
```

**Creates:**
- **Economy** (2): Toyota Corolla, Hyundai Elantra
- **Compact** (1): Honda Civic
- **Midsize** (2): Toyota Camry, Honda Accord
- **SUV** (3): Toyota RAV4, Honda CR-V, Tesla Model Y
- **Luxury** (2): BMW 3 Series, Mercedes-Benz C-Class
- **Sport** (2): Ford Mustang GT, Chevrolet Camaro SS
- **Convertible** (1): Mazda MX-5 Miata
- **Van** (1): Honda Odyssey
- **Full-size** (1): Chevrolet Tahoe

**Locations:**
- Mohammedia: 7 cars
- Casablanca: 8 cars

### 3. Reset Users (`reset-users.js`)
Removes all users from the database (use with caution!).

**Run:**
```bash
npm run reset:users
```

## Car Data Structure

Each car includes:
- **Basic Info**: name, make, model, year, category
- **Pricing**: pricePerDay, rating
- **Location**: Mohammedia or Casablanca
- **Features**: Array of car features (e.g., Air Conditioning, Bluetooth)
- **Description**: Detailed car description
- **Specifications**: 
  - Engine details
  - Horsepower
  - Acceleration (0-60 mph)
  - Fuel economy
  - Seating capacity
  - Luggage capacity
  - Transmission type
  - Drive type
- **Images**: Main image URL (using Unsplash placeholders)
- **Availability**: All cars set to available by default

## Usage Notes

1. **First Time Setup:**
   ```bash
   npm run seed:users
   npm run seed:cars
   ```

2. **Scripts are idempotent**: Running them multiple times won't create duplicates. They check if data already exists before seeding.

3. **Environment Variables**: Make sure your `.env` or `.env.docker` file has the correct `MONGODB_URI` configured.

4. **Production Warning**: These scripts are for development/testing only. Do not run on production databases!

## Customization

To add more cars, edit `seed-cars.js` and add new car objects to the `cars` array following the existing structure.

### Example Car Object:
```javascript
{
  name: 'Car Name Year',
  make: 'Manufacturer',
  model: 'Model Name',
  year: 2024,
  category: 'economy', // economy, compact, midsize, fullsize, luxury, suv, sport, convertible, van
  pricePerDay: 50,
  rating: 4.5,
  location: 'Mohammedia', // or 'Casablanca'
  features: ['Feature 1', 'Feature 2'],
  description: 'Car description',
  transmission: 'automatic',
  fuelType: 'gasoline', // gasoline, diesel, hybrid, electric
  seats: 5,
  doors: 4,
  availability: true,
  maintenanceStatus: 'available',
  image: 'https://image-url.com/image.jpg',
  images: [],
  specifications: {
    engine: '2.0L 4-Cylinder',
    horsepower: '150 HP',
    acceleration: '0-60 mph in 8.0s',
    fuelEconomy: '30 MPG City / 40 MPG Highway',
    seatingCapacity: 5,
    luggage: 2,
    doors: 4,
    transmission: 'CVT Automatic',
    driveType: 'Front-Wheel Drive'
  }
}
```

## Troubleshooting

**Connection Error:**
- Verify MongoDB is running
- Check `MONGODB_URI` in your `.env` file
- Ensure network connectivity to database

**Authentication Error:**
- If using MongoDB Atlas or Docker, ensure credentials are correct
- Check if IP is whitelisted (for Atlas)

**Data Already Exists:**
- Scripts will skip seeding if data already exists
- To re-seed, manually delete the data from MongoDB first
