const selectSpan = document.querySelector('#upload-icon');
const form = document.querySelector('#upload-form');
const formInput = document.querySelector('#upload-form input');

selectSpan.addEventListener('click', function () {
    formInput.click();
});

formInput.addEventListener('change', function () {
    form.submit();
});
