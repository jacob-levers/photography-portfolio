// ---
// Website/js/script.js
// ---

document.addEventListener('DOMContentLoaded', function () {

    const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = hasGSAP && !reduceMotion;
    const hasFlip = hasGSAP && typeof Flip !== 'undefined';
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasGSAP) {
        gsap.registerPlugin(ScrollTrigger);
        if (hasFlip) gsap.registerPlugin(Flip);
    }
    // CSS hooks that depend on JS-driven animation hide/reveal scope under this class
    if (animate) document.body.classList.add('js-anim');

    console.log('%c📷 jacoblevers.com', 'color:#5764F1;font-size:14px;font-weight:700;',
        "\nLike the animations? Say hi → hello@jacoblevers.com");

    // --- 0. Hero flow-field background ---
    // Particles drift along a Perlin-noise vector field, leaving faint trails
    // that weave into strands. Trails fade fairly quickly so the space keeps
    // clearing and new patterns form rather than filling up. Own implementation.
    (function heroFlowField() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Compact classic Perlin noise (own implementation)
        const perlin = (() => {
            const perm = new Uint8Array(512);
            const src = Array.from({ length: 256 }, (_, i) => i);
            for (let i = 255; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const t = src[i]; src[i] = src[j]; src[j] = t;
            }
            for (let i = 0; i < 512; i++) perm[i] = src[i & 255];
            const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
            const lerp = (a, b, t) => a + t * (b - a);
            const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
            return (x, y) => {
                const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
                x -= Math.floor(x); y -= Math.floor(y);
                const u = fade(x), v = fade(y);
                const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1];
                const ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
                return lerp(lerp(grad(aa, x, y), grad(ba, x - 1, y), u),
                            lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u), v);
            };
        })();

        const BG = '#2e313a';
        // Cool white / silver strands — clean and neutral, no colour cast
        const palette = [
            'rgba(214,220,230,0.07)',  'rgba(214,220,230,0.07)',  // cool silver
            'rgba(214,220,230,0.07)',  'rgba(214,220,230,0.065)',
            'rgba(228,233,242,0.07)',  'rgba(228,233,242,0.07)',  // brighter cool white
            'rgba(228,233,242,0.06)',
            'rgba(190,198,212,0.06)',  'rgba(190,198,212,0.06)',  // dimmer silver
            'rgba(240,244,252,0.10)'   // bright highlight
        ];

        const NOISE_SCALE = 0.0016;
        const FIELD_TURNS = 3.2;      // how much the noise rotates the flow
        const FIELD_DRIFT = 0.0022;   // how fast the whole field morphs over time
        const FADE = 0.16;            // higher = trails clear faster (wispier, never solid)
        let dpr, W, H, particles = [], rafId = null, running = false, time = 0;

        // Cursor gently bends nearby strands (desktop pointers only)
        const pointer = { cx: -1e4, cy: -1e4, x: -1e4, y: -1e4 };
        const INFLUENCE = 120, INF2 = INFLUENCE * INFLUENCE, FORCE = 1.5;
        const heroEl = canvas.closest('#hero');
        if (heroEl && fineHover && !reduceMotion) {
            heroEl.addEventListener('pointermove', e => { pointer.cx = e.clientX; pointer.cy = e.clientY; }, { passive: true });
            heroEl.addEventListener('pointerleave', () => { pointer.cx = pointer.cy = -1e4; });
        }

        function makeParticle() {
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                life: 0,
                maxLife: 60 + Math.random() * 140,
                speed: 0.7 + Math.random() * 1.2,
                color: palette[(Math.random() * palette.length) | 0],
                width: 0.7 + Math.random() * 0.9
            };
        }

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            W = rect.width; H = rect.height;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, W, H);
            const count = Math.min(320, Math.max(120, Math.floor(W * H / 5400)));
            particles = Array.from({ length: count }, makeParticle);
        }

        function step() {
            // Fade old trails so the field keeps clearing and re-forming
            ctx.fillStyle = 'rgba(46,49,58,' + FADE + ')';
            ctx.fillRect(0, 0, W, H);

            // The whole field slowly rotates over time so strands morph
            time += FIELD_DRIFT;

            // Resolve the cursor into canvas space once per frame
            if (pointer.cx > -1e3) {
                const rect = canvas.getBoundingClientRect();
                pointer.x = pointer.cx - rect.left;
                pointer.y = pointer.cy - rect.top;
            } else {
                pointer.x = -1e4;
            }

            for (const p of particles) {
                const angle = perlin(p.x * NOISE_SCALE, p.y * NOISE_SCALE) * Math.PI * FIELD_TURNS + time;
                let nx = p.x + Math.cos(angle) * p.speed;
                let ny = p.y + Math.sin(angle) * p.speed;

                // Soft radial push bends strands around the cursor
                const pdx = nx - pointer.x, pdy = ny - pointer.y;
                const d2 = pdx * pdx + pdy * pdy;
                if (d2 < INF2 && d2 > 0.01) {
                    const d = Math.sqrt(d2), f = 1 - d / INFLUENCE;
                    nx += (pdx / d) * f * f * FORCE;
                    ny += (pdy / d) * f * f * FORCE;
                }

                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.width;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(nx, ny);
                ctx.stroke();

                p.x = nx; p.y = ny; p.life++;
                if (p.life > p.maxLife || nx < -10 || nx > W + 10 || ny < -10 || ny > H + 10) {
                    Object.assign(p, makeParticle());
                }
            }
        }

        function loop() { if (!running) return; step(); rafId = requestAnimationFrame(loop); }
        function start() { if (!running) { running = true; loop(); } }
        function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }
        function warmUp(frames) { for (let i = 0; i < frames; i++) step(); }

        resize();
        let rt;
        window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); warmUp(90); }, 200); });

        if (reduceMotion) { warmUp(180); return; }

        warmUp(90); // pre-weave a little so the hero isn't blank on first paint

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                entries.forEach(e => e.isIntersecting ? start() : stop());
            }, { threshold: 0 }).observe(canvas);
        } else {
            start();
        }
    })();

    // --- 1. Landing Page Slideshow + exit transition (index.html) ---
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

        // ENTER plays a quick veil-out, then navigates (cancel-safe via bfcache guard)
        const enterLink = document.querySelector('.landing-page .button-link');
        if (enterLink && !reduceMotion) {
            enterLink.addEventListener('click', e => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                document.body.classList.add('is-exiting');
                setTimeout(() => { window.location.href = enterLink.href; }, 420);
            });
        }
        window.addEventListener('pageshow', e => {
            if (e.persisted) document.body.classList.remove('is-exiting');
        });
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
            <div class="jl-autoplay-progress" aria-hidden="true"><span></span></div>
        `;

        const apWrap = container.querySelector('.jl-autoplay-progress');
        const apBar = apWrap ? apWrap.querySelector('span') : null;

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
                },
                autoplayTimeLeft(swiper, time, progress) {
                    if (apBar) apBar.style.transform = `scaleX(${1 - progress})`;
                },
                autoplayStop() { if (apWrap) apWrap.classList.add('is-idle'); },
                autoplayStart() { if (apWrap) apWrap.classList.remove('is-idle'); }
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
    // Wraps each word, then each character, in spans so the title can
    // stagger in. Built only when animating — otherwise plain visible text.
    function splitChars(el) {
        const text = el.textContent;
        el.setAttribute('aria-label', text);
        el.textContent = '';
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const word = document.createElement('span');
            word.className = 'ht-word';
            word.setAttribute('aria-hidden', 'true');
            for (const ch of part) {
                const c = document.createElement('span');
                c.className = 'ht-char';
                c.textContent = ch;
                word.appendChild(c);
            }
            frag.appendChild(word);
        });
        el.appendChild(frag);
        return el.querySelectorAll('.ht-char');
    }

    if (animate) {
        // Hero: char-staggered title, then lead + CTA rise
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const chars = splitChars(heroTitle);
            gsap.from(chars, {
                yPercent: 110, opacity: 0, rotateX: -55,
                transformPerspective: 500, transformOrigin: '50% 100%',
                duration: 0.9, ease: 'power4.out', stagger: 0.035, delay: 0.15,
                onComplete() { gsap.set(chars, { clearProps: 'all' }); }
            });
        }
        const heroSubEls = ['.hero-lead', '.hero-cta']
            .map(sel => document.querySelector(sel)).filter(Boolean);
        if (heroSubEls.length) {
            gsap.from(heroSubEls, {
                opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.55
            });
        }

        // Hero content drifts a few px toward the cursor (desktop only)
        const heroSection = document.getElementById('hero');
        const heroBox = document.querySelector('.hero-section .container');
        if (heroSection && heroBox && fineHover) {
            const px = gsap.quickTo(heroBox, 'x', { duration: 0.8, ease: 'power3' });
            const py = gsap.quickTo(heroBox, 'y', { duration: 0.8, ease: 'power3' });
            heroSection.addEventListener('pointermove', e => {
                px((e.clientX / window.innerWidth - 0.5) * 10);
                py((e.clientY / window.innerHeight - 0.5) * 6);
            }, { passive: true });
            heroSection.addEventListener('pointerleave', () => { px(0); py(0); });
        }

        // About: clip-path curtain reveal + parallax on the profile image, staggered bio
        if (document.querySelector('#about .about-image img')) {
            gsap.fromTo('#about .about-image img',
                { clipPath: 'inset(0 100% 0 0)', scale: 1.12 },
                {
                    clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1.1, ease: 'power4.inOut',
                    scrollTrigger: { trigger: '#about .about-image', start: 'top 82%', once: true }
                });
            gsap.to('#about .about-image img', {
                yPercent: -12, ease: 'none',
                scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true }
            });
        }
        const aboutReveal = document.querySelectorAll('#about .section-heading, #about .about-bio h3, #about .about-bio p, #about .about-links');
        if (aboutReveal.length) {
            gsap.from(aboutReveal, {
                opacity: 0, y: 40, duration: 0.8, ease: 'power2.out', stagger: 0.1,
                scrollTrigger: { trigger: '#about', start: 'top 75%' }
            });
        }

        // Section-heading accent underline draws itself in on first view.
        // The hidden start state only exists on elements the observer owns.
        const headings = document.querySelectorAll('.section-heading');
        if (headings.length && 'IntersectionObserver' in window) {
            const headingObs = new IntersectionObserver((entries, obs) => {
                entries.forEach(en => {
                    if (en.isIntersecting) {
                        en.target.classList.add('heading-drawn');
                        obs.unobserve(en.target);
                    }
                });
            }, { threshold: 0.6 });
            headings.forEach(h => {
                h.classList.add('heading-anim');
                headingObs.observe(h);
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

    // --- 6. Scroll-spy (active nav link) + sliding indicator ---
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const navUl = document.querySelector('.main-nav ul');
    let moveIndicator = () => {};

    if (navUl) {
        navUl.classList.add('nav-has-indicator');
        const indicator = document.createElement('span');
        indicator.className = 'nav-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        navUl.appendChild(indicator);

        moveIndicator = () => {
            const active = navUl.querySelector('a.active');
            if (!active) { indicator.style.opacity = '0'; return; }
            const ulRect = navUl.getBoundingClientRect();
            const r = active.getBoundingClientRect();
            indicator.style.opacity = '1';
            indicator.style.transform = `translateX(${r.left - ulRect.left}px)`;
            indicator.style.width = r.width + 'px';
        };

        // Optimistic move on click; the spy re-confirms as the scroll settles
        navUl.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                a.classList.add('active');
                moveIndicator();
            });
        });

        let nrTimer;
        window.addEventListener('resize', () => { clearTimeout(nrTimer); nrTimer = setTimeout(moveIndicator, 150); });
        // Inter loading changes link widths — re-measure once fonts land
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
        moveIndicator();
    }

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
            moveIndicator();
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
                    field.setAttribute('aria-invalid', 'true');
                    if (animate) gsap.fromTo(field, { x: -6 }, { x: 0, duration: 0.45, ease: 'elastic.out(1, 0.35)' });
                } else {
                    field.style.borderColor = '#1F2124';
                    field.removeAttribute('aria-invalid');
                }
            });
            if (!valid) {
                e.preventDefault();
            } else {
                // Real submit proceeds (FormSubmit navigates to thanks.html);
                // lock the button width so the spinner doesn't reflow it
                const btn = form.querySelector('button');
                if (btn) {
                    btn.style.width = btn.offsetWidth + 'px';
                    btn.classList.add('is-sending');
                    btn.innerHTML = '<span class="btn-spinner"></span>Sending…';
                    btn.disabled = true;
                }
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

    // --- 9. Unified scroll states (back-to-top + progress ring, nav condense, scroll cue) ---
    const backToTop = document.getElementById('back-to-top');
    const mainHeader = document.querySelector('.main-header');
    const heroScrollCue = document.querySelector('.scroll-cue');
    const bttRing = backToTop ? backToTop.querySelector('.btt-ring-progress') : null;
    const RING_C = 2 * Math.PI * 21;

    if (bttRing) {
        bttRing.style.strokeDasharray = RING_C;
        bttRing.style.strokeDashoffset = RING_C;
    }
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    let scrollTick = false;
    function onScrollFrame() {
        scrollTick = false;
        const y = window.scrollY;
        if (backToTop) backToTop.classList.toggle('visible', y > 600);
        if (mainHeader) mainHeader.classList.toggle('is-scrolled', y > 8);
        if (heroScrollCue) heroScrollCue.classList.toggle('is-hidden', y > 40);
        if (bttRing) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bttRing.style.strokeDashoffset = RING_C * (1 - (max > 0 ? Math.min(1, y / max) : 0));
        }
    }
    onScrollFrame();
    window.addEventListener('scroll', () => {
        if (!scrollTick) { scrollTick = true; requestAnimationFrame(onScrollFrame); }
    }, { passive: true });

    // --- 10. Hero snap: frame the art, or commit to leaving as soon as you stop ---
    (function heroSnap() {
        if (reduceMotion) return;
        const hero = document.getElementById('hero');
        const about = document.getElementById('about');
        if (!hero || !about) return;
        const navOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 96;

        let timer, prevY = window.scrollY, dir = 1, snapping = false;

        function aboutTarget() {
            return Math.round(about.getBoundingClientRect().top + window.scrollY - navOffset);
        }

        function onScrollEnd() {
            if (snapping) return;
            const y = window.scrollY;
            const h = hero.offsetHeight;
            if (y <= 1 || y >= h - 1) return;        // already at an end — leave it
            // Small dead-zones at each edge; otherwise commit in the scroll direction
            let target;
            if (y < h * 0.06) target = 0;
            else if (y > h * 0.94) target = aboutTarget();
            else target = dir >= 0 ? aboutTarget() : 0;
            snapping = true;
            window.scrollTo({ top: target, behavior: 'smooth' });
            setTimeout(() => { snapping = false; prevY = window.scrollY; }, 650);
        }

        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y > prevY) dir = 1; else if (y < prevY) dir = -1;
            prevY = y;
            if (snapping) return;
            clearTimeout(timer);
            timer = setTimeout(onScrollEnd, 120);
        }, { passive: true });
    })();

    // --- 11. Page entry veil (home) ---
    // Only created when GSAP will definitely remove it; ties the splash's
    // exit veil into a seamless dark handoff while the hero staggers in.
    if (animate && document.getElementById('hero')) {
        const veil = document.createElement('div');
        veil.className = 'page-veil';
        document.body.appendChild(veil);
        const removeVeil = () => { if (veil.parentNode) veil.remove(); };
        gsap.to(veil, { opacity: 0, duration: 0.55, ease: 'power1.out', delay: 0.05, onComplete: removeVeil });
        setTimeout(removeVeil, 1500); // failsafe
    }
});
