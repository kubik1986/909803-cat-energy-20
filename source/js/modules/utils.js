/* ----- Утилитные переменные и функции ----- */
'use strict';

(function () {
  const KeyCode = {
    ESC: 27,
    ENTER: 13,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39
  };

  const Breakpoints = {
    TABLET: 768,
    DESKTOP: 1300,
  };

  window.utils = {
    KeyCode: KeyCode,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

    onEscPress: function (evt, cb) {
      if (evt.keyCode === KeyCode.ESC) {
        evt.preventDefault();
        cb();
      }
    },

    getViewport: function () {
      let viewportWidth = window.innerWidth;
      let viewport;
      if (viewportWidth < Breakpoints.TABLET) {
        viewport = "mobile";
      } else if (viewportWidth >= Breakpoints.TABLET && viewportWidth < Breakpoints.DESKTOP) {
        viewport = "tablet";
      } else {
        viewport = "desktop";
      }
      return viewport;
    }
  };
})();
