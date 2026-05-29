// ---
// Website/js/script.js
// ---

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Landing Page Slideshow ---
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

    // --- 2. Home Page Carousel (Portrait Optimized) ---
    const jlCarouselSection = document.getElementById('featured-photos-home');
    if (jlCarouselSection) {
        // OPTIMIZATION: Inlined JSON data for instant load
        const slidesData = [
          {
            "src": "images/featured/image1.webp",
            "alt": "Yuri",
            "title": "Rainbow road",
            "caption": "She went blind looking at that wall"
          },
          {
            "src": "images/featured/image2.webp",
            "alt": "Shenelle",
            "title": "Kangaroo point",
            "caption": "Taken on our first date - personal fav of mine"
          },
          {
            "src": "images/featured/image3.webp",
            "alt": "King Glizzard The Wizard Lizard",
            "title": "Glimpse of us",
            "caption": "Joji would be proud"
          },
          {
            "src": "images/featured/image4.webp",
            "alt": "Lilly the cat",
            "title": "Fleeting feet",
            "caption": "Trust me this cat MOVES"
          },
          {
            "src": "images/featured/image5.webp",
            "alt": "Yuri",
            "title": "Ring around the rosie",
            "caption": "'A tissue, a tissue, we all fall down'"
          },
          {
            "src": "images/featured/image6.webp",
            "alt": "Yuri",
            "title": "Cyberpunk",
            "caption": "Saturated in red"
          }
        ];

        const container = jlCarouselSection.querySelector('.container');
        container.innerHTML = `
            <h2>Featured Work</h2>
            <div class="swiper jl-swiper">
                <div class="swiper-wrapper"></div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        `;

        const swiperWrapper = container.querySelector('.swiper-wrapper');
        
        // Loop through inlined data
        slidesData.forEach(item => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            
            let captionHtml = '';
            if(item.title || item.caption) {
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

        // Initialize Swiper
        new Swiper('.jl-swiper', {
            loop: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 30, 
            speed: 800,
            grabCursor: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                click: function(swiper, event) {
                    const clickedImg = event.target.closest('img');
                    if (clickedImg) window.openTheatreView(clickedImg.src);
                }
            }
        });
    }

    // --- 3. Work Page Gallery (Mainstream Grid) ---
    const galleryGrid = document.querySelector('.gallery-grid');
    let msnry;

    if (galleryGrid) {
        // FIX: Initialize Masonry IMMEDIATELY (Don't wait for images)
        msnry = new Masonry(galleryGrid, {
            itemSelector: '.gallery-item',
            columnWidth: '.grid-sizer',
            percentPosition: true,
            gutter: 15,
            transitionDuration: 0 // No animation on resize/load for speed
        });

        // FIX: Update layout as each image loads
        imagesLoaded(galleryGrid).on('progress', function() {
            msnry.layout();
        });

        // Filter Logic
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                const filterValue = btn.dataset.filter;

                requestAnimationFrame(() => {
                    galleryItems.forEach(item => {
                        const itemCategory = item.dataset.category;
                        if (filterValue === 'all' || itemCategory === filterValue) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    if (msnry) msnry.layout();
                });
            });
        });

        // Animation: Fade in on scroll
        const images = galleryGrid.querySelectorAll('img.bw-image');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('has-come-into-view');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            images.forEach(img => observer.observe(img));
        } else {
            images.forEach(img => img.classList.add('has-come-into-view'));
        }
    }

    // --- 4. Contact Form ---
    document.querySelectorAll('.contact-form').forEach(form => {
        form.addEventListener('submit', function(e) {
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
                if(btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
            }
        });
    });

    // --- 5. Theatre View ---
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

    window.openTheatreView = function(src) {
        if (!theatreView) createTheatreView();
        theatreImg.src = src;
        theatreView.classList.add('active');
        document.body.classList.add('theatre-view-active');
    };

    function closeTheatreView() {
        if (theatreView) theatreView.classList.remove('active');
        document.body.classList.remove('theatre-view-active');
        setTimeout(() => { if(theatreImg) theatreImg.src = ''; }, 300);
    }

    if (galleryGrid) {
        galleryGrid.addEventListener('click', e => {
            const img = e.target.closest('.gallery-item img');
            if (img) { e.preventDefault(); window.openTheatreView(img.src); }
        });
    }
});