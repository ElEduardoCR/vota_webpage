// Floating Navigation
class FloatingNavigation {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.navSlider = document.querySelector('.nav-slider');
        this.sections = {
            inicio: document.querySelector('#hero'),
            mision: document.querySelector('#mision'),
            especialidades: document.querySelector('#especialidades'),
            expertos: document.querySelector('#expertos'),
            proyectos: document.querySelector('#proyectos'),
            clientes: document.querySelector('#clientes'),
            contacto: document.querySelector('#contact')
        };
        
        this.imageLoader = new DynamicImageLoader();
        this.init();
    }
    
    init() {
        console.log('Initializing FloatingNavigation...');
        console.log('Nav items found:', this.navItems.length);
        console.log('Sections found:', Object.keys(this.sections).filter(key => this.sections[key]));
        
        this.setupNavigation();
        this.updateSliderPosition();
        this.loadProjects();
        this.loadClients();
    }
    
    setupNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.navigateToSection(section);
                this.setActiveNav(item);
            });
        });
    }
    
    navigateToSection(section) {
        console.log('Navigating to section:', section);
        if (this.sections[section]) {
            console.log('Section found, scrolling to:', this.sections[section]);
            this.sections[section].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.error('Section not found:', section);
            console.log('Available sections:', Object.keys(this.sections));
        }
    }
    
    setActiveNav(activeItem) {
        this.navItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
        this.updateSliderPosition();
    }
    
    updateSliderPosition() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem && this.navSlider) {
            const itemRect = activeItem.getBoundingClientRect();
            const containerRect = activeItem.parentElement.getBoundingClientRect();
            const left = itemRect.left - containerRect.left;
            const width = itemRect.width;
            
            this.navSlider.style.left = `${left}px`;
            this.navSlider.style.width = `${width}px`;
        }
    }
    
    async loadProjects() {
        try {
            const projectsGrid = document.querySelector('.projects-grid');
            if (projectsGrid) {
                // Use dynamic image loader
                const images = await this.imageLoader.loadImagesWithFallback();
                const projectImages = images.projects || [];
                
                if (projectImages.length > 0) {
                    projectImages.forEach((imageSrc, index) => {
                        const imageName = imageSrc.split('/').pop();
                        const projectCard = this.createProjectCard(imageName, index);
                        projectsGrid.appendChild(projectCard);
                    });
                } else {
                    // Fallback to placeholder projects
                    const fallbackImages = [
                        'proyecto-cnc-1.jpg',
                        'proyecto-automatizacion-1.jpg', 
                        'proyecto-soldadura-1.jpg',
                        'proyecto-cnc-2.jpg',
                        'proyecto-automatizacion-2.jpg',
                        'proyecto-soldadura-2.jpg'
                    ];
                    
                    fallbackImages.forEach((imageName, index) => {
                        const projectCard = this.createProjectCard(imageName, index);
                        projectsGrid.appendChild(projectCard);
                    });
                }
                
                // Animate projects on scroll
                this.observeProjects();

                // Apply current language to newly added project nodes
                applyCurrentLanguageToDynamicContent();
            }
        } catch (error) {
            console.log('Projects will be loaded when images are uploaded');
        }
    }
    
    createProjectCard(imageName, index) {
        const card = document.createElement('div');
        card.className = 'project-card animate-on-scroll scale-in';
        
        // Generate project info based on filename
        const projectInfo = this.getProjectInfo(imageName, index);
        
        card.innerHTML = `
            <img src="images/projects/${imageName}" alt="${projectInfo.title}" class="project-image" onerror="this.style.display='none';">
            <div class="project-info">
                <h3 class="project-title" data-es="${projectInfo.title}" data-en="${projectInfo.titleEn}">
                    ${projectInfo.title}
                </h3>
                <p class="project-description" data-es="${projectInfo.description}" data-en="${projectInfo.descriptionEn}">
                    ${projectInfo.description}
                </p>
            </div>
        `;
        
        return card;
    }
    
    getProjectInfo(imageName, index) {
        // Remove file extension for matching
        const nameWithoutExt = imageName.replace(/\.[^/.]+$/, "").toLowerCase();
        
        // Project descriptions based on filename
        const projectMap = {
            'tazas': {
                title: 'Manufactura de Repuestos',
                titleEn: 'Spare Parts Manufacturing',
                description: 'Manufactura de repuestos de maquinaria con tolerancias precisas y acabados de alta calidad',
                descriptionEn: 'Manufacturing of machinery spare parts with precise tolerances and high-quality finishes'
            },
            'dados_para_troquelado': {
                title: 'Dados para Troquelado',
                titleEn: 'Stamping Dies',
                description: 'Piezas con tratamiento térmico especializado para troquelado de alta precisión',
                descriptionEn: 'Heat-treated components specialized for high-precision stamping operations'
            },
            'fixturas_aluminio': {
                title: 'Fixturas de Aluminio',
                titleEn: 'Aluminum Fixtures',
                description: 'Fabricación de piezas y fixturas en aluminio para aplicaciones industriales especializadas',
                descriptionEn: 'Manufacturing of aluminum parts and fixtures for specialized industrial applications'
            },
            'rodillos': {
                title: 'Torneado de Rodillos',
                titleEn: 'Roller Turning',
                description: 'Fabricación de torneado hasta 7" de diámetro con acabados de precisión industrial',
                descriptionEn: 'Turning manufacturing up to 7" diameter with industrial precision finishes'
            },
            'soldadura': {
                title: 'Proyecto de Soldadura',
                titleEn: 'Welding Project',
                description: 'Desarrollo de mesa de soldadura personalizada con certificación AWS',
                descriptionEn: 'Custom welding table development with AWS certification'
            },
            'fabricacion_nueva': {
                title: 'Proyectos Únicos',
                titleEn: 'Unique Projects',
                description: 'Desarrollo de proyectos únicos y soluciones personalizadas de manufactura',
                descriptionEn: 'Development of unique projects and customized manufacturing solutions'
            }
        };
        
        // Find matching project
        for (const [key, info] of Object.entries(projectMap)) {
            if (nameWithoutExt.includes(key)) {
                return info;
            }
        }
        
        // Default fallback
        return {
            title: `Proyecto de Manufactura ${index + 1}`,
            titleEn: `Manufacturing Project ${index + 1}`,
            description: 'Ejemplo de nuestro trabajo en manufactura de precisión',
            descriptionEn: 'Example of our precision manufacturing work'
        };
    }
    
    observeProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 100);
                }
            });
        }, { threshold: 0.1 });
        
        projectCards.forEach(card => observer.observe(card));
    }
    
    async loadClients() {
        try {
            const clientsTrack = document.querySelector('.clients-track');
            if (clientsTrack) {
                // Use dynamic image loader
                const images = await this.imageLoader.loadImagesWithFallback();
                const clientImages = images.clients || [];
                
                if (clientImages.length > 0) {
                    // Single set for individual logo slideshow
                    clientImages.forEach((imageSrc, index) => {
                        const logoName = imageSrc.split('/').pop();
                        const clientLogo = this.createClientLogo(logoName, index);
                        clientsTrack.appendChild(clientLogo);
                    });
                } else {
                    // Fallback to placeholder clients
                    const fallbackLogos = [
                        'cliente-1.png',
                        'cliente-2.png',
                        'cliente-3.png',
                        'cliente-4.png',
                        'cliente-5.png',
                        'cliente-6.png',
                        'cliente-7.png',
                        'cliente-8.png'
                    ];
                    
                    fallbackLogos.forEach((logoName, index) => {
                        const clientLogo = this.createClientLogo(logoName, index);
                        clientsTrack.appendChild(clientLogo);
                    });
                }
                
                // Start the carousel
                setTimeout(() => {
                    this.startClientCarousel();
                }, 500);

                // Apply current language to any newly added client nodes (for completeness)
                applyCurrentLanguageToDynamicContent();
            }
        } catch (error) {
            console.log('Client logos will be loaded when images are uploaded');
        }
    }
    
    createClientLogo(logoName, index) {
        const logo = document.createElement('div');
        logo.className = 'client-logo';
        
        logo.innerHTML = `
            <img src="images/clients/${logoName}" alt="Cliente ${index + 1}" onerror="this.style.display='none';">
        `;
        
        return logo;
    }
    
    startClientCarousel() {
        const logos = document.querySelectorAll('.client-logo');
        if (logos.length === 0) return;
        
        let currentIndex = 0;
        
        function showNext() {
            // Ocultar todos con transición
            logos.forEach(logo => {
                logo.style.opacity = '0';
                logo.style.transform = 'translateX(300px) scale(0.8)';
            });
            
            // Mostrar el actual
            logos[currentIndex].style.opacity = '1';
            logos[currentIndex].style.transform = 'translateX(0) scale(1)';
            
            // Avanzar al siguiente
            currentIndex = (currentIndex + 1) % logos.length;
        }
        
        // Mostrar el primero inmediatamente
        logos[0].style.opacity = '1';
        logos[0].style.transform = 'translateX(0) scale(1)';
        currentIndex = 1;
        
        // Cambiar cada 2.5 segundos
        setInterval(() => {
            showNext();
        }, 2500);
    }
}

