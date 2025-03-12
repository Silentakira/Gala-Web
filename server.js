// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint to get images
app.get('/api/images', (req, res) => {
  const imageDir = path.join(__dirname, 'public/images');
  
  // Read image directory
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      return res.status(500).json([]);
    }
    
    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    res.json(imageFiles);
  });
});

// For all other routes, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
