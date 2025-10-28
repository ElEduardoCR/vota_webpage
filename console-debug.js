// Console debug script - add this to the main page temporarily
console.log('=== VOXA Debug Script ===');

// Test if DynamicImageLoader is available
console.log('DynamicImageLoader available:', typeof DynamicImageLoader !== 'undefined');

// Test JSON loading
fetch('images/images.json')
    .then(response => response.json())
    .then(data => {
        console.log('JSON loaded successfully:', data);
        
        // Test image loading
        const loader = new DynamicImageLoader();
        return loader.loadImagesWithFallback();
    })
    .then(results => {
        console.log('Image loader results:', results);
        
        // Check if projects are being created
        const projectsGrid = document.querySelector('.projects-grid');
        console.log('Projects grid found:', !!projectsGrid);
        console.log('Projects grid children:', projectsGrid?.children.length);
    })
    .catch(error => {
        console.error('Error in debug:', error);
    });

// Monitor for any errors
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

console.log('=== End Debug Script ===');

