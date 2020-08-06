/* ----- Интерактивная карта ----- */
'use strict';

(function () {
  const mapElement = document.getElementById('map');

  if (mapElement) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const BREAKPOINTS = {
      "tablet": 768,
      "desktop": 1300,
    };

    const mapParams = {
      'mobile': {
        'zoom': 15,
        'center': [59.93881872632231, 30.32312098938753],
        'placemark': {
          size: [61, 52],
          offset: [-30.5, -52]
        },
      },
      'tablet': {
        'zoom': 15,
        'center': [59.939740388660944, 30.32312098938753],
        'placemark': {
          size: [124, 106],
          offset: [-62, -106]
        },
      },
      'desktop': {
        'zoom': 16,
        'center': [59.93910404662137, 30.318854613016263],
        'placemark': {
          size: [124, 106],
          offset: [-62, -106]
        },
      },
    };

    const FIRM_COORDS = [59.9385645248735, 30.323183542781184];

    let myMap;
    let viewport = "mobile";
    const mapHeightMobile = 362;  //px
    const minPadding = 40;  // отступ, необходимый для возможности прокрутки карты на устройстве, px

    function checkMobileHeight() {  // Проверка условия, что карта не занимает по высоте весь экран. При необходимости высота карты уменьшается для возможности ее свободной прокрутки
      let clientHeight = document.documentElement.clientHeight;

      if (clientHeight < mapHeightMobile + minPadding * 2) {
        mapElement.style.height = (clientHeight - minPadding * 2) + 'px';
      } else if (mapElement.hasAttribute('style')) {
        mapElement.removeAttribute('style');
      }
    }

    function getViewport() {
      let viewportWidth = window.innerWidth;
      let viewport;
      if (viewportWidth < BREAKPOINTS.tablet) {
        viewport = "mobile";
      } else if (viewportWidth >= BREAKPOINTS.tablet && viewportWidth < BREAKPOINTS.desktop) {
        viewport = "tablet";
      } else {
        viewport = "desktop";
      }
      return viewport;
    }

    function addPlacemark(map) {
      let myPlacemark = new ymaps.Placemark(FIRM_COORDS, {}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/map-pin.png',
        iconImageSize: mapParams[viewport].placemark.size,
        iconImageOffset: mapParams[viewport].placemark.offset,
      });
      map.geoObjects.add(myPlacemark);
    }

    function onWindowResize(map) {
      let newViewport = getViewport();

      if (isMobile) {
        checkMobileHeight();
      }

      if (newViewport !== viewport) {
        viewport = newViewport;
        map.setZoom(mapParams[viewport].zoom);
        map.panTo(mapParams[viewport].center);
        map.geoObjects.removeAll();
        addPlacemark(map);
      }
    }

    function init() {
      if (isMobile) {
        checkMobileHeight();
      }

      viewport = getViewport();

      myMap = new ymaps.Map('map', {
        center: mapParams[viewport].center,
        zoom: mapParams[viewport].zoom,
        controls: ['zoomControl', 'fullscreenControl']
      },
      {
        suppressMapOpenBlock: true
      });
      myMap.behaviors.disable(['scrollZoom']);

      addPlacemark(myMap);
    }

    ymaps.ready(init);
    window.addEventListener('resize', function () {
      onWindowResize(myMap);
    });
  }
})();
