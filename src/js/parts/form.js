"use strict"

const url = 'https://yanteam.ru/wp-content/themes/blank-sheet/assets/curl.php';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.popup form')
    const thanksPopup = document.querySelector('.popup#thanks');
    const failPopup = document.querySelector('.popup#error');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        removeExistingErrorMsgs(form);
        let error = validateForm(form)
        console.log('Total errors:', error);

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

            // Убираем добавление слушателей внутри цикла валидации
            // Они должны добавляться один раз при инициализации

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

        // Обработка чекбоксов
        const checkBoxContainers = form.querySelectorAll('[data-checkbox-container]')
        let checkedArr = [];
        for (let i = 0; i < checkBoxContainers.length; i++) {
            const checkBoxes = [...checkBoxContainers[i].querySelectorAll('input')]

            const isChecked = checkBoxes.some(input => input.checked)
            checkedArr.push(isChecked)

            if (!isChecked) {
                checkBoxContainers[i].classList.add('_error')
                const label = checkBoxContainers[i].closest('.form__group').querySelector('p')
                if (label) {
                    addErrorMsg(checkBoxContainers[i], label.textContent)
                }
            }
            else {
                checkBoxContainers[i].classList.remove('_error')
                removeElemErrorMsg(checkBoxContainers[i])
            }
        }

        const allChecked = checkedArr.every(check => check === true)
        if (!allChecked) error++

        return error;
    }

    function formAddError(input) {
        input.closest('.form__item').classList.add('_error');
        addErrorMsg(input, input.placeholder)
    }

    function formRemoveError(input) {
        input.closest('.form__item').classList.remove('_error');
        removeElemErrorMsg(input)

        // Проверяем, остались ли еще ошибки
        const submitBtnBlock = input.closest('form').querySelector('.error-msgs')
        const existMsgs = submitBtnBlock.querySelectorAll('[data-id]')

        if (existMsgs.length === 0) {
            submitBtnBlock.classList.add('_hide')
        }
    }

    function addErrorMsg(elem, text) {
        const submitBtnBlock = elem.closest('form').querySelector('.error-msgs')

        // Проверяем, существует ли уже сообщение для этого элемента
        const existingMsg = submitBtnBlock.querySelector(`[data-id="${elem.id || elem.getAttribute('name')}"]`)
        if (existingMsg) {
            return; // Если сообщение уже есть, не добавляем дубликат
        }

        const elemId = elem.id || elem.getAttribute('name')
        if (!elemId) return; // Если нет идентификатора, не можем добавить сообщение

        const item = `<i data-id="${elemId}">${text},</i>`
        submitBtnBlock.classList.remove('_hide')
        submitBtnBlock.querySelector('span').insertAdjacentHTML('beforeend', item)
    }

    function removeElemErrorMsg(elem) {
        const elemId = elem.id || elem.getAttribute('name')
        if (!elemId) return;

        const form = elem.closest('form')
        const msg = form.querySelector(`.error-msgs [data-id="${elemId}"]`)
        if (msg) {
            msg.remove();
        }

        // Проверяем, остались ли еще ошибки
        const submitBtnBlock = form.querySelector('.error-msgs')
        const existMsgs = submitBtnBlock.querySelectorAll('[data-id]')

        if (existMsgs.length === 0) {
            submitBtnBlock.classList.add('_hide')
        }
    }

    function removeExistingErrorMsgs(form) {
        const existMsgs = form.querySelectorAll('.error-msgs [data-id]')
        if (existMsgs.length) {
            existMsgs.forEach(m => m.remove())
        }

        // Скрываем блок ошибок
        const submitBtnBlock = form.querySelector('.error-msgs')
        if (submitBtnBlock) {
            submitBtnBlock.classList.add('_hide')
        }
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    function sentMessage() {

    }

    function failMessage() {

    }

    function hideLoader() {
    }

    function showLoader() {
    }

    function resetForm() {
        if (formFile) {
            const fileElem = formFile.closest('.form__item')
            const fileNameElem = fileElem.querySelector('.filename');
            const deleteFileElem = fileElem.querySelector('._delete-file');

            if (fileNameElem) fileNameElem.innerHTML = '+Прикрепить файл';
            formFile.value = '';

            if (deleteFileElem) deleteFileElem.classList.remove('_active');
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

        if (deleteFileElem) {
            deleteFileElem.addEventListener('click', () => {
                if (fileNameElem) fileNameElem.innerHTML = '+Прикрепить файл';
                formFile.value = '';
                deleteFileElem.classList.remove('_active');
            })
        }

        function uploadFile(file) {
            if (!['application/msword', 'application/pdf', 'application/vnd.ms-powerpoint', 'text/plain'].includes(file.type)) {
                alert('Разрешены только текстовые документы и PDF.');
                if (fileNameElem) fileNameElem.innerHTML = '+Прикрепить файл';
                formFile.value = '';
                return;
            }
            if (file.size > 2 * (1024 * 1024)) {
                alert('Файл должен быть менее 2 МБ.');
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                if (fileNameElem) fileNameElem.innerHTML = file.name;
                if (deleteFileElem) deleteFileElem.classList.add('_active');
            };

            reader.onerror = function (e) {
                alert('Ошибка при чтении файла');
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
                    if (telegramInput) {
                        telegramInput.setAttribute('placeholder', 'Telegram *')
                        telegramInput.closest('.form__item').setAttribute('data-required', true)
                    }
                }
                else {
                    if (telegramInput) {
                        telegramInput.setAttribute('placeholder', 'Telegram')
                        telegramInput.closest('.form__item').removeAttribute('data-required')
                        telegramInput.closest('.form__item').classList.remove('_error')
                    }
                }
            })
        })
    }

    // Добавляем слушатели событий для валидации в реальном времени
    const formInputs = form.querySelectorAll('[data-required] input, [data-required] textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function () {
            const item = input.closest('.form__item');
            if (item && item.classList.contains('_error')) {
                // Проверяем, исправлена ли ошибка
                let hasError = false;

                if (input.getAttribute('type') === 'email') {
                    hasError = emailTest(input);
                } else if (input.getAttribute('name') === 'phone') {
                    hasError = /[_]/.test(input.value) || input.value.length < 16;
                } else {
                    hasError = input.value.length < 2;
                }

                if (!hasError) {
                    formRemoveError(input);
                }
            }
        })
    });
});

function checkCheckBoxes(form) {
    const checkBoxContainers = form.querySelectorAll('[data-checkbox-container]')
    if (checkBoxContainers.length) {
        checkBoxContainers.forEach(container => {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]')
            if (checkboxes.length) {
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('input', () => {
                        checkboxes.forEach(item => {
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
        const filename = document.querySelector('.filename');
        if (filename) filename.innerHTML = '+ Прикрепить файл';
        e.target.classList.remove('_active');
    })
}