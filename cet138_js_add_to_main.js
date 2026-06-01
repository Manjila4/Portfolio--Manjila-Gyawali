
/* ================================
   CET138 PAGE JAVASCRIPT
   Add this at the bottom of main.js
================================ */

document.addEventListener('DOMContentLoaded', function () {
  const cetCounterBtn = document.getElementById('cetCounterBtn');
  const cetCounterValue = document.getElementById('cetCounterValue');
  let cetCount = 0;

  if (cetCounterBtn && cetCounterValue) {
    cetCounterBtn.addEventListener('click', function () {
      cetCount++;
      cetCounterValue.textContent = cetCount;
    });
  }

  const colourSelect = document.getElementById('colourSelect');
  const jsColourBox = document.getElementById('jsColourBox');

  if (colourSelect && jsColourBox) {
    colourSelect.addEventListener('change', function () {
      jsColourBox.classList.remove('dark', 'blue');

      if (colourSelect.value === 'dark') {
        jsColourBox.classList.add('dark');
      }

      if (colourSelect.value === 'blue') {
        jsColourBox.classList.add('blue');
      }
    });
  }
});
