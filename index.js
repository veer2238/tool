// server.js
const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

const PORT = 3024;

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Create upload directory if it doesn't exist
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Route to handle file upload
app.post('/convert-pdf', upload.single('file'), (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    console.log(`Received file: ${req.file.originalname}`);
    res.status(200).json({ success: true, message: 'File received successfully', fileUrl,fileName:req.file.filename });
  } else {
    res.status(400).json({ success: false, error: 'No file uploaded' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
