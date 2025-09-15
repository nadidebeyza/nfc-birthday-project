// Smooth page transition functionality
function openMainPage() {
    const landingPage = document.getElementById('landing-page');
    const mainPage = document.getElementById('main-page');
    
    // Add loading state to clickable text
    const clickableText = document.querySelector('.clickable-text');
    clickableText.style.opacity = '0.7';
    clickableText.style.transform = 'scale(0.95)';
    
    // Hide landing page with fade out
    landingPage.classList.remove('active');
    
    // Show main page with fade in after a short delay
    setTimeout(() => {
        mainPage.classList.add('active');
        
        // Reset clickable text state
        clickableText.style.opacity = '1';
        clickableText.style.transform = 'scale(1)';
    }, 400);
    
    // Add smooth scroll behavior for main page
    setTimeout(() => {
        mainPage.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 500);
}

// Add keyboard accessibility
document.addEventListener('keydown', function(event) {
    // Allow Enter or Space to trigger the clickable text
    if (event.key === 'Enter' || event.key === ' ') {
        const landingPage = document.getElementById('landing-page');
        if (landingPage.classList.contains('active')) {
            event.preventDefault();
            openMainPage();
        }
    }
    
    // Allow Escape to go back to landing page (if on main page)
    if (event.key === 'Escape') {
        const mainPage = document.getElementById('main-page');
        if (mainPage.classList.contains('active')) {
            goBackToLanding();
        }
    }
});

// Function to go back to landing page
function goBackToLanding() {
    const landingPage = document.getElementById('landing-page');
    const mainPage = document.getElementById('main-page');
    
    // Hide main page
    mainPage.classList.remove('active');
    
    // Show landing page after a short delay
    setTimeout(() => {
        landingPage.classList.add('active');
    }, 400);
}

// Add touch gesture support for mobile (disabled to prevent accidental page refresh)
let touchStartY = 0;
let touchEndY = 0;
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.changedTouches[0].screenY;
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].screenY;
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100; // Increased threshold to prevent accidental triggers
    const swipeDistanceY = touchStartY - touchEndY;
    const swipeDistanceX = touchStartX - touchEndX;
    
    // Only trigger swipe if it's a clear vertical swipe (not horizontal scrolling)
    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        return; // Ignore horizontal swipes
    }
    
    // Only allow swipes on the landing page to prevent accidental navigation
    const landingPage = document.getElementById('landing-page');
    if (!landingPage.classList.contains('active')) {
        return; // Disable swipe gestures on main page to prevent refresh
    }
    
    // Swipe up to go to main page (only from landing page)
    if (swipeDistanceY > swipeThreshold) {
        openMainPage();
    }
}

// Add loading animation for better UX
window.addEventListener('load', function() {
    // Add a subtle loading animation
    const landingPage = document.getElementById('landing-page');
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'translateY(20px)';
    
    // Fade in the landing page
    setTimeout(() => {
        landingPage.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        landingPage.style.opacity = '1';
        landingPage.style.transform = 'translateY(0)';
    }, 100);
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements when main page becomes active
function observeMainPageElements() {
    const mainPage = document.getElementById('main-page');
    if (mainPage.classList.contains('active')) {
        const elementsToObserve = document.querySelectorAll('.welcome-card, .feature-card, .main-footer');
        elementsToObserve.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            observer.observe(element);
        });
    }
}

// Call observe function when main page opens
const originalOpenMainPage = openMainPage;
openMainPage = function() {
    originalOpenMainPage();
    setTimeout(observeMainPageElements, 500);
    initializeMainPageFeatures();
};

// Add focus management for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const clickableText = document.querySelector('.clickable-text');
    
    // Make clickable text focusable
    clickableText.setAttribute('tabindex', '0');
    clickableText.setAttribute('role', 'button');
    clickableText.setAttribute('aria-label', 'Open main page');
    
    // Remove focus outline for cleaner appearance
    clickableText.addEventListener('focus', function() {
        this.style.outline = 'none';
    });
    
    clickableText.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});


