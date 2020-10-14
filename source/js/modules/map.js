/* ----- Скрипт интерактивной яндекс-карты ----- */
'use strict';

(function () {
  const mapElement = document.getElementById('map');

  if (mapElement) {
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
    let viewport;
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

    function addPlacemark(map) {
      let myPlacemark = new ymaps.Placemark(FIRM_COORDS, {}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/map-pin.png',
        iconImageSize: mapParams[viewport].placemark.size,
        iconImageOffset: mapParams[viewport].placemark.offset,
      });
      map.geoObjects.add(myPlacemark);
    }

    function init() {
      viewport = window.utils.getViewport();

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

      if (window.utils.isMobile) {
        checkMobileHeight();
        myMap.container.fitToViewport();
      }

      window.addEventListener('resize', function () {
        onWindowResize(myMap);
      });
    }

    function onWindowScroll() {
      let mapTop = mapElement.getBoundingClientRect().top + window.pageYOffset;
      let posTop = window.pageYOffset;
      let clientHeight = document.documentElement.clientHeight;

      if (posTop + 2 * clientHeight > mapTop) {  // карта начинает загружаться, когда страница прокручена вниз и до блока карты по высоте остается менее одного экрана
        window.removeEventListener('scroll', onWindowScroll);
        let script = document.createElement('script');
        script.src = "https://api-maps.yandex.ru/2.1.73/?load=package.standard&apikey=4d67490a-4409-4ab6-ac55-f78701106175&lang=ru_RU&onload=window.map.init";
        document.body.appendChild(script);
      }
    }

    function onWindowResize(map) {
      let newViewport = window.utils.getViewport();

      if (window.utils.isMobile) {
        checkMobileHeight();
        map.container.fitToViewport();
      }

      if (newViewport !== viewport) {
        viewport = newViewport;
        map.setZoom(mapParams[viewport].zoom);
        map.panTo(mapParams[viewport].center);
        map.geoObjects.removeAll();
        addPlacemark(map);
        map.container.fitToViewport();
      }
    }

    window.map.init = init;

    window.addEventListener('scroll', onWindowScroll);
    onWindowScroll();
  }
})();
