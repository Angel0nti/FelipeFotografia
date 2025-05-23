'strict';

class StickyNav {
  constructor(navSelector, headerSelector) {
    this.nav = document.querySelector(navSelector);
    this.header = document.querySelector(headerSelector);
    this.navHeight = this.nav.getBoundingClientRect().height;
    this.isSticky = false;

    this._initObserver();
    this._bindResizeEvent();
  }

  _updateMarginTop() {
    this.header.style.marginTop =
      window.innerWidth > 768 && this.isSticky ? `${this.navHeight}px` : null;
  }

  _handleIntersect = ([entry]) => {
    if (!entry.isIntersecting && !this.isSticky) {
      this.nav.classList.add('sticky');
      this.isSticky = true;
      this._updateMarginTop();
    } else {
      this.nav.classList.remove('sticky');
      this.isSticky = false;
      this._updateMarginTop();
    }
  };

  _initObserver() {
    this.observer = new IntersectionObserver(this._handleIntersect, {
      root: null,
      threshold: 0,
      rootMargin: `${this.navHeight}px`,
    });
    this.observer.observe(this.header);
  }

  _bindResizeEvent() {
    window.addEventListener('resize', () => this._updateMarginTop());
  }
  destroy() {
    // Clear observer and event resize when needed
    this.observer.disconnect();
    window.removeEventListener('resize', this._updateMarginTop);
  }
}
new StickyNav('.nav', '.hero');
// const stickyNav = new StickyNav('.nav', '.hero');
// stickyNav.destroy();

class SectionRevealer {
  constructor(sectionSelector, threshold = 0.4) {
    this.sections = document.querySelectorAll(sectionSelector);
    this.threshold = threshold;

    this._initObserver();
    this._hideSections();
  }

  _hideSections() {
    this.sections.forEach(section => section.classList.add('section--hidden'));
  }

  _onIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    });
  };

  _initObserver() {
    this.observer = new IntersectionObserver(this._onIntersect, {
      root: null,
      threshold: this.threshold,
    });

    this.sections.forEach(section => this.observer.observe(section));
  }
}

new SectionRevealer('.section');

class SmoothScroller {
  constructor(linkSelector, navSelector) {
    this.links = document.querySelectorAll(linkSelector);
    this.nav = document.querySelector(navSelector);

    this._addClickListeners();
  }

  _addClickListeners() {
    this.links.forEach(link => {
      link.addEventListener('click', this._handleClick.bind(this));
    });
  }

  _handleClick(e) {
    e.preventDefault();

    const targetId = e.currentTarget.getAttribute('href');
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      const offsetTop = targetEl.offsetTop - this.nav.offsetHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }
}
new SmoothScroller('.nav__link', '.nav');

class ScrollReset {
  constructor() {
    this._setScroollRestoration();
    this._resetOnLoad();
  }

  _setScroollRestoration() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }

  _resetOnLoad() {
    window.addEventListener('load', this._timeOut.bind(this));
  }
  _timeOut() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      history.replaceState(null, '', window.location.pathname);
    }, 0);
  }
}
new ScrollReset();

class ImageSlider {
  constructor({
    containerSelector,
    spinnerSelector,
    buttonsSelector,
    btnLeftSelector,
    btnRightSelector,
    data,
  }) {
    this.container = document.querySelector(containerSelector);
    this.spinner = document.querySelector(spinnerSelector);
    this.buttons = document.querySelectorAll(buttonsSelector);
    this.btnLeft = document.querySelector(btnLeftSelector);
    this.btnRight = document.querySelector(btnRightSelector);
    this.data = data;

    this.currentSlide = 0;
    this.currentImages = [];

    this._bindCategoryButtons();
    this._setupNavButtons();

    // Load first category by default
    const defaultCategory = Object.keys(data)[0];
    if (defaultCategory) {
      this._renderSlides(data[defaultCategory]);
    }
  }

