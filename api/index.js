const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add cookie-parser
const User = require('./models/User');
const Event = require('./models/EventModel');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer'); // Import multer
const path = require('path');
require('dotenv').config();



const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser

// Configure multer for handling file uploads
// const upload = multer({ storage });
const upload = multer({ dest: "uploads/" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Check cookies and headers
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// User Logout
app.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  res.json('Logged out successfully');
});

// Route for creating an event without image upload
// Route for creating an event with image upload
app.post('/create-event', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      clubname,
    } = req.body;

    const image = req.file; // Uploaded image file

    if (!image) {
      return res.status(400).send('No image file uploaded.');
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path);

    // Get the Cloudinary image URL from the result
    const imageUrl = result.secure_url;

    // Create a new event with the image URL
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      clubname,
      image: imageUrl, // Save the Cloudinary image URL
      createdBy: req.userId,
    });
    console.log(req.userId);
    // Save the event to MongoDB
    await newEvent.save();

    res.status(201).json({ message: 'Event creation successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Event creation failed' });
  }
});


app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve events' });
  }
});

// Add a route to fetch event details by ID
app.get('/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve event details' });
  }
});


// Update Event
app.put('/events/:id/update', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const eventId = req.params.id;
    const {
      title,
      description,
      date,
      time,
      location,
      clubname,
    } = req.body;

    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user making the request is the creator of the event
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    // Update the event fields
    event.title = title;
    event.description = description;
    event.date = date;
    event.time = time;
    event.location = location;
    event.clubname = clubname;

    // Handle image upload if a new image is provided
    if (req.file) {
      const image = req.file; // Uploaded image file

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(image.path);

      // Get the Cloudinary image URL from the result
      const imageUrl = result.secure_url;

      // Update the event's image URL with the new one
      event.image = imageUrl;
    }

    // Save the updated event to the database
    await event.save();

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Event update failed' });
  }
});


// Add a DELETE route for event deletion
app.delete('/events/:id', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user making the request is the creator of the event
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(204).send(); // Respond with a 204 No Content status for successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the event' });
  }
});

// Profile route (protected)
app.get('/profile', verifyToken, async (req, res) => {
  console.log("profile path");
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
    console.log((user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user information' });
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
