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
                    if (clickedImg) {
                        const srcs = slidesData.map(s => s.src);
                        const idx = srcs.indexOf(clickedImg.getAttribute('src')) ;
                        window.openTheatreView(srcs, idx < 0 ? 0 : idx);
                    }
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

        // Photos are visible at all times. The only scroll effect is the
        // additive grayscale -> colour transition (adding .has-come-into-view
        // on the <img>). If IO is unavailable, colour them all in immediately.
        const revealItem = item => item.querySelector('img')?.classList.add('has-come-into-view');

        if (animate && 'IntersectionObserver' in window) {
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

        // Lightbox open on image click — browse only the currently-visible photos
        galleryGrid.addEventListener('click', e => {
            const img = e.target.closest('.gallery-item img');
            if (!img) return;
            e.preventDefault();
            const visibleImgs = galleryItems
                .filter(it => it.style.display !== 'none')
                .map(it => it.querySelector('img'));
            const srcs = visibleImgs.map(im => im.src);
            const idx = visibleImgs.indexOf(img);
            window.openTheatreView(srcs, idx < 0 ? 0 : idx);
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

    // --- 8. Theatre View (lightbox with prev/next, counter, keyboard, swipe) ---
    let theatreView, theatreImg, theatreCounter;
    let lightboxList = [];
    let lightboxIndex = 0;

    function createTheatreView() {
        if (document.getElementById('jl-theatre-view')) return;
        theatreView = document.createElement('div');
        theatreView.className = 'theatre-view';
        theatreView.id = 'jl-theatre-view';
        theatreView.innerHTML = `
            <button class="theatre-view-close" aria-label="Close">&times;</button>
            <button class="theatre-view-nav theatre-view-prev" aria-label="Previous">&#10094;</button>
            <button class="theatre-view-nav theatre-view-next" aria-label="Next">&#10095;</button>
            <div class="theatre-view-content"><img src="" alt="Gallery photo"></div>
            <div class="theatre-view-counter"></div>`;
        document.body.appendChild(theatreView);
        theatreImg = theatreView.querySelector('img');
        theatreCounter = theatreView.querySelector('.theatre-view-counter');

        theatreView.addEventListener('click', (e) => {
            if (e.target === theatreView || e.target.closest('.theatre-view-close')) { closeTheatreView(); return; }
            if (e.target.closest('.theatre-view-prev')) stepLightbox(-1);
            else if (e.target.closest('.theatre-view-next')) stepLightbox(1);
        });

        document.addEventListener('keydown', (e) => {
            if (!theatreView.classList.contains('active')) return;
            if (e.key === 'Escape') closeTheatreView();
            else if (e.key === 'ArrowLeft') stepLightbox(-1);
            else if (e.key === 'ArrowRight') stepLightbox(1);
        });

        // Swipe on touch devices
        let touchX = null;
        theatreView.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
        theatreView.addEventListener('touchend', e => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
            touchX = null;
        }, { passive: true });
    }

    function renderLightbox() {
        if (!lightboxList.length) return;
        theatreImg.src = lightboxList[lightboxIndex];
        const multiple = lightboxList.length > 1;
        theatreCounter.textContent = multiple ? `${lightboxIndex + 1} / ${lightboxList.length}` : '';
        theatreView.querySelectorAll('.theatre-view-nav').forEach(b => b.style.display = multiple ? 'flex' : 'none');
    }

    function stepLightbox(dir) {
        if (lightboxList.length < 2) return;
        lightboxIndex = (lightboxIndex + dir + lightboxList.length) % lightboxList.length;
        renderLightbox();
    }

    // openTheatreView(list, index) — list of image srcs and the start index.
    // Back-compatible: a single src string also works.
    window.openTheatreView = function (list, index) {
        if (!theatreView) createTheatreView();
        lightboxList = Array.isArray(list) ? list : [list];
        lightboxIndex = index || 0;
        renderLightbox();
        theatreView.classList.add('active');
        document.body.classList.add('theatre-view-active');
    };

    function closeTheatreView() {
        if (theatreView) theatreView.classList.remove('active');
        document.body.classList.remove('theatre-view-active');
        setTimeout(() => { if (theatreImg) theatreImg.src = ''; }, 300);
    }

    // --- 9. Back to Top ---
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        const toggleBackToTop = () => backToTop.classList.toggle('visible', window.scrollY > 600);
        toggleBackToTop();
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