  _renderSlides(images) {
    this.spinner.classList.remove('hidden');
    this.container.innerHTML = '';
    this.container.appendChild(this.spinner);

    this.currentSlide = 0;
    this.currentImages = images;

    let loadedCount = 0;

    images.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.classList.add('slide');

      if (window.innerWidth > 768) {
        slide.style.transform = `translateX(${100 * i}%)`;
      }

      const image = new Image();
      image.src = src;
      image.alt = 'slide';

      image.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          this.spinner.classList.add('hidden');
          this._moveToSlide(0);
        }
      };

      slide.appendChild(image);
      this.container.appendChild(slide);
    });

    this._moveToSlide(0);
  }
  _moveToSlide(index) {
    if (window.innerWidth > 768) {
      const slides = this.container.querySelectorAll('.slide');
      slides.forEach((slide, i) => {
        const offset = 100 * (i - index);
        slide.style.transform = `translateX(${offset}%)`;
      });
    } else {
      this.container.style.transform = `translateX(-${100 * index}%)`;
    }
    this.currentSlide = index;
  }

  _setupNavButtons() {
    this.btnRight.addEventListener('click', this._moveToRight.bind(this));
    this.btnLeft.addEventListener('click', this._moveToLeft.bind(this));
  }

  _moveToRight() {
    if (this.currentImages.length === 0) return;
    const nextIndex = (this.currentSlide + 1) % this.currentImages.length;
    this._moveToSlide(nextIndex);
  }

  _moveToLeft() {
    if (this.currentImages.length === 0) return;
    const prevIndex =
      (this.currentSlide - 1 + this.currentImages.length) %
      this.currentImages.length;
    this._moveToSlide(prevIndex);
  }

  _bindCategoryButtons() {
    this.buttons.forEach(button => {
      button.addEventListener('click', this._btnToEachCategory.bind(this));
    });
  }

  _btnToEachCategory(event) {
    const button = event.currentTarget;
    const category = button.dataset.category;
    const images = this.data[category];

    if (images) {
      this._renderSlides(images);
    }
  }
}
const slider = new ImageSlider({
  containerSelector: '.slides-container',
  spinnerSelector: '.spinner',
  buttonsSelector: '.btn-image-slide',
  btnLeftSelector: '.slider__btn--left',
  btnRightSelector: '.slider__btn--right',

  data: {
    weddings: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'].map(
      n => `bodas/boda${n}`
    ),
    exteriores: [
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
    ].map(n => `ext/ext${n}`),
    graduaciones: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'].map(
      n => `grad/grad${n}`
    ),
    retratos: [
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
    ].map(n => `estudio/est${n}`),
  },
});

class EventSlider {
  constructor({ containerSelector, images, interval = 1300 }) {
    this.container = document.querySelector(containerSelector);
    this.images = images;
    this.interval = interval;
    this.currentIndex = 0;

    this._renderSlides();
    this._startAutoplay();
  }

  _renderSlides() {
    this.container.innerHTML = '';
    this.slides = this.images.map(src => {
      const slide = document.createElement('div');
      slide.classList.add('slide-event'); // coincide con CSS original

      const img = new Image();
      img.src = src;
      img.alt = 'event';

      slide.appendChild(img);
      this.container.appendChild(slide);
      return slide;
    });

    this._moveToSlide(0);
  }

  _moveToSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
    this.currentIndex = index;
  }

  _startAutoplay() {
    this.timer = setInterval(() => {
      const next = (this.currentIndex + 1) % this.slides.length;
      this._moveToSlide(next);
    }, this.interval);
  }
}

const eventSlider = new EventSlider({
  containerSelector: '.slides-event-container',
  images: [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg',
    '7.jpg',
    '8.jpg',
  ].map(n => `eventos/event${n}`),
  interval: 1300,
});
class HamburgerMenu {
  constructor({ hamSelector, menuSelector }) {
    this.hamMenu = document.querySelector(hamSelector);
    this.menu = document.querySelector(menuSelector);

    if (!this.hamMenu || !this.menu) return;
    this._addEventListeners();
  }

  _addEventListeners() {
    this.hamMenu.addEventListener('click', e => {
      e.stopPropagation();
      this.hamMenu.classList.toggle('active');
      this.menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    this.menu.addEventListener('click', e => e.stopPropagation());

    document.addEventListener('click', () => this._closeMenu());
  }

  _closeMenu() {
    this.hamMenu.classList.remove('active');
    this.menu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
}
const menu = new HamburgerMenu({
  hamSelector: '.ham-menu',
  menuSelector: '.off-screen-menu',
});
