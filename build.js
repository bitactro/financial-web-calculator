const fs = require('fs');
const path = require('path');
const config = require('./config');

// Read the manifest template
const manifestPath = path.join(__dirname, 'manifest.json');
let manifestContent = fs.readFileSync(manifestPath, 'utf8');

// Replace placeholders with actual values
manifestContent = manifestContent
    .replace('"__APP_NAME__"', `"${config.appName}"`)
    .replace('"__APP_DESCRIPTION__"', `"${config.appDescription}"`);

// Write back the manifest with replaced values
fs.writeFileSync(manifestPath, manifestContent);

console.log('Manifest file has been updated with values from config.js');
