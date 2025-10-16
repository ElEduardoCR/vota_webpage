// Simple script to update images.json
// Run this in browser console or as a Node.js script

function updateImageList() {
    const fs = require('fs');
    const path = require('path');
    
    function scanDirectory(dir) {
        const files = [];
        if (fs.existsSync(dir)) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                if (fs.statSync(fullPath).isFile()) {
                    const ext = path.extname(item).toLowerCase();
                    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                        files.push(item);
                    }
                }
            });
        }
        return files.sort();
    }
    
    const images = {
        experts: scanDirectory('images/experts'),
        projects: scanDirectory('images/projects'),
        clients: scanDirectory('images/clients')
    };
    
    const jsonContent = JSON.stringify(images, null, 2);
    fs.writeFileSync('images/images.json', jsonContent);
    
    console.log('Image list updated!');
    console.log('Experts:', images.experts.length);
    console.log('Projects:', images.projects.length);
    console.log('Clients:', images.clients.length);
}

// For browser use
function updateImageListBrowser() {
    // This would need to be run manually in browser console
    console.log('To update images manually:');
    console.log('1. Open browser console');
    console.log('2. Run: updateImageListBrowser()');
    console.log('3. Check the console for found images');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateImageList };
}

