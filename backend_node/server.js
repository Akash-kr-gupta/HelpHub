// ...existing code...

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { sendEmail, sendSMS } = require('./alert');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => { socket.on('join_room', (roomId) => { socket.join(roomId); }); socket.on('send_message', (data) => { socket.to(data.roomId).emit('receive_message', data.message); }); });

  app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/helphub';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch((e) => console.error('MongoDB Atlas connection error', e));

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['citizen', 'volunteer', 'ngo'], default: 'citizen' },
  avatar: { type: String, default: '' }, // base64 or URL
  createdAt: { type: Date, default: Date.now },
});

const requestSchema = new mongoose.Schema({
  help_type: String,
  description: String,
  location: String,
  contact: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  photo: String,
  targetNgoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  targetNgoName: String,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

const donationSchema = new mongoose.Schema({
  name: String,
  donationType: { type: String, enum: ['Money', 'Food', 'Clothes', 'Medical Supplies', 'Blood', 'Other'], default: 'Money' },
  item: String, // Description or custom item if Other
  amount: Number, // Keeps backward compatibility for Money quantity
  quantity: String, // e.g. "5 kg", "10 boxes"
  contact: String,
  address: String,
  message: String,
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  ngoName: String,
  status: { type: String, enum: ['Pending', 'Accepted', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Request = mongoose.model('Request', requestSchema);
const Donation = mongoose.model('Donation', donationSchema);

// Update user profile (name, avatar)
app.put('/api/profile', authenticate, async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const update = {};
    if (name) update.name = name;
    if (avatar) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (err) {
    res.status(400).json({ message: 'Profile update failed', error: err.message });
  }
});

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'helphub_secret');
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

    // Auto-login after signup: Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'helphub_secret', { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User created', 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Wrong password' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'helphub_secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/requests', authenticate, async (req, res) => {
  const all = await Request.find().sort({ createdAt: -1 }).populate('createdBy', 'name email').populate('completedBy', 'name email').populate('targetNgoId', 'name email');
  res.json(all);
});

app.get('/api/ngos', authenticate, async (req, res) => {
  const ngos = await User.find({ role: 'ngo' }).select('name email');
  res.json(ngos);
});

app.delete('/api/requests/:id', authenticate, async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  const isOwner = request.createdBy.toString() === req.user.id;
  const isAdminLike = ['ngo', 'volunteer'].includes(req.user.role);
  if (!isOwner && !isAdminLike) {
    return res.status(403).json({ message: 'Permission denied' });
  }

  await request.deleteOne();
  res.json({ message: 'Request deleted' });
});

app.get('/api/requests/recent', authenticate, async (req, res) => {
  const recent = await Request.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name email').populate('completedBy', 'name email');
  res.json(recent);
});

app.get('/api/requests/:id', authenticate, async (req, res) => {
  const request = await Request.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('completedBy', 'name email');
  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json(request);
});


app.post('/api/requests', authenticate, async (req, res) => {
  let { help_type, description, location, contact, priority, photo, targetNgoId, targetNgoName } = req.body;
  
  // Validate phone (basic check)
  if (!contact || contact.length < 10) {
    return res.status(400).json({ message: 'Please provide a valid contact number.' });
  }

  // Get user details directly from DB for alerts
  const user = await User.findById(req.user.id);
  const userEmail = user ? user.email : '';

  let address = location;
  // If location looks like coordinates, try to reverse geocode
  if (/^-?\d+\.\d+,-?\d+\.\d+$/.test(location)) {
    const [lat, lon] = location.split(',');
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const geoData = await geoRes.json();
      if (geoData.display_name) {
        address = geoData.display_name;
      }
    } catch (e) {
      address = location;
    }
  }
  const reqDoc = new Request({
    help_type,
    description,
    location: address,
    contact,
    priority,
    photo,
    targetNgoId: targetNgoId || null,
    targetNgoName: targetNgoName || '',
    createdBy: req.user.id,
  });
  await reqDoc.save();

  // Notify all connected users except the poster
  io.emit('new_help_request', {
    help_type,
    description,
    location: address,
    contact,
    priority,
    photo,
    targetNgoId,
    targetNgoName,
    createdBy: req.user.id,
    _id: reqDoc._id,
    createdAt: reqDoc.createdAt
  });

  // Send alert to the user (email/SMS)
  try {
    if (userEmail) {
      await sendEmail(userEmail, 'Help Request Submitted', `Your emergency help request has been received.\nType: ${help_type}\nLocation: ${address}\nPriority: ${priority}`);
    }
    await sendSMS(contact, `HelpHub: Your emergency help request (${help_type}) is received. We will reach out soon.`);
  } catch (e) {
    // Log but don't block
    console.error('Alert error:', e);
  }

  res.status(201).json(reqDoc);
});