// Language Toggle Functionality
class LanguageToggle {
    constructor() {
        this.currentLang = 'es';
        this.toggle = document.getElementById('languageToggle');
        this.labels = document.querySelectorAll('.lang-label');
        this.elements = document.querySelectorAll('[data-es], [data-en]');
        
        this.init();
    }
    
    init() {
        this.setupToggle();
        this.updateLanguage();
    }
    
    setupToggle() {
        this.toggle.addEventListener('click', () => {
            this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
            this.updateLanguage();
            this.updateToggleState();
        });
    }
    
    updateLanguage() {
        this.elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                if (element.tagName === 'HTML') {
                    element.lang = this.currentLang;
                } else {
                    element.textContent = text;
                }
            }
        });
        
        // Update document language
        document.documentElement.lang = this.currentLang;
    }
    
    updateToggleState() {
        this.toggle.classList.toggle('active', this.currentLang === 'en');
        this.labels.forEach(label => {
            const lang = label.getAttribute('data-lang');
            label.classList.toggle('active', lang === this.currentLang);
        });
    }
}

// Smooth Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupIsoProgressObserver();
        this.setupScrollEffects();
        this.animateHeroElements();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Stagger animation for cards
                    if (entry.target.classList.contains('service-cards')) {
                        this.staggerCards(entry.target.querySelectorAll('.service-card'));
                    } else if (entry.target.classList.contains('experts-grid')) {
                        this.staggerCards(entry.target.querySelectorAll('.expert-card'));
                    }
                }
            });
        }, this.observerOptions);
        
        // Observe elements with different animation types
        const elementsToObserve = [
            { selector: '.section-title', animation: 'fade-in-up' },
            { selector: '.mission-card', animation: 'fade-in-up' },
            { selector: '.vision-card', animation: 'fade-in-up' },
            { selector: '.service-cards', animation: 'fade-in' },
            { selector: '.service-card', animation: 'scale-in' },
            { selector: '.iso-certification-content', animation: 'fade-in-up' },
            { selector: '.experts-grid', animation: 'fade-in' },
            { selector: '.expert-card', animation: 'scale-in' },
            { selector: '.contact-message p', animation: 'fade-in-up' },
            { selector: '.contact-phone', animation: 'fade-in-up' }
        ];
        
        elementsToObserve.forEach(({ selector, animation }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('animate-on-scroll', animation);
                this.observer.observe(element);
            });
        });
    }
    
    setupIsoProgressObserver() {
        const isoSection = document.querySelector('.iso-certification');
        if (!isoSection) return;

        const progressBar = isoSection.querySelector('.iso-progress-bar');
        const progressLabel = isoSection.querySelector('.iso-progress-label');
        const progressText = isoSection.querySelector('.iso-progress-text');

        if (!progressBar || !progressLabel) return;

        let animationStarted = false;
        const targetValue = parseInt(progressBar.dataset.target || '80', 10);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationStarted) {
                    animationStarted = true;
                    if (progressText) {
                        const currentLang = document.documentElement.lang === 'en' ? 'en' : 'es';
                        const loadingText = progressText.getAttribute(`data-${currentLang}`);
                        if (loadingText) {
                            progressText.textContent = loadingText;
                        }
                    }

                    const duration = 2000;
                    const startTime = performance.now();

                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const currentValue = Math.round(progress * targetValue);

                        progressBar.style.width = `${currentValue}%`;
                        progressLabel.textContent = `${currentValue}%`;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            progressBar.style.width = `${targetValue}%`;
                            progressLabel.textContent = `${targetValue}%`;
                        }
                    };

                    requestAnimationFrame(animate);
                }
            });
        }, { threshold: 0.4 });

        observer.observe(isoSection);
    }

    staggerCards(cards) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150);
        });
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Parallax effect for hero background
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground && scrollY < windowHeight) {
                const parallaxSpeed = 0.5;
                heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
            }
            
            // Update scroll indicator opacity
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                const opacity = Math.max(0, 1 - scrollY / (windowHeight * 0.5));
                scrollIndicator.style.opacity = opacity;
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
    
    animateHeroElements() {
        // Animate hero title on load
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.animation = 'heroTitleAnimation 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            }
        }, 500);
        
        // Animate hero subtitle
        setTimeout(() => {
            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle) {
                heroSubtitle.style.animation = 'heroSubtitleAnimation 1s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            }
        }, 1000);
        
        // Animate scroll indicator
        setTimeout(() => {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.animation = 'scrollIndicatorAnimation 1s ease forwards';
            }
        }, 1500);
    }
}

