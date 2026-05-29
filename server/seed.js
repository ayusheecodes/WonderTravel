const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Destination = require('./models/Destination');
const { fallbackDestinations } = require('./services/destinationCatalog');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');

    // Delete existing
    await Destination.deleteMany();
    console.log('Cleared existing destinations');

    // Insert fallback destinations
    const count = fallbackDestinations.length;
    await Destination.insertMany(fallbackDestinations);
    
    console.log(`Successfully seeded ${count} destinations into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
