import "./btn.scss"

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-fls-btn]').forEach((btn) => {
    const starsLayer = document.createElement('div');
    starsLayer.classList.add('btn-stars');
    btn.appendChild(starsLayer);

    const REF_W = 290;
    const REF_H = 70;

    const starsData = [
      { x: 10, y: 15, size: 12, opacity: 1},
      { x: 40, y: 60, size: 16, opacity: 1},
      { x: 80, y: 20, size: 20, opacity: 1},
      { x: 120, y: 50, size: 14, opacity:1 },
      { x: 160, y: 10, size: 18, opacity:1 },
      { x: 200, y: 40, size: 15, opacity:1 },
      { x: 240, y: 25, size: 13, opacity:1 },
      { x: 260, y: 60, size: 17, opacity:1 },
      { x: 280, y: 15, size: 11, opacity:1 },
      { x: 150, y: 30, size: 19, opacity:1 },
      { x: 60, y: 45, size: 13, opacity: 1}
    ];

    const btnRect = btn.getBoundingClientRect();
    const scaleX = btnRect.width / REF_W;
    const scaleY = btnRect.height / REF_H;

    starsData.forEach((star, i) => {
      const img = document.createElement('img');
      img.src = 'assets/img/icons/star.svg';
      img.classList.add('btn-star');

      img.style.width = `${star.size * scaleX}px`;
      img.style.height = `${star.size * scaleY}px`;
      img.style.left = `${star.x * scaleX}px`;
      img.style.top = `${star.y * scaleY}px`;
      img.style.opacity = star.opacity;

      img.style.animationDelay = `${Math.random() * 1.5}s`;
      img.style.animationDuration = `${1 + Math.random() * 0.3}s`;

      starsLayer.appendChild(img);
    });
  });

});