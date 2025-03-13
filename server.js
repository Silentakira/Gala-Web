// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const app = express();
const port = 3001;

// Function to get local IP addresses
function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      // Skip internal and non-IPv4 addresses
      if (info.family === 'IPv4' && !info.internal) {
        addresses.push(info.address);
      }
    }
  }
  
  return addresses;
}

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

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log('\n=== Gala Photo Gallery Server ===');
  console.log(`\nLocal access: http://localhost:${port}`);
  
  // Display all IP addresses that can be used to access the server
  const ipAddresses = getLocalIpAddresses();
  if (ipAddresses.length > 0) {
    console.log('\nNetwork access URLs (share these with people on the same WiFi):');
    ipAddresses.forEach(ip => {
      console.log(`http://${ip}:${port}`);
    });
  } else {
    console.log('\nNo network interfaces found. The server might only be accessible locally.');
  }
  
  console.log('\nAdd photos to the "public/images" folder to see them in the gallery');
  console.log('\nPress Ctrl+C to stop the server');
});
