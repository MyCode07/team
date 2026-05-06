import Swiper from 'swiper';
import { Navigation, Keyboard, Mousewheel, Pagination, FreeMode } from 'swiper/modules';
import gsap from "gsap";

if (document.querySelector('.main-swiper')) {

    const wrappers = document.querySelectorAll('.image-wrapper');
    const menuLine = document.querySelector('.menu-line');
    const images = document.querySelector('.images');
    const sliderMenu = document.querySelector('.menu-swiper');
    const wordsWrap = document.querySelector(".words");
    const words = wordsWrap.querySelectorAll("span");

    let prevIndex = 0;
    let inSync = false;


    function animateWord(index, direction = 1) {
        const current = words[index].querySelectorAll('i');
        const prev = words[prevIndex].querySelectorAll('i');

        if (!current || !prev) return;

        // 👉 СТАРЫЙ УХОДИТ
        gsap.to(prev, {
            y: direction === 1 ? -100 + '%' : 100 + '%',
            duration: 1.2,
            ease: "power4.out"
        });

        // 👉 НОВЫЙ ВХОДИТ
        gsap.fromTo(current,
            {
                y: direction === 1 ? 100 + '%' : -100 + '%'
            },
            {
                y: 0,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.3
            }
        );

        prevIndex = index;
    }

    function splitWords(el) {
        el.innerHTML = el.textContent
            .trim()
            .split(" ")
            .map(word => `<i>${word}</i>`)
            .join(" ");
    }


    const swiper = new Swiper(".main-swiper .swiper", {
        modules: [Navigation, Pagination, Keyboard, Mousewheel],

        slidesPerView: 1,
        loop: true,
        speed: 1200,

        pagination: {
            el: ".pagination",
            type: "fraction",
        },

        navigation: {
            prevEl: '.prev',
            nextEl: '.next'
        },

        mousewheel: true,
        keyboard: true,

        on: {
            init(swiper) {
                document.querySelectorAll(".words span").forEach(splitWords);

                wrappers.forEach((el, i) => {
                    gsap.set(el, {
                        clipPath: i === 0
                            ? "inset(0% 0% 0% 0%)"
                            : "inset(0% 100% 0% 0%)",
                        zIndex: i === 0 ? 2 : 1,
                        display: i === 0 ? "block" : "none"
                    });
                });

                prevIndex = swiper.realIndex;
                animateWord(0);
            },

            slideChangeTransitionStart(swiper) {
                const currentIndex = swiper.realIndex;

                const currentEl = wrappers[currentIndex];
                const prevEl = wrappers[prevIndex];

                if (!currentEl || !prevEl) return;

                const isForward = swiper.activeIndex > swiper.previousIndex;

                const fromClip = isForward
                    ? "inset(0% 0% 0% 100%)"
                    : "inset(0% 100% 0% 0%)";

                wrappers.forEach((el, i) => {
                    if (i === currentIndex || i === prevIndex) {
                        el.style.display = "block";
                    } else {
                        el.style.display = "none";
                    }
                });

                gsap.set(currentEl, { zIndex: 3 });
                gsap.set(prevEl, { zIndex: 2 });

                gsap.fromTo(currentEl,
                    { clipPath: fromClip },
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: 1.2,
                        ease: "power4.inOut",
                        onComplete: () => {
                            wrappers.forEach((el, i) => {
                                if (i !== currentIndex) {
                                    el.style.display = "none";
                                }
                            });
                        }
                    }
                );

                const direction = swiper.activeIndex > swiper.previousIndex ? 1 : -1;

                animateWord(currentIndex, direction);


                // Синхронизация с меню-слайдером
                if (!inSync && swipermenu && !swipermenu.destroyed) {
                    inSync = true;
                    swipermenu.slideToLoop(currentIndex, 1200); // та же скорость
                    inSync = false;
                }

                console.log('isFull', isFull);
                const scaled = document.querySelector('._scaled');
                if (scaled) {
                    animateToFull(scaled, 0)
                }

                prevIndex = currentIndex;

            }
        }
    });

    const swipermenu = new Swiper(".menu-swiper .swiper", {
        speed: 1200,
        breakpoints: {
            300: {
                slidesPerView: 1.2,
            },
            769: {
                slidesPerView: 2.2,
            }
        }
    });


    document.addEventListener('click', function (e) {
        let targetEl = e.target;

        if (targetEl.classList.contains('menu-toggle')) {
            closePopup();
            targetEl.disabled = true
            swiper.disable()

            targetEl.classList.toggle('_active')
            targetEl.style.pointerEvents = 'none';

            const bottom = document.querySelector('.footer').getBoundingClientRect().height;

            const activeWord = words[swiper.realIndex].querySelectorAll('i');
            const activeImage = wrappers[swiper.realIndex];
            const menuImg = swipermenu.slides[swiper.realIndex];
            console.log(activeWord);

            if (targetEl.classList.contains('_active')) {
                animateToMenu(activeImage, menuImg)

                gsap.to(".swiper-controls", {
                    bottom: bottom,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.inOut",
                    onComplete: () => {
                        targetEl.style.pointerEvents = 'all';
                        wordsWrap.style.display = 'none';
                        menuLine.classList.add('_noborder')
                        sliderMenu.classList.add('_open')
                        activeImage.style.display = 'block';


                        gsap.to(images, {
                            duration: 0.8,
                            display: 'none'
                        })

                        gsap.to('.menu-swiper .swiper-slide img', {
                            clipPath: "inset(0% 0% 0% 0%)",
                            stagger: 0.05,
                            duration: 0.8,
                            ease: "power4.inOut",
                            onComplete: () => {
                                targetEl.disabled = false
                                swiper.enable()
                            }
                        })

                    }
                });

                gsap.to(activeWord, {
                    y: '-100%',
                    duration: 1.2,
                    ease: "power3.inOut",
                });

            } else {
                menuLine.classList.remove('_noborder')

                images.style.display = 'block';
                activeImage.style.display = 'block'
                wordsWrap.style.display = 'block';

                animateToFullMenuImg(activeImage, menuImg)

                gsap.to('.menu-swiper .swiper-slide img', {
                    clipPath: "inset(100% 0% 0% 0%)",
                    duration: 1.2,
                    stagger: 0.05,
                    delay: 0.3,
                    ease: "power4.inOut",
                    onComplete: () => {
                        targetEl.style.pointerEvents = 'all';
                        targetEl.disabled = false
                        swiper.enable()
                        sliderMenu.classList.remove('_open')
                    }
                })

                gsap.fromTo(activeWord,
                    {
                        y: '-100%',
                        duration: 0,
                    },
                    {
                        y: 0,
                        duration: 1.2,
                        ease: "power3.inOut",
                    }
                )

                gsap.to(".swiper-controls", {
                    bottom: '50%',
                    y: '50%',
                    duration: 1.2,
                    ease: "power3.inOut",
                    onComplete: () => {
                    }
                })
            }
        }
    })

    function closePopup() {

    }

    function animateToFullMenuImg(activeImage, menuImg) {
        const { x, y, width, height } = getTargetData(menuImg);

        gsap.to(activeImage, {
            x: x,
            y: y,
            width: width,
            height: height,
            duration: 0,
            ease: "power3.inOut",
            onComplete: () => {
                animateToFull(activeImage)
            }
        });


        isFull = false;
    }


    let isFull = true;
    const fullW = window.innerWidth;
    const fullH = window.innerHeight;

    function getTargetData(menuImg) {
        const rect = menuImg.getBoundingClientRect();

        // На сколько нужно сдвинуть и смасштабировать, чтобы
        // fullscreen-картинка совпала с карточкой меню
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
        };
    }

    function animateToMenu(activeImage, menuImg, index) {
        const { x, y, width, height } = getTargetData(menuImg);

        gsap.to(activeImage, {
            x: x,
            y: y,
            width: width,
            height: height,
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: () => {
                activeImage.classList.add('_scaled')
                activeImage.style.display = 'none'
            }
        });

        isFull = false;
    }

    function animateToFull(activeImage, duration = 1.2) {
        gsap.to(activeImage, {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            duration: duration,
            ease: "power3.inOut",
            onComplete: () => {
                activeImage.classList.remove('_scaled')
            }
        });

        isFull = true;
    }
}