// 3D Hover Effects
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCardEffects();
        this.setupMouseTracking();
    }
    
    setupCardEffects() {
        const cards = document.querySelectorAll('.service-card, .expert-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addHoverEffect(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.updateHoverEffect(card, e);
            });
        });
    }
    
    addHoverEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) / rect.width;
        const deltaY = (event.clientY - centerY) / rect.height;
        
        card.style.transform = `translateY(-10px) rotateX(${-deltaY * 10}deg) rotateY(${deltaX * 10}deg)`;
        card.style.transition = 'transform 0.1s ease';
    }
    
    removeHoverEffect(card) {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    updateHoverEffect(card, event) {
        if (card.matches(':hover')) {
            this.addHoverEffect(card, event);
        }
    }
    
    setupMouseTracking() {
        const heroTitle = document.querySelector('.hero-title');
        
        if (heroTitle) {
            heroTitle.addEventListener('mousemove', (e) => {
                const rect = heroTitle.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) / rect.width;
                const deltaY = (e.clientY - centerY) / rect.height;
                
                heroTitle.style.transform = `rotateX(${-deltaY * 10}deg) rotateY(${deltaX * 10}deg)`;
                heroTitle.style.transition = 'transform 0.1s ease';
            });
            
            heroTitle.addEventListener('mouseleave', () => {
                heroTitle.style.transform = 'rotateX(0) rotateY(0)';
                heroTitle.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        }
    }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Add smooth scroll to any anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Add scroll to next section functionality
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

// Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.preloadCriticalResources();
        this.optimizeImages();
        this.setupLazyLoading();
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
    
    optimizeImages() {
        // Add loading="lazy" to any images that might be added later
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    lazyObserver.unobserve(element);
                }
            });
        });
        
        document.querySelectorAll('[data-src]').forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

