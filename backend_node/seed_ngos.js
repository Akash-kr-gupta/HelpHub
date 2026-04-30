const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/helphub';

// Define User Schema structure compatible with the database
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['citizen', 'volunteer', 'ngo'], default: 'citizen' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const indianNGOs = [
  { name: 'Smile Foundation', email: 'contact@smilefoundationindia.org' },
  { name: 'Goonj', email: 'mail@goonj.org' },
  { name: 'Save the Children India', email: 'info@savethechildren.in' },
  { name: 'Helpage India', email: 'info@helpageindia.org' },
  { name: 'Pratham', email: 'info@pratham.org' },
  { name: 'Khalsa Aid India', email: 'info@khalsaaid.org' },
  { name: 'Akshaya Patra', email: 'info@akshayapatra.org' }
];

async function seedNGOs() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to Database');

    for (let ngo of indianNGOs) {
      // Check if NGO already exists
      const exists = await User.findOne({ email: ngo.email });
      if (!exists) {
        // Create a default password for the NGOs 
        const hashedPassword = await bcrypt.hash('NGOpass123!', 10);
        await User.create({
          name: ngo.name,
          email: ngo.email,
          password: hashedPassword,
          role: 'ngo'
        });
        console.log(`✅ Added NGO: ${ngo.name}`);
      } else {
        console.log(`⚠️ NGO already exists: ${ngo.name}`);
      }
    }
    
    console.log('🎉 Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedNGOs();