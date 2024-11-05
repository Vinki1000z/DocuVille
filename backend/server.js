require('dotenv').config();
const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs/promises");
const path = require("path");
const cors = require("cors");
const mongoose = require('mongoose');

// Create an Express application
const app = express();
const PORT = 5000;


app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Use Express's built-in method directly
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Use Express's built-in method directly

// mongoose connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected directly");
}).catch((err) => {
  console.log("Failed to connect to MongoDB", err);
});

// Route 
const userRoutes = require('./routes/UserRoute'); // No need for .js extension
const docRoutes = require('./routes/DocRoute');   // No need for .js extension



app.use('/api', userRoutes);
app.use('/api/doc', docRoutes);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
server.setTimeout(60000);