// Helper: apply current language to any elements with data-es/data-en (useful for dynamically added nodes)
function applyCurrentLanguageToDynamicContent() {
    const currentLang = document.documentElement.lang === 'en' ? 'en' : 'es';
    document.querySelectorAll('[data-es], [data-en]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            if (el.tagName === 'HTML') {
                el.lang = currentLang;
            } else {
                el.textContent = text;
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are ready
    setTimeout(() => {
        // Initialize all components
        new FloatingNavigation();
        new LanguageToggle();
        new ScrollAnimations();
        new HoverEffects();
        new SmoothScroll();
        new PerformanceOptimizer();
    }, 100);
    
    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Console welcome message
    console.log(`
    🏭 VOXA - Manufacture, Simple.
    🇲🇽 Hecho en México
    
    Built with:
    ✨ Apple-inspired design
    🌐 Bilingual support (ES/EN)
    🎨 Smooth animations
    📱 Responsive design
    🚀 Performance optimized
    
    Ready for production! 🚀
    `);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Certification Modal Functions
function openCertificationModal() {
    const modal = document.getElementById('certificationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scrolling
    }
}

function closeCertificationModal() {
    const modal = document.getElementById('certificationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scrolling
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertificationModal();
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LanguageToggle,
        ScrollAnimations,
        HoverEffects,
        SmoothScroll,
        PerformanceOptimizer
    };
}
