import gsap from "gsap";

const popup = document.querySelector(`.popup`);
const popupScroll = document.querySelector('.popup-scroll');
let positioned = false

document.addEventListener('click', function (e) {
    let targetEl = e.target;


    if (targetEl.hasAttribute('data-popup')) {
        targetEl.disabled = true

        const activeBtn = document.querySelector('[data-popup]._active');
        const allpopupItems = document.querySelectorAll('.popup-item');
        const popupItem = popup.querySelector(`#${targetEl.dataset.popup}`);

        if (activeBtn && activeBtn.dataset.popup != targetEl.dataset.popup) {
            activeBtn.classList.remove('_active')
        }

        allpopupItems.forEach(item => {
            item.classList.remove('_active')
            item.style.display = 'none'
        });
        popupItem.style.display = 'block'

        targetEl.classList.toggle('_active')
        setBtnPosition(targetEl)
        popupScroll.scrollTop = 0

        gsap.to(popup, {
            left: targetEl.dataset.left,
            top: targetEl.dataset.top,
            duration: 0,
            onComplete: () => {
                if (targetEl.classList.contains('_active')) {
                    popup.classList.add('_open')
                    popupItem.classList.add('_active')
                } else {
                    popup.classList.remove('_open')
                    popupItem.classList.remove('_active')
                    setTimeout(() => {
                        popupItem.style.display = 'none'
                    }, 600);
                }
                targetEl.disabled = false
            }
        })
    }
})


function setBtnPosition(target) {
    const coords = target.getBoundingClientRect();

    target.dataset.left = coords.left + coords.width / 2
    target.dataset.top = coords.bottom + window.innerWidth / 100
}