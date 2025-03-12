// network-accessible-server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, 'public')));

// Images API endpoint
app.get('/api/images', (req, res) => {
  const imageDir = path.join(__dirname, 'images');
  
  // Create the images directory if it doesn't exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
    console.log('Created images directory');
  }
  
  // Read the directory
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      return res.json([]);
    }
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    console.log('Found images:', imageFiles);
    res.json(imageFiles);
  });
});

// Get local IP addresses
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

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Local access: http://localhost:${port}`);
  
  // Display all IP addresses that can be used to access the server
  const ipAddresses = getLocalIpAddresses();
  if (ipAddresses.length > 0) {
    console.log('Network access URLs (share these with people on the same WiFi):');
    ipAddresses.forEach(ip => {
      console.log(`http://${ip}:${port}`);
    });
  } else {
    console.log('No network interfaces found. The server might only be accessible locally.');
  }
  
  console.log(`Add images to the 'images' folder to see them in the gallery`);
});