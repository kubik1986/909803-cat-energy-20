/* ----- Скрипт открытия/закрытия меню на мобильных ----- */
'use strict';

(function () {
  const mainNav = document.querySelector('.main-nav');
  const navToggle = mainNav.querySelector('.main-nav__toggle');
  const navToggleText = navToggle.children[0];

  mainNav.classList.add('main-nav--closed');

  navToggle.addEventListener('click', function() {
    if (mainNav.classList.contains('main-nav--closed')) {
      mainNav.classList.remove('main-nav--closed');
      mainNav.classList.add('main-nav--opened');
      navToggleText.textContent = 'Закрыть меню';
    } else {
      mainNav.classList.remove('main-nav--opened');
      mainNav.classList.add('main-nav--closed');
      navToggleText.textContent = 'Открыть меню';
    }
  });
})();
