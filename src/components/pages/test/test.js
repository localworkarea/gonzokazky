

const testPage = document.querySelector('.test');
const heroTest = testPage.querySelector('.hero-test');
const formTest = testPage.querySelector('.form-test');
const startBtn = testPage.querySelector('.body-sections__btn');

if (heroTest && formTest && startBtn) {
  startBtn.addEventListener('click', () => {
    heroTest.classList.add('_up');
    formTest.classList.remove('_dwn');
  });
}
