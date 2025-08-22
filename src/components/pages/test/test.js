


document.addEventListener('DOMContentLoaded', () => {
 
  const test = document.querySelector('.test');
  if (!test) return;

  const hero = test.querySelector('.hero-test');
  const form = test.querySelector('.form-test');
  const startBtn = test.querySelector('.body-sections__btn');

  const slides = Array.from(form.querySelectorAll('.item-test'));
  const snacks = Array.from(form.querySelectorAll('.form-test__snacks-item'));

  const prevBtn = form.querySelector('.btn-prev');
  const nextBtn = form.querySelector('.btn-next');
  const stepCounter = form.querySelector('.form-test__steps span');

  let currentIndex = 0;

  const updateSteps = () => {
    // Обновляем _active на шаге
    slides.forEach((slide, i) => {
      slide.classList.toggle('_active', i === currentIndex);
    });

    // Обновляем _active на фоне
    snacks.forEach((snack, i) => {
      snack.classList.toggle('_active', i === currentIndex);
    });

    // Обновляем шаг в счётчике
    stepCounter.textContent = currentIndex + 1;

    // prev активен только начиная со 2 шага
    if (currentIndex === 0) {
      prevBtn.classList.add('_disabled');
    } else {
      prevBtn.classList.remove('_disabled');
    }
  };

  // Обработчики кликов
  prevBtn?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSteps();
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSteps();
    } else {
      const rangeElements = test.querySelectorAll('[data-fls-range]');
      const values = Array.from(rangeElements).map(slider => {
        const handle = slider.querySelector('.noUi-handle');
        return parseFloat(handle.getAttribute('aria-valuenow')) || 0;
      });

      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

      const results = test.querySelectorAll('.test__result');
      results.forEach(el => el.classList.remove('_result-active'));

      let resultId = '';

      if (avg <= 1.25) {
        resultId = 'result-a';
      } else if (avg <= 2.5) {
        resultId = 'result-b';
      } else if (avg <= 3.75) {
        resultId = 'result-d';
      } else {
        resultId = 'result-c';
      }

        console.log(`Середнє значення: ${avg.toFixed(2)}`);
      console.log(`блок: #${resultId}`);

      // Показываем нужный результат
      const resultEl = document.getElementById(resultId);
      if (resultEl) {
        resultEl.classList.add('_result-active');
      }

      const logo =  document.querySelector(".logo-main__picture");
      if (logo) {
        logo.style.opacity = '0';
        logo.style.pointerEvents = 'none';
      }
    }
  });


  startBtn?.addEventListener('click', () => {
    hero.classList.add('_up');
    form.classList.remove('_dwn');

    if (!snacks[0].classList.contains('_active')) {
      snacks[0].classList.add('_active');
    }

    currentIndex = 0;
    updateSteps();
  });







  // Хранилище состояния копирования для каждой result
  const copiedResults = new Set();

  // Все блоки результатов
  const resultBlocks = document.querySelectorAll('.test__result');

  resultBlocks.forEach((block) => {
    const copyBtn = block.querySelector('.copy-btn');
    const linkBtn = block.querySelector('.link-btn');
    const resultTextEl = block.querySelector('.result-test__result p');

    if (!copyBtn || !linkBtn || !resultTextEl) return;

    const resultId = block.id; // уникальный id блока (например result-a)

    // Создать подсказку
    const messageEl = document.createElement('div');
    messageEl.className = 'copy-message';
    block.querySelector('.result-test__buttons').style.position = 'relative';
    block.querySelector('.result-test__buttons').appendChild(messageEl);

    function showMessage(text) {
      messageEl.textContent = text;
      messageEl.style.opacity = '1';
      setTimeout(() => {
        messageEl.style.opacity = '0';
      }, 1500);
    }

    function copyToClipboard(text) {
      const tempTextarea = document.createElement('textarea');
      tempTextarea.readOnly = true;
      tempTextarea.value = text;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      tempTextarea.setSelectionRange(0, text.length);
      document.execCommand('copy');
      document.body.removeChild(tempTextarea);
    }

    copyBtn.addEventListener('click', () => {
      const text = `Я ${resultTextEl.textContent.trim()}`;
      copyToClipboard(text);
      copiedResults.add(resultId); // помечаем, что результат скопирован
      showMessage('Результат скопійовано');
      messageEl.classList.remove('_error');
      messageEl.classList.add('_ok');
    });

    linkBtn.addEventListener('click', (e) => {
      if (!copiedResults.has(resultId)) {
        e.preventDefault();
        showMessage('Спочатку скопіюй результат');
        messageEl.classList.add('_error');
      }
    });
  });
});
