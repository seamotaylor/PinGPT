/**
 * Simple script to create placeholder icon files for the Chrome extension
 * Generates colored squares as PNG placeholders using Canvas API
 */

const fs = require('fs');
const path = require('path');

function createIcon(size, filename) {
    // Create a simple colored square icon
    // For now, we'll create a basic script that generates image data
    console.log(`Creating ${filename} (${size}x${size})`);

    // Create a basic colored square as base64 encoded data
    // This is a placeholder - in production you'd use proper image generation libraries
    const color = '#007bff'; // Primary blue color
    const svgData = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" rx="4"/>
  <text x="${size/2}" y="${size/2}" font-family="Arial" font-size="${Math.max(8, size/6)}" fill="white" text-anchor="middle" dominant-baseline="central">
    P
  </text>
</svg>`;

    // Write SVG file (can be converted to PNG later)
    fs.writeFileSync(`${filename}.svg`, svgData);

    // For demonstration, we'll create a basic data URI approach
    // In a real project, you'd use libraries like sharp or canvas to create proper PNGs
    const base64Svg = Buffer.from(svgData).toString('base64');

    return { svgData, base64Svg };
}

function main() {
    const icons = [
        { size: 16, filename: 'icon16' },
        { size: 48, filename: 'icon48' },
        { size: 128, filename: 'icon128' }
    ];

    icons.forEach(icon => {
        createIcon(icon.size, icon.filename, icon.color);
        console.log(`✓ Created ${icon.filename}.svg`);
    });

    console.log('\nIcons created! Convert SVG to PNG using:');
    console.log('npm install -g sharp');
    console.log('sharp icon16.svg -o icon16.png');
    console.log('sharp icon48.svg -o icon48.png');
    console.log('sharp icon128.svg -o icon128.png');
}

if (require.main === module) {
    main();
}

module.exports = { createIcon, main };