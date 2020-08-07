'use strict';

(function () {
  let mainNavElement = document.querySelector('.main-nav');
  let exampleSliderElement = document.querySelector('.example__slider');

  let mainNav = new window.MainNav(mainNavElement);
  let exampleSlider;

  if (exampleSliderElement) {
    exampleSlider = new window.TwoImageSlider(exampleSliderElement);
  }
})();
