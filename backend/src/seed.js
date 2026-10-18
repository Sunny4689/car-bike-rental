import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Vehicle from './models/vehicleModel.js';
import Booking from './models/bookingModel.js';

dotenv.config();

const sampleVehicles = [
  {
    name: 'Honda City ZX',
    brand: 'Honda',
    type: 'Car',
    category: 'Sedan',
    pricePerDay: 2200,
    fuelType: 'Petrol',
    seatingCapacity: 5,
    mileage: '18 km/l',
    location: 'Mumbai Central',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop',
    isAvailable: true,
    description: 'Premium automatic sedan with sunroof, leather interior, and smooth highway ride.',
    rating: 4.8,
    reviews: [
      { userName: 'Aarav Sharma', rating: 5, comment: 'Super comfortable drive to Pune. Very clean car!' },
      { userName: 'Pooja Mehta', rating: 4.5, comment: 'Great fuel efficiency and smooth pickup.' }
    ]
  },
  {
    name: 'Hyundai Creta SX',
    brand: 'Hyundai',
    type: 'Car',
    category: 'SUV',
    pricePerDay: 2800,
    fuelType: 'Diesel',
    seatingCapacity: 5,
    mileage: '16 km/l',
    location: 'Andheri West',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
    isAvailable: true,
    description: 'Popular compact SUV with panoramic sunroof, ventilated seats, and high ground clearance.',
    rating: 4.9,
    reviews: [
      { userName: 'Rohan Gupta', rating: 5, comment: 'Loved the panoramic sunroof and spacious boot.' }
    ]
  },
  {
    name: 'Maruti Suzuki Swift ZXi',
    brand: 'Maruti Suzuki',
    type: 'Car',
    category: 'Hatchback',
    pricePerDay: 1400,
    fuelType: 'Petrol',
    seatingCapacity: 5,
    mileage: '22 km/l',
    location: 'Bandra',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
    isAvailable: true,
    description: 'Agile and budget-friendly city car. Exceptional mileage and easy parking anywhere.',
    rating: 4.7,
    reviews: [
      { userName: 'Sneha Patel', rating: 5, comment: 'Affordable, easy to park in Mumbai traffic.' }
    ]
  },
  {
    name: 'Mahindra Thar 4x4',
    brand: 'Mahindra',
    type: 'Car',
    category: 'SUV',
    pricePerDay: 3500,
    fuelType: 'Diesel',
    seatingCapacity: 4,
    mileage: '12 km/l',
    location: 'Thane',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    isAvailable: true,
    description: 'Rugged all-terrain 4x4 convertible off-roader. Perfect for hill station road trips.',
    rating: 5.0,
    reviews: [
      { userName: 'Vikram Joshi', rating: 5, comment: 'Ultimate adventure machine for Lonavala trip!' }
    ]
  },
  {
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    type: 'Bike',
    category: 'Cruiser',
    pricePerDay: 900,
    fuelType: 'Petrol',
    seatingCapacity: 2,
    mileage: '35 km/l',
    location: 'Bandra',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
    isAvailable: true,
    description: 'Iconic retro thumper cruiser with dual disc brakes, luggage carriers, and vintage charm.',
    rating: 4.9,
    reviews: [
      { userName: 'Aditya Rao', rating: 5, comment: 'Smooth highway cruising with signature exhaust beat.' }
    ]
  },
  {
    name: 'Yamaha YZF R15 V4',
    brand: 'Yamaha',
    type: 'Bike',
    category: 'Sports Bike',
    pricePerDay: 1100,
    fuelType: 'Petrol',
    seatingCapacity: 2,
    mileage: '40 km/l',
    location: 'Andheri West',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop',
    isAvailable: true,
    description: 'Aerodynamic track-bred supersport motorcycle with quickshifter, traction control, and USD forks.',
    rating: 4.8,
    reviews: [
      { userName: 'Kunal Verma', rating: 5, comment: 'Incredible acceleration and sharp handling.' }
    ]
  },
  {
    name: 'Honda Activa 6G',
    brand: 'Honda',
    type: 'Bike',
    category: 'Scooter',
    pricePerDay: 500,
    fuelType: 'Petrol',
    seatingCapacity: 2,
    mileage: '50 km/l',
    location: 'Mumbai Central',
    imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800&auto=format&fit=crop',
    isAvailable: true,
    description: 'Reliable and hassle-free gearless scooter. Ample storage space and supreme comfort.',
    rating: 4.6,
    reviews: [
      { userName: 'Neha Kulkarni', rating: 4.5, comment: 'Most convenient ride for running daily errands in town.' }
    ]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data in collection
    await Vehicle.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'System Admin',
      email: 'admin@rental.com',
      password: adminPassword,
      phone: '+91 9876543210',
      role: 'admin',
      drivingLicenseNumber: 'MH-01-2020-0012345',
      licenseStatus: 'verified',
    });

    // Create Verified Demo User
    const userPassword = await bcrypt.hash('user123', salt);
    await User.create({
      name: 'Rahul Deshmukh',
      email: 'user@rental.com',
      password: userPassword,
      phone: '+91 9123456780',
      role: 'user',
      drivingLicenseNumber: 'MH-02-2022-0098765',
      drivingLicenseImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
      licenseStatus: 'verified',
    });

    // Create Vehicles
    await Vehicle.insertMany(sampleVehicles);

    console.log('✅ Sample vehicles, users, and admin account seeded successfully!');
    console.log('🔑 Admin Login: admin@rental.com / admin123');
    console.log('🔑 User Login:  user@rental.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();
