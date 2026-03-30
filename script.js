// ============================================
// MOBILE HAMBURGER MENU
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');

    // Toggle mobile menu
    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        nav.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});


// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll(
        '.stat-card, .nft-card, .collection-card, .team-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});


// ============================================
// HEADER SCROLL EFFECT
// ============================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});


// ============================================
// 3D PRODUCT SLIDER
// ============================================

class Slider3D {
    constructor() {
        this.slider = document.getElementById('slider3D');
        if (!this.slider) return;

        this.slides = Array.from(this.slider.querySelectorAll('.slider-3d-slide'));
        this.prevBtn = document.getElementById('slider3DPrev');
        this.nextBtn = document.getElementById('slider3DNext');
        this.pagination = document.getElementById('slider3DPagination');

        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;

        // Touch/swipe properties
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;

        this.init();
    }

    init() {
        // Create pagination dots
        this.createPagination();

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch events
        this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.slider.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Mouse events for desktop swipe
        this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.slider.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Start autoplay
        this.startAutoPlay();

        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

        // Initial update
        this.updateSlides();
    }

    createPagination() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-3d-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.pagination.appendChild(dot);
        });
        this.dots = Array.from(this.pagination.querySelectorAll('.slider-3d-dot'));
    }

    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');

            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else if (index === this.getPrevIndex()) {
                slide.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                slide.classList.add('next');
            }
        });

        // Update pagination
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    getPrevIndex() {
        return this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    }

    getNextIndex() {
        return this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
    }

    nextSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.currentIndex = this.getNextIndex();
        this.updateSlides();

        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    prevSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.currentIndex = this.getPrevIndex();
        this.updateSlides();

        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.isAnimating = true;

        this.currentIndex = index;
        this.updateSlides();

        setTimeout(() => {
            this.isAnimating = false;
        }, 800);

        // Restart autoplay
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    // Touch handlers
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    // Mouse handlers
    handleMouseDown(e) {
        this.touchStartX = e.screenX;
    }

    handleMouseUp(e) {
        this.touchEndX = e.screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;

        if (Math.abs(swipeDistance) < this.minSwipeDistance) return;

        if (swipeDistance > 0) {
            // Swipe right - go to previous
            this.prevSlide();
        } else {
            // Swipe left - go to next
            this.nextSlide();
        }

        // Restart autoplay after swipe
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize slider when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    new Slider3D();
});


// ============================================
// AUTO-ROTATING PRODUCT SHOWCASE
// ============================================

class ProductShowcase {
    constructor() {
        this.container = document.querySelector('.showcase-container');
        if (!this.container) return;

        this.items = Array.from(this.container.querySelectorAll('.showcase-item'));
        this.dots = Array.from(document.querySelectorAll('.showcase-dot'));

        this.currentIndex = 0;
        this.autoRotateInterval = null;
        this.rotateDelay = 2000; // 2 seconds

        this.init();
    }

    init() {
        // Set up dot click handlers
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Start auto-rotation
        this.startAutoRotate();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoRotate());
        this.container.addEventListener('mouseleave', () => this.startAutoRotate());
    }

    goToSlide(index) {
        // Remove active class from current item and dot
        this.items[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update index
        this.currentIndex = index;

        // Add active class to new item and dot
        this.items[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');

        // Restart auto-rotation
        this.stopAutoRotate();
        this.startAutoRotate();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToSlide(nextIndex);
    }

    startAutoRotate() {
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            this.nextSlide();
        }, this.rotateDelay);
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
}

// Initialize product showcase when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    new ProductShowcase();
});



/* ============================================
   FOOTER
   ============================================ */

const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");

city.addEventListener("toggle", toggleCont);

city.addEventListener("click", () => {
    city.dispatchEvent(new Event("toggle"));
});

function toggleCont() {
    city.classList.toggle("active");
    cont.forEach((el) => {
        el.style.display = el.style.display === "block" ? "none" : "block";
    });
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}


// Age verification modal
const ageModal = document.getElementById("ageModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

window.addEventListener("load", () => {
    if (localStorage.getItem("ageConfirmed") != "true") {
        ageModal.style.display = "flex";
    } else {
        ageModal.style.display = "none";
    }
});
yesBtn.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    ageModal.style.display = "none";
});

noBtn.addEventListener("click", () => {
    alert("Acceso denegado. Sitio solo para mayores de 18 años");
    window.close();
    window.location.href = "https://www.google.es";
});