// Memory Gallery Functionality
function initializeMemoryGallery() {
    const filmStrip = document.querySelector('.film-strip');
    const photoFrames = document.querySelectorAll('.photo-frame');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    const frameWidth = 220; // 200px width + 20px gap
    const visibleFrames = Math.floor(window.innerWidth / frameWidth);
    
    // Memory frames are no longer clickable - removed click functionality
    
    // Gallery navigation
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateFilmStrip();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < photoFrames.length - visibleFrames) {
                currentIndex++;
                updateFilmStrip();
            }
        });
    }
    
    function updateFilmStrip() {
        const translateX = -currentIndex * frameWidth;
        filmStrip.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.5';
        nextBtn.style.opacity = currentIndex < photoFrames.length - visibleFrames ? '1' : '0.5';
    }
    
    // Initialize
    updateFilmStrip();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newVisibleFrames = Math.floor(window.innerWidth / frameWidth);
        if (currentIndex > photoFrames.length - newVisibleFrames) {
            currentIndex = Math.max(0, photoFrames.length - newVisibleFrames);
            updateFilmStrip();
        }
    });
}

// Show memory modal (simple alert for now, can be enhanced)
function showMemoryModal(caption) {
    // Create a simple modal-like display
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 400px;
        margin: 20px;
        text-align: center;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <p style="font-size: 1.1rem; color: #333; line-height: 1.6; margin: 0;">${caption}</p>
        <button style="
            margin-top: 20px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
        " onclick="closeModal()">Close</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Store reference for close function
    window.closeModal = function() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(modal);
            delete window.closeModal;
        }, 300);
    };
}

// Timeline Animation
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
}

// Quote Cards Animation
function initializeQuoteCards() {
    const quoteCards = document.querySelectorAll('.quote-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    });
    
    quoteCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Enhanced scroll animations
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });
}

// Performance optimization: Preload main page content
function preloadMainPage() {
    const mainPage = document.getElementById('main-page');
    // Trigger a reflow to ensure styles are applied
    mainPage.offsetHeight;
}

// Stars/Shine Rain Effect
function initializeStarsEffect() {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;
    
    const stars = starsContainer.querySelectorAll('.star');
    
    // Randomly position stars and set animation delays
    stars.forEach((star, index) => {
        // Random horizontal position
        star.style.left = Math.random() * 100 + '%';
        
        // Random animation delay (0-2 seconds)
        star.style.animationDelay = Math.random() * 2 + 's';
        
        // Random animation duration (8-15 seconds) - slower
        const duration = 8 + Math.random() * 7;
        star.style.animationDuration = duration + 's';
        
        // Add some variety to star sizes
        const size = 5 + Math.random() * 6;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Make sure stars are visible
        star.style.opacity = '1';
    });
    
    // Continuously create new stars - more frequent
    setInterval(() => {
        createNewStar();
    }, 200); // Much more frequent generation
    
    // Create multiple stars at once for denser effect
    setInterval(() => {
        createNewStar();
        createNewStar();
    }, 800);
}

function createNewStar() {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;
    
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position and properties
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = '0s';
    star.style.animationDuration = (8 + Math.random() * 7) + 's';
    
    const size = 5 + Math.random() * 6;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    // Random color variation - soft pink shades
    const colors = ['#ffb6c1', '#ffc0cb', '#ffa0b4', '#ffb3ba', '#ffc1cc'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    star.style.background = color;
    star.style.boxShadow = `0 0 10px ${color}`;
    star.style.opacity = '1';
    
    starsContainer.appendChild(star);
    
        // Remove star after animation completes
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, 15000); // Longer timeout for slower animation
}

// Initialize all interactive features when main page opens
function initializeMainPageFeatures() {
    setTimeout(() => {
        initializeMemoryGallery();
        initializeTimeline();
        initializeQuoteCards();
        initializeScrollAnimations();
        initializeStarsEffect();
    }, 500);
}

// Preload after a short delay to not interfere with initial load
setTimeout(preloadMainPage, 1000);
