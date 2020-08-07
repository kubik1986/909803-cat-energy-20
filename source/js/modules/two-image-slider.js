/* ----- Скрипт слайдера из двух изображений, изменяющий ширину контейнера верхнего изображения ----- */
'use strict';

(function () {
  const SliderParams = {
    MIN_VALUE: 0,
    MAX_VALUE: 100,
    VALUE_STEP_BY_KEY_PRESS_MULTIPLIER: 0.05
  };

  window.TwoImageSlider = function (exampleSliderElement) {
    this._upperImageBox = exampleSliderElement.querySelector('.slider__img-wrapper--upper');
    this._sliderElement = exampleSliderElement.querySelector('.slider__controls');

    this.slider = new window.Slider({
      sliderElement: this._sliderElement,
      scale: this._sliderElement.querySelector('.slider__inner-range'),
      grip: this._sliderElement.querySelector('.slider__grip'),
      input: this._sliderElement.querySelector('.slider__input'),
      buttons: this._sliderElement.querySelectorAll('.slider__btn'),
      minValue: SliderParams.MIN_VALUE,
      maxValue: SliderParams.MAX_VALUE,
      valueStepByKeyPressMultiplier: SliderParams.VALUE_STEP_BY_KEY_PRESS_MULTIPLIER,
      cb: this._setUpperImageWidth.bind(this)
    });
  };

  window.TwoImageSlider.prototype = {
    _setUpperImageWidth: function (value) {
      this._upperImageBox.style.width = value + '%';
    },
  };
})();
