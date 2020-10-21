import { debounce } from 'lodash-es';
import Stats from 'stats-js';

import EVENTS from '~/constants/event-names';

(function () {
  /// /////////////////////////////////////////////////////// Performance Monitor
  const performanceMonitor = () => {
    const stats = new Stats();

    document.body.appendChild(stats.dom);

    function monitor() {
      stats.begin();
      stats.end();

      requestAnimationFrame(monitor);
    }

    requestAnimationFrame(monitor);
  };

  /// /////////////////////////////////////////////////////// Resize
  function onResize() {}
  window.addEventListener(EVENTS.RESIZE, debounce(onResize, 200));

  /// /////////////////////////////////////////////////////// Scroll
  function onScroll() {}
  window.addEventListener(EVENTS.SCROLL, debounce(onScroll, 200));

  /// /////////////////////////////////////////////////////// Load
  function onLoad() {
    // development
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor();
    }
  }
  window.addEventListener(EVENTS.LOAD, onLoad);

  ////スクロールでヘッダ変更////
  function changeHeader() {
    // ヘッダー表示タイミング調整
    const timing = 650; // sectionが切り替わる直前

    //スクロールの高さを取得
    let scroll = window.pageYOffset;

    const header = document.getElementById('header');

    let trigger1 = document.getElementById('js-section-intro');
    let trigger2 = document.getElementById('js-section-about');

    let trigger1Y = trigger1.getBoundingClientRect().top; // ウィンドウ上からの要素の位置
    let trigger2Y = trigger2.getBoundingClientRect().top;

    // SP画面の時は変化しない
    if (window.innerWidth > 767 ) {
      if (scroll > (trigger2Y + timing)) {
        header.classList.remove('header-top');
        header.classList.add('header-fixed');
      } else {
        header.classList.remove('header-fixed');
        header.classList.add('header-top');
      }
    }
  }
  window.addEventListener('scroll', changeHeader);
  
  ////メニュー表示////
  function openMenu() {
    document.getElementById('overlay-menu').classList.toggle('hidden');
  }
  document.getElementById('menu').addEventListener('click' , function () {
    openMenu();
  } );
    
  ////メニュー閉じる////
  function closeMenu() {
    document.getElementById('overlay-menu').classList.add('hidden');
  }
  document.getElementById('close').addEventListener('click' , function () {
    closeMenu();
  } );

})();
