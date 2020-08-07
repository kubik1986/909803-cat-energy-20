/* ----- Скрипт открытия/закрытия меню на мобильных ----- */
'use strict';

(function () {
  const MainNavClasses = {
    CLOSED: 'main-nav--closed',
    OPENED: 'main-nav--opened',
  };

  window.MainNav = function (mainNavElement) {
    this._element = mainNavElement;
    this._toggle = mainNavElement.querySelector('.main-nav__toggle');
    this._navToggleText = this._toggle.children[0];

    this._init();
  };

  window.MainNav.prototype = {
    _init: function () {
      let self = this;
      self._element.classList.add(MainNavClasses.CLOSED);

      self._toggle.addEventListener('click', function() {
        if (self._element.classList.contains(MainNavClasses.CLOSED)) {
          self._element.classList.remove(MainNavClasses.CLOSED);
          self._element.classList.add(MainNavClasses.OPENED);
          self._navToggleText.textContent = 'Закрыть меню';
        } else {
          self._element.classList.remove(MainNavClasses.OPENED);
          self._element.classList.add(MainNavClasses.CLOSED);
          self._navToggleText.textContent = 'Открыть меню';
        }
      });
    }
  };
})();
