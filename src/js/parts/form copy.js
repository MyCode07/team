"use strict"

import { lockPadding } from '../utils/lockPadding.js';

const url = 'https://yanteam.ru/wp-content/themes/blank-sheet/assets/curl.php';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form')
    const thanksPopup = document.querySelector('.popup#thanks');
    const failPopup = document.querySelector('.popup#error');
    const laoder = document.querySelector('.loader');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        removeExistingErrorMsgs(form);
        let error = validateForm(form)
        console.log(error);

        const formData = new FormData(form);

        if (formFile && formFile.files[0]) {
            formData.append('file', formFile.files[0]);
        }

        if (error === 0) {
            form.classList.add('_sending');
            showLoader();

            let response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            console.log('response', response);

            if (response.ok) {
                sentMessage(form)
                form.reset();
                form.classList.remove('_sending');
                hideLoader();

                resetForm()
            }
            else {
                failMessage(form)
                form.classList.remove('_sending');
                hideLoader();
                resetForm()
            }
        }
        else {
            form.classList.remove('_sending');
            resetForm()
        }
    })

    checkCheckBoxes(form)

    function validateForm(form) {
        let error = 0;
        const formReq = [...form.querySelectorAll('[data-required] input')].concat([...form.querySelectorAll('[data-required] textarea')])

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i]

            formRemoveError(input);
            validateInput()

            input.addEventListener('input', function () {
                formRemoveError(input);
                validateInput();
            })

            function validateInput() {
                if (input.getAttribute('type') === 'email') {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                    else {
                        formRemoveError(input);
                    }
                }
                else {
                    if (input.getAttribute('name') === 'phone') {
                        if (/[_]/.test(input.value) || input.value.length < 16) {
                            formAddError(input);
                            error++;
                        } else {
                            formRemoveError(input);
                        }
                    }
                    else {
                        if (input.value.length < 2) {
                            if (input.getAttribute('type') !== 'file') {
                                formAddError(input);
                            }
                            error++;
                        } else {
                            formRemoveError(input);
                        }
                    }
                }
            }
        }

        const checkBoxContainers = form.querySelectorAll('[data-checkbox-container]')
        let checkedArr = [];
        for (let i = 0; i < checkBoxContainers.length; i++) {
            const checkBoxes = [...checkBoxContainers[i].querySelectorAll('input')]

            checkBoxes.forEach(input => {
                input.addEventListener('input', function () {
                    input.closest('[data-checkbox-container]').classList.remove('_error')
                    removeElemErrorMsg(checkBoxContainers[i])
                })
            })

            checkedArr.push(checkBoxes.some(input => {
                if (!input.checked) {
                    input.closest('[data-checkbox-container]').classList.add('_error')
                }
                else {
                    input.closest('[data-checkbox-container]').classList.remove('_error')
                }
                return input.checked
            }))
        }

        checkedArr.forEach((elem, i) => {
            if (elem == true) {
                removeElemErrorMsg(checkBoxContainers[i])
            }
            else {
                addErrorMsg(checkBoxContainers[i], checkBoxContainers[i].closest('.form__group').querySelector('p').textContent)
            }
        });


        const checked = checkedArr.every(check => { return check == true })
        if (!checked === true) error++

        return error;
    }

    function formAddError(input) {
        input.closest('.form__item').classList.add('_error');
        addErrorMsg(input, input.placeholder)
    }

    function formRemoveError(input) {

        input.closest('.form__item').classList.remove('_error');
        removeElemErrorMsg(input)

        const submitBtnBlock = input.closest('form').querySelector('.error-msgs')
        const existMsgs = submitBtnBlock.querySelectorAll('[data-id]')

        if (!existMsgs.length) {
            submitBtnBlock.classList.add('_hide')
            removeExistingErrorMsgs(input.closest('form'));
        }
    }

    function addErrorMsg(elem, text) {
        removeElemErrorMsg(elem)
        const submitBtnBlock = elem.closest('form').querySelector('.error-msgs')
        const item = `<i data-id="${elem.id}">${text},</i>`
        submitBtnBlock.classList.remove('_hide')
        submitBtnBlock.querySelector('span').insertAdjacentHTML('beforeend', item)
    }

    function removeElemErrorMsg(elem) {
        const msg = elem.closest('form').querySelector(`.error-msgs [data-id="${elem.id}"]`)
        if (msg) {
            msg.remove();
        }
    }

    function removeExistingErrorMsgs(form) {
        const existMsgs = form.querySelectorAll('.error-msgs [data-id]')
        if (existMsgs.length) {
            existMsgs.forEach(m => m.remove())
        }
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    function sentMessage() {
        const activePopup = document.querySelector('.popup._open');
        if (activePopup) activePopup.classList.remove('_open');

        thanksPopup.classList.add('_open')
        lockPadding();

        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    }

    function failMessage() {
        failPopup.classList.add('_open')
        lockPadding();

        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    }

    function hideLoader() {
        laoder.classList.remove('_open')
    }

    function showLoader() {
        laoder.classList.add('_open')
    }

    function resetForm() {
        if (formFile) {
            const fileElem = formFile.closest('.form__item')
            const fileNameElem = fileElem.querySelector('.filename');
            const deleteFileElem = fileElem.querySelector('._delete-file');

            fileNameElem.innerHTML = '+Прикрепить файл';
            formFile.value = '';

            deleteFileElem.classList.remove('_active');
        }
    }

    const formFile = document.querySelector('input[name="file"]');
    if (formFile) {
        const fileElem = formFile.closest('.form__item')
        const fileNameElem = fileElem.querySelector('.filename');
        const deleteFileElem = fileElem.querySelector('._delete-file');

        formFile.addEventListener('change', () => {
            if (formFile.files[0]) {
                uploadFile(formFile.files[0]);
            }
        });

        deleteFileElem.addEventListener('click', () => {
            fileNameElem.innerHTML = '+Прикрепить файл';
            formFile.value = '';

            deleteFileElem.classList.remove('_active');
        })

        function uploadFile(file) {

            if (!['application/msword', 'application/pdf', 'application/vnd.ms-powerpoint', 'text/plain'].includes(file.type)) {
                alert('Разрешены только текстовые документы.');
                document.querySelector('#filename').innerHTML = '';
                formFile.value = '';
                return;
            }
            if (file.size > 2 * (1024 * 1024)) {
                alert('Файл должен быть менее 2 МБ.');
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                fileNameElem.innerHTML = file.name;
                deleteFileElem.classList.add('_active');
            };

            reader.onerror = function (e) {
                alert('Ошибка');
            };

            reader.readAsDataURL(file);
        }
    }

    const telegramInput = document.querySelector('input[name="telegram"]');
    const contactCheckboxes = document.querySelectorAll('#conn-type input');
    if (contactCheckboxes.length) {
        contactCheckboxes.forEach(input => {
            input.addEventListener('change', () => {
                if (input.id === 'contact-tg' && input.checked) {
                    telegramInput.setAttribute('placeholder', 'Telegram *')
                    telegramInput.closest('.form__item').setAttribute('data-required', true)
                }
                else {
                    telegramInput.setAttribute('placeholder', 'Telegram')
                    telegramInput.closest('.form__item').removeAttribute('data-required')
                    telegramInput.closest('.form__item').classList.remove('_error')
                }
            })
        })
    }
});

function checkCheckBoxes(form) {
    const checkBoxContainers = form.querySelectorAll('[data-checkbox-container]')
    if (checkBoxContainers.length) {
        checkBoxContainers.forEach(container => {
            const cehckboxes = container.querySelectorAll('input[type="checkbox"]')
            if (cehckboxes.length) {
                cehckboxes.forEach(checkbox => {
                    checkbox.addEventListener('input', () => {
                        cehckboxes.forEach(item => {
                            if (item != checkbox) {
                                item.checked = false
                            }
                        })
                    })
                })
            }
        })
    }
}

const fileDeleteBtn = document.querySelector('._delete-file');
if (fileDeleteBtn) {
    fileDeleteBtn.addEventListener('click', (e) => {
        document.querySelector('.filename').innerHTML = '+ Прикрепить файл';
        e.target.classList.remove('_active');
    })
}