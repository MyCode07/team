import gsap from "gsap/all";

let frontpageLoader = document.querySelector('.frontpage-loader');

export function animations() {
    if (!frontpageLoader) return;

    gsap.to('.header__animate-item', {
        duration: 1,
        y: '0%',
        ease: 'texttshow',
        delay: 5.4
    });

    gsap.to('.images', {
        y: 0,
        duration: 1.35,
        ease: 'Pagtrans',
        delay: 4.3
    });

    gsap.to('.swiper-btns', {
        duration: 1,
        y: 0,
        ease: 'texttshow',
        delay: 5.4
    });

    gsap.to('.menu-line', {
        duration: 1,
        y: 0,
        ease: 'texttshow',
        delay: 5.4
    });


    gsap.to('.words .first-word', {
        duration: 1.8,
        y: '0',
        ease: 'texttshow',
        delay: 4.8
    });

    gsap.to('.footer__animate-item', {
        duration: 1,
        y: '0%',
        ease: 'texttshow',
        delay: 5.4
    });

    pageLoader();
}

function pageLoader() {

    if (!frontpageLoader) return;

    gsap.to('.frontpage-loader__counter div', {
        duration: 0.5,
        y: '0%',
        ease: 'texttshow',
        delay: 0.5
    });

    gsap.to('.frontpage-loader__counter .number', {
        innerText: 100,
        duration: 1.7,
        delay: 1.8,
        snap: { innerText: 1 },
        onUpdate: function () {
            const counterElement = document.querySelector('.frontpage-loader__counter .number');
            counterElement.innerText = Math.ceil(counterElement.innerText);
        },
        onComplete: function () {
            gsap.to('.frontpage-loader__counter div', {
                duration: 0.5,
                y: '-100%',
                ease: 'texttshow',
                delay: 0.15
            });
        }
    });

    gsap.to('.loader-text', {
        duration: 1.35,
        y: '0%',
        ease: 'texttshow',
        delay: 0.5
    });

    gsap.to('.loader-text', {
        duration: 1.50,
        y: '-100%',
        ease: 'texttshow',
        delay: 3.6
    });

    // Animate frontpage-loader out
    gsap.to('.frontpage-loader', {
        duration: 1.35,
        y: '-100%',
        ease: 'Pagtrans',
        delay: 4.3, // Delay after all headers
        onComplete: () => {
            frontpageLoader.style.display = 'none'; // Hide loader after animation
        }
    });
}