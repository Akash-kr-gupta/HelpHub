const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/helphub';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((e) => console.error('MongoDB connection error', e));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['citizen', 'volunteer', 'ngo'], default: 'citizen' },
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
  item: String,
  amount: Number,
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  ngoName: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Request = mongoose.model('Request', requestSchema);
const Donation = mongoose.model('Donation', donationSchema);

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
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

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
  const { help_type, description, location, contact, priority, photo, targetNgoId, targetNgoName } = req.body;
  const reqDoc = new Request({
    help_type,
    description,
    location,
    contact,
    priority,
    photo,
    targetNgoId: targetNgoId || null,
    targetNgoName: targetNgoName || '',
    createdBy: req.user.id,
  });
  await reqDoc.save();
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
  const { name, item, amount, ngoId, ngoName } = req.body;
  const donation = new Donation({ name, item, amount, ngoId: ngoId || null, ngoName: ngoName || '' });
  await donation.save();
  res.status(201).json(donation);
});

app.get('/api/analytics', authenticate, async (req, res) => {
  const total = await Request.countDocuments();
  const completed = await Request.countDocuments({ status: 'Completed' });
  const pending = await Request.countDocuments({ status: 'Pending' });
  const ngos = await User.countDocuments({ role: 'ngo' });
  const donations = await Donation.countDocuments();
  res.json({ total, completed, pending, ngos, donations });
});

// serve React production files if needed
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