app.put('/api/requests/:id/accept', authenticate, async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, {
    status: 'Completed',
    completedBy: req.user.id,
    completedAt: new Date(),
  }, { new: true });
  if (!request) return res.status(404).json({ message: 'Request not found' });
  res.json(request);
});

app.post('/api/donations', authenticate, async (req, res) => {
  const { name, donationType, item, amount, quantity, contact, address, message, ngoId, ngoName } = req.body;
  const donation = new Donation({ 
    name, 
    donationType: donationType || 'Money', 
    item: item || '',
    amount: amount || 0, 
    quantity: quantity || '', 
    contact: contact || '', 
    address: address || '', 
    message: message || '', 
    ngoId: ngoId || null, 
    ngoName: ngoName || '' 
  });
  await donation.save();
  
  // Broadcast to all connected users (Volunteers/NGOs will see this)
  io.emit('new_donation', {
    ...donation.toObject(),
    _id: donation._id
  });

  res.status(201).json({ message: 'Donation received', donation });
});

app.get('/api/donations', authenticate, async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 }).populate('ngoId', 'name');
  res.json(donations);
});

app.get('/api/donations/:id', authenticate, async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('ngoId', 'name');
  if (!donation) return res.status(404).json({ message: 'Donation not found' });
  res.json(donation);
});

app.put('/api/donations/:id/accept', authenticate, async (req, res) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'ngo') {
    return res.status(403).json({ message: 'Only volunteers or NGOs can accept donations' });
  }
  const donation = await Donation.findByIdAndUpdate(req.params.id, {
    status: 'Accepted',
    // We could track WHO accepted it if needed, but for now just status
  }, { new: true });
  if (!donation) return res.status(404).json({ message: 'Donation not found' });
  res.json(donation);
});

app.put('/api/donations/:id/complete', authenticate, async (req, res) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'ngo') {
    return res.status(403).json({ message: 'Only volunteers or NGOs can complete donations' });
  }
  const donation = await Donation.findByIdAndUpdate(req.params.id, {
    status: 'Completed',
  }, { new: true });
  if (!donation) return res.status(404).json({ message: 'Donation not found' });
  res.json(donation);
});

app.get('/api/analytics', authenticate, async (req, res) => {
  const total = await Request.countDocuments();
  const completed = await Request.countDocuments({ status: 'Completed' });
  const pending = await Request.countDocuments({ status: 'Pending' });
  const ngos = await User.countDocuments({ role: 'ngo' });
  const donations = await Donation.countDocuments();
  res.json({ total, completed, pending, ngos, donations });
});

// Provide a simple health check / welcome route for the backend API URL
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to HelpHub Backend API 🚑',
    version: '1.0.0',
    endpoints: 'All API endpoints are located under /api',
    frontend: process.env.FRONTEND_URL || 'Not specified'
  });
});

app.use('/uploads', express.static(process.env.UPLOADS_DIR || path.join(__dirname, '../uploads')));

// Fallback for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
