// Dynamic Image Loader
class DynamicImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.loadedImages = new Set();
    }

    // Try to load an image and return a promise
    async tryLoadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.loadedImages.add(src);
                resolve({ success: true, src });
            };
            img.onerror = () => {
                resolve({ success: false, src });
            };
            img.src = src;
        });
    }

    // Load images from a directory by trying common patterns
    async loadImagesFromDirectory(basePath, patterns = []) {
        const results = [];
        
        // If no patterns provided, try common naming conventions
        if (patterns.length === 0) {
            patterns = this.generateCommonPatterns();
        }

        for (const pattern of patterns) {
            const src = `${basePath}/${pattern}`;
            const result = await this.tryLoadImage(src);
            if (result.success) {
                results.push(result.src);
            }
        }

        return results;
    }

    // Generate common naming patterns
    generateCommonPatterns() {
        const patterns = [];
        
        // Try numbered patterns (1-20)
        for (let i = 1; i <= 20; i++) {
            patterns.push(`${i}.jpg`);
            patterns.push(`${i}.png`);
            patterns.push(`${i}.heic`);
            patterns.push(`${i}.HEIC`);
            patterns.push(`image-${i}.jpg`);
            patterns.push(`image-${i}.png`);
            patterns.push(`image-${i}.heic`);
            patterns.push(`image-${i}.HEIC`);
            patterns.push(`img-${i}.jpg`);
            patterns.push(`img-${i}.png`);
            patterns.push(`img-${i}.heic`);
            patterns.push(`img-${i}.HEIC`);
        }

        // Try named patterns
        const names = ['eduardo', 'alex', 'david', 'proyecto', 'cliente', 'client'];
        const extensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'HEIC'];
        
        for (const name of names) {
            for (const ext of extensions) {
                patterns.push(`${name}.${ext}`);
                patterns.push(`${name}-1.${ext}`);
                patterns.push(`${name}-2.${ext}`);
            }
        }

        return patterns;
    }

    // Load images from JSON file first, then try dynamic loading
    async loadImagesWithFallback() {
        try {
            // Try to load from JSON first
            const response = await fetch('images/images.json');
            if (response.ok) {
                const imageList = await response.json();
                return await this.loadFromJSON(imageList);
            }
        } catch (error) {
            console.log('JSON file not found, trying dynamic loading...');
        }

        // Fallback to dynamic loading
        return await this.loadDynamically();
    }

    // Load images from JSON configuration
    async loadFromJSON(imageList) {
        const results = {
            experts: [],
            projects: [],
            clients: []
        };

        for (const [category, files] of Object.entries(imageList)) {
            for (const file of files) {
                const src = `images/${category}/${file}`;
                const result = await this.tryLoadImage(src);
                if (result.success) {
                    results[category].push(result.src);
                }
            }
        }

        return results;
    }

    // Load images dynamically by trying common patterns
    async loadDynamically() {
        const results = {
            experts: [],
            projects: [],
            clients: []
        };

        // Load expert images
        results.experts = await this.loadImagesFromDirectory('images/experts', [
            'eduardo.jpg', 'eduardo.png',
            'alex.jpg', 'alex.png', 
            'david.jpg', 'david.png'
        ]);

        // Load project images
        results.projects = await this.loadImagesFromDirectory('images/projects');

        // Load client images  
        results.clients = await this.loadImagesFromDirectory('images/clients');

        return results;
    }

    // Update the JSON file with found images
    async updateImageList(images) {
        try {
            const jsonData = JSON.stringify(images, null, 2);
            // Note: This would require a server-side endpoint to actually save the file
            // For now, we'll just log the data that should be saved
            console.log('Images found:', images);
            console.log('JSON to save:', jsonData);
        } catch (error) {
            console.error('Error updating image list:', error);
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicImageLoader;
}

