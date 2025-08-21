// Підключення з node_modules
import * as noUiSlider from 'nouislider';

// Підключення стилів з scss/base/forms/range.scss 
import './range.scss';

// Підключення стилів з node_modules
// import 'nouislider/dist/nouislider.css';

// export function rangeInit() {
// 	const priceSlider = document.querySelectorAll('[data-fls-range]')
// 	if (priceSlider.length > 0) {
// 		priceSlider.forEach((item) => {

// 			let textFrom = item.getAttribute('data-fls-range-from')
// 			let textTo = item.getAttribute('data-fls-range-to')
// 			noUiSlider.create(item, {
// 				start: 2.5, // [0,200000]
// 				connect: [true, false],
// 				range: {
// 					'min': [0],
// 					'max': [5]
// 				},
// 				// format:''
// 			});
// 		});

// 	}
// }
// document.querySelector('[data-fls-range]') ?
// 	window.addEventListener('load', rangeInit) : null


	function rangeInit() {
  const sliders = document.querySelectorAll('[data-fls-range]');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    noUiSlider.create(slider, {
      start: 2.5,
      connect: [true, false],
      range: {
        min: 0,
        max: 5,
      },
    });

    slider.noUiSlider.on('update', (values, handle) => {
      const value = parseFloat(values[handle]);
      const item = slider.closest('.item-test');
      if (!item) return;

      const leftSpan = item.querySelector('.item-test__left .item-test__img span');
      const rightSpan = item.querySelector('.item-test__right .item-test__img span');

      if (leftSpan && rightSpan) {
        // Нормализуем: value 0..5 → коэф. 0..1
        const progress = value / 5;

        // Левый: от 1 → 0, Правый: от 0 → 1
        leftSpan.style.opacity = `${1 - progress}`;
        rightSpan.style.opacity = `${progress}`;
      }
    });
  });
}

if (document.querySelector('[data-fls-range]')) {
  window.addEventListener('load', rangeInit);
}
