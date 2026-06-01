// ---
// Website/js/script.js
// ---

document.addEventListener('DOMContentLoaded', function () {

    const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = hasGSAP && !reduceMotion;

    if (hasGSAP) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- 1. Landing Page Slideshow (index.html) ---
    const landingSlideshow = document.getElementById('background-slideshow');
    if (landingSlideshow) {
        const slides = landingSlideshow.querySelectorAll('.slide');
        let currentSlide = 0;
        if (slides.length > 0) {
            slides[0].classList.add('active');
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 7000);
        }
    }

    // --- 2. Footer Year ---
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // --- 3. Home Page Carousel (Portrait Optimized) ---
    const jlCarouselSection = document.getElementById('featured-photos-home');
    if (jlCarouselSection && typeof Swiper !== 'undefined') {
        const slidesData = [
            { src: 'images/featured/image1.webp', alt: 'Yuri', title: 'Rainbow road', caption: 'She went blind looking at that wall' },
            { src: 'images/featured/image2.webp', alt: 'Shenelle', title: 'Kangaroo point', caption: 'Taken on our first date - personal fav of mine' },
            { src: 'images/featured/image3.webp', alt: 'King Glizzard The Wizard Lizard', title: 'Glimpse of us', caption: 'Joji would be proud' },
            { src: 'images/featured/image4.webp', alt: 'Lilly the cat', title: 'Fleeting feet', caption: 'Trust me this cat MOVES' },
            { src: 'images/featured/image5.webp', alt: 'Yuri', title: 'Ring around the rosie', caption: "'A tissue, a tissue, we all fall down'" },
            { src: 'images/featured/image6.webp', alt: 'Yuri', title: 'Cyberpunk', caption: 'Saturated in red' }
        ];

        const container = jlCarouselSection.querySelector('.container');
        container.innerHTML = `
            <h2 class="section-heading">featured work</h2>
            <div class="swiper jl-swiper">
                <div class="swiper-wrapper"></div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        `;

        const swiperWrapper = container.querySelector('.swiper-wrapper');

        slidesData.forEach(item => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');

            let captionHtml = '';
            if (item.title || item.caption) {
                captionHtml = `
                    <div class="jl-carousel-slide-caption">
                        ${item.title ? `<h4>${item.title}</h4>` : ''}
                        ${item.caption ? `<p>${item.caption}</p>` : ''}
                    </div>
                `;
            }
            slide.innerHTML = `<img src="${item.src}" alt="${item.alt || 'Work'}" loading="lazy">${captionHtml}`;
            swiperWrapper.appendChild(slide);
        });

        new Swiper('.jl-swiper', {
            loop: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            speed: 800,
            grabCursor: true,
            autoplay: { delay: 5000, disableOnInteraction: true },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            on: {
                click: function (swiper, event) {
                    const clickedImg = event.target.closest('img');
                    if (clickedImg) window.openTheatreView(clickedImg.src);
                }
            }
        });

        // Entrance for the carousel container (never the individual slides)
        if (animate) {
            gsap.from('.jl-swiper', {
                opacity: 0, y: 40, duration: 0.9, ease: 'power2.out',
                scrollTrigger: { trigger: jlCarouselSection, start: 'top 70%' }
            });
        }
    }

    // --- 4. Work Gallery (CSS columns + IntersectionObserver reveal + filtering) ---
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
        const filterButtons = document.querySelectorAll('.filter-btn');

        const revealItem = item => {
            item.classList.add('is-revealed');
            item.querySelector('img')?.classList.add('has-come-into-view');
        };

        // Reveal-on-scroll via IntersectionObserver — robust with lazy,
        // variable-height masonry and anchor jumps (no cached positions).
        if (animate && 'IntersectionObserver' in window) {
            galleryItems.forEach(item => item.classList.add('reveal-init'));
            const revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        revealItem(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
            galleryItems.forEach(item => revealObserver.observe(item));
        } else {
            // No animation: everything visible and coloured in
            galleryItems.forEach(revealItem);
        }

        // Debounced ScrollTrigger refresh helper (for triggers below the grid)
        let refreshTimer;
        const refreshScroll = () => {
            if (!hasGSAP) return;
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
        };

        // Columns grow as (uncropped, lazy) images load — recompute
        // positions of the contact triggers that sit below the grid.
        galleryGrid.querySelectorAll('img').forEach(img => {
            if (!img.complete) img.addEventListener('load', refreshScroll, { once: true });
        });

        // Filter logic
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                const filterValue = btn.dataset.filter;

                galleryItems.forEach(item => {
                    const matches = filterValue === 'all' || item.dataset.category === filterValue;
                    if (matches) {
                        item.style.display = '';
                        revealItem(item); // ensure shown items are visible + in colour
                    } else {
                        item.style.display = 'none';
                    }
                });

                refreshScroll();
            });
        });

        // Lightbox open on image click
        galleryGrid.addEventListener('click', e => {
            const img = e.target.closest('.gallery-item img');
            if (img) { e.preventDefault(); window.openTheatreView(img.src); }
        });

        window.addEventListener('resize', refreshScroll);
    }

    // --- 5. Section Reveal Animations (hero, about, contact) ---
    if (animate) {
        // Hero text on load
        const heroEls = ['.hero-title', '.hero-lead', '.hero-cta']
            .map(sel => document.querySelector(sel)).filter(Boolean);
        if (heroEls.length) {
            gsap.from(heroEls, {
                opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1
            });
        }

        // About: parallax on the profile image + fade-up bio
        if (document.querySelector('#about .about-image img')) {
            gsap.to('#about .about-image img', {
                yPercent: -12, ease: 'none',
                scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true }
            });
        }
        const aboutReveal = document.querySelectorAll('#about .section-heading, #about .about-bio');
        if (aboutReveal.length) {
            gsap.from(aboutReveal, {
                opacity: 0, y: 40, duration: 0.8, ease: 'power2.out', stagger: 0.15,
                scrollTrigger: { trigger: '#about', start: 'top 75%' }
            });
        }

        // Contact fade-up
        const contactReveal = document.querySelectorAll('#contact .section-heading, #contact .contact-intro, #contact .contact-form');
        if (contactReveal.length) {
            gsap.from(contactReveal, {
                opacity: 0, y: 40, duration: 0.8, ease: 'power2.out', stagger: 0.12,
                scrollTrigger: { trigger: '#contact', start: 'top 80%' }
            });
        }
    }

    // --- 6. Scroll-spy (active nav link) ---
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    if (navLinks.length && 'IntersectionObserver' in window) {
        const sections = Array.from(navLinks)
            .map(a => document.querySelector(a.getAttribute('href')))
            .filter(Boolean);

        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const link = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
                    if (link) link.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

        sections.forEach(s => spy.observe(s));
    }

    // --- 7. Contact Form ---
    document.querySelectorAll('.contact-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                if (!field.value.trim() || (field.type === 'email' && !field.value.includes('@'))) {
                    valid = false;
                    field.style.borderColor = '#ff6b6b';
                } else {
                    field.style.borderColor = '#1F2124';
                }
            });
            if (!valid) {
                e.preventDefault();
            } else {
                const btn = form.querySelector('button');
                if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
            }
        });
    });

    // --- 8. Theatre View (lightbox) ---
    let theatreView, theatreImg;
    function createTheatreView() {
        if (document.getElementById('jl-theatre-view')) return;
        theatreView = document.createElement('div');
        theatreView.className = 'theatre-view';
        theatreView.id = 'jl-theatre-view';
        theatreView.innerHTML = `<div class="theatre-view-content"><button class="theatre-view-close" aria-label="Close">&times;</button><img src="" alt="View"></div>`;
        document.body.appendChild(theatreView);
        theatreImg = theatreView.querySelector('img');

        theatreView.addEventListener('click', (e) => {
            if (e.target === theatreView || e.target.closest('.theatre-view-close')) closeTheatreView();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTheatreView(); });
    }

    window.openTheatreView = function (src) {
        if (!theatreView) createTheatreView();
        theatreImg.src = src;
        theatreView.classList.add('active');
        document.body.classList.add('theatre-view-active');
    };

    function closeTheatreView() {
        if (theatreView) theatreView.classList.remove('active');
        document.body.classList.remove('theatre-view-active');
        setTimeout(() => { if (theatreImg) theatreImg.src = ''; }, 300);
    }
});
