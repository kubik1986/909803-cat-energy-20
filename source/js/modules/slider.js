/* ----- Скрипт компонента - слайдера ----- */
'use strict';

(function () {
  const GripLeftPositionLimit = { // CSS left в %
    MIN: 0,
    MAX: 100
  };

  const GRIP_GRABBED_CLASS = 'slider__grip--grabbed';

  window.Slider = function (obj) {
    this._element = obj.sliderElement; // контейнер слайдера
    this._scale = obj.scale; // внутренняя шкала слайдера
    this._grip = obj.grip; // ручка слайдера
    this._input = obj.input; // поле текущего значения
    this._buttons = obj.buttons; // кнопки изменения значения
    this._cb = obj.cb; // callback, выполняемый при изменении значения
    this._minValue = obj.minValue; // минимальное значение
    this._maxValue = obj.maxValue; // максимальное значение
    this._value = obj.minValue; // текущее значение слайдера
    this._gripPosition = GripLeftPositionLimit.MIN // координата left ручки слайдера в %
    this._valueStepByKeyPress = obj.valueStepByKeyPressMultiplier * (this._maxValue - this._minValue); // шаг изменения значения слайдера при нажатии стрелок (на основе множителя к шкале значений)

    this._init();
  };

  window.Slider.prototype = {
    _moveGrip: function (gripPosition) {
      this._grip.style.left = gripPosition + '%';
      this._gripPosition = gripPosition;
    },

    _init: function () {
      let self = this;

      self.reset();
      self._grip.addEventListener('mousedown', self._onSwipeStart.bind(self));
      self._grip.addEventListener('touchstart', self._onSwipeStart.bind(self));
      self._grip.addEventListener('keydown', self._onGripKeyDown.bind(self));
      self._buttons.forEach(function (button) {
        button.addEventListener('click', self._onButtonClick.bind(self));
      });
    },

    _updateValue: function (gripPosition) { // gripPosition в %
      this._moveGrip(gripPosition);

      let value = Math.round(gripPosition / 100 * (this._maxValue - this._minValue) + this._minValue);
      this._value = value;
      this._input.value = value;
      this._cb(this._value);
    },

    _getEvent: function () {
      return event.type.search('touch') !== -1 ? event.touches[0] : event;
    },

    _onSwipeStart: function () {
      let self = this;
      let evt = self._getEvent();
      let startX = evt.clientX;
      let gripLeftOffsetPerPixel = (GripLeftPositionLimit.MAX - GripLeftPositionLimit.MIN) / self._scale.offsetWidth;

      self._grip.classList.add(GRIP_GRABBED_CLASS);

      self._clientXCoordinateLimit = {
        min: self._scale.getBoundingClientRect().left,
        max: self._scale.getBoundingClientRect().left + self._scale.offsetWidth
      };

      const _onSwipeAction = function () {
        let moveEvt = self._getEvent();
        let shiftX = startX - moveEvt.clientX;

        startX = moveEvt.clientX;

        let left = Math.round((self._gripPosition - shiftX * gripLeftOffsetPerPixel) * 100) / 100;

        if (left < GripLeftPositionLimit.MIN) {
          left = GripLeftPositionLimit.MIN;
          if (startX < self._clientXCoordinateLimit.min - pageXOffset) {
            startX = self._clientXCoordinateLimit.min - pageXOffset;
          }
        } else if (left > GripLeftPositionLimit.MAX) {
          left = GripLeftPositionLimit.MAX;
          if (startX > self._clientXCoordinateLimit.max - pageXOffset) {
            startX = self._clientXCoordinateLimit.max - pageXOffset;
          }
        }

        self._updateValue(left);
      };

      const _onSwipeEnd = function () {
        document.removeEventListener('mousemove', _onSwipeAction);
        document.removeEventListener('mouseup', _onSwipeEnd);
        document.removeEventListener('touchmove', _onSwipeAction);
        document.removeEventListener('touchend', _onSwipeEnd);

        self._grip.classList.remove(GRIP_GRABBED_CLASS);
        self._grip.blur();
      };

      document.addEventListener('mousemove', _onSwipeAction);
      document.addEventListener('mouseup', _onSwipeEnd);
      document.addEventListener('touchmove', _onSwipeAction);
      document.addEventListener('touchend', _onSwipeEnd);
    },

    _onGripKeyDown: function (evt) {
      if (evt.keyCode === window.utils.KeyCode.RIGHT_ARROW) {
        this.setValue(this._value + this._valueStepByKeyPress);
      } else if (evt.keyCode === window.utils.KeyCode.LEFT_ARROW) {
        this.setValue(this._value - this._valueStepByKeyPress);
      }
    },

    _onButtonClick: function (evt) {
      evt.preventDefault();
      let value = +evt.target.dataset.sliderValue;
      this.setValue(value);
      evt.target.blur();
    },

    setValue: function (value) {
      value = parseInt(value, 10);

      if (!isNaN(value)) {
        if (value < this._minValue) {
          value = this._minValue;
        } else if (value > this._maxValue) {
          value = this._maxValue;
        }

        this._value = Math.round(value);
        this._input.value = this._value;

        let gripPosition = Math.round((this._value - this._minValue) / (this._maxValue - this._minValue) * 100 * 100) / 100;
        this._moveGrip(gripPosition);
        this._cb(this._value);
      }
    },

    reset: function () {
      let viewport = window.utils.getViewport();

      if (viewport == 'mobile') {
        this.setValue(this._minValue);
      } else {
        this.setValue(Math.round((this._minValue + this._maxValue) / 2));
      }
    },

    getValue: function () {
      return this._value;
    },
  };
})();
