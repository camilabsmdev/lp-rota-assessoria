document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. HEADER — Fica fixo (scrolled) ao descer, mas é transparente no topo
    // ==========================================================================
    const header = document.getElementById('mainHeader');
    if (header) {
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : 400;

        // Quando ultrapassar ~50% do hero, aplica o estilo "scrolled"
        window.addEventListener('scroll', () => {
            if (window.scrollY > heroHeight * 0.4) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ==========================================================================
    // 2. ANIMAÇÕES DE ENTRADA (Reveal ao scroll via IntersectionObserver)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || 0);
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // 3. CONTADORES NUMÉRICOS — countUp com requestAnimationFrame (60fps)
    //    Acionado por IntersectionObserver, duração de 2000ms conforme definido
    // ==========================================================================
    const counterElements = document.querySelectorAll('.counter-number[data-target]');

    if (counterElements.length > 0) {
        const easeOut = (t) => 1 - Math.pow(1 - t, 3); // easing cúbico

        const animateCounter = (el) => {
            const target   = parseInt(el.dataset.target,  10);
            const duration = parseInt(el.dataset.duration || '2000', 10);
            const prefix   = el.dataset.prefix  || '';
            const suffix   = el.dataset.suffix  || '';
            let startTime  = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed  = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased    = easeOut(progress);
                const current  = Math.round(eased * target);

                el.textContent = `${prefix}${current}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = `${prefix}${target}${suffix}`;
                }
            };

            requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    // ==========================================================================
    // 4. FAQ ACCORDION — Abertura/fechamento com aria-expanded
    // ==========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;

            // Fecha todos primeiro
            faqTriggers.forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                const c = t.nextElementSibling;
                if (c) c.style.maxHeight = '0px';
            });

            // Abre o clicado se estava fechado
            if (!isOpen) {
                trigger.setAttribute('aria-expanded', 'true');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // ==========================================================================
    // 5. MODAL DE PRIVACIDADE
    // ==========================================================================
    const privacyBtn   = document.getElementById('privacyBtn');
    const privacyModal = document.getElementById('privacyModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (privacyBtn && privacyModal) {
        privacyBtn.addEventListener('click', () => {
            privacyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            privacyModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

});
