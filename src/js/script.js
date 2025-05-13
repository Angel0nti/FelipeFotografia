'use strict';

// -------------STICKY NAVIGATION---------------- //
const nav = document.querySelector('.nav');
const header = document.querySelector('.hero');

const navHeight = nav.getBoundingClientRect().height;

const obs = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
      header.style.marginTop = `${navHeight}px`;
    } else {
      nav.classList.remove('sticky');
      header.style.marginTop = `0`;
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);

obs.observe(header);

// ----------- INTERSECTION OBSERVER API  REVEALING ELEMENTS STARTS -------------

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting === false) return;
    entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.3,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// ----------- INTERSECTION OBSERVER API  REVEALING ELEMENTS ENDS -------------

// ---------------------- SMOOTH SCROLL ----------------
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const id = this.getAttribute('href');
    const section = document.querySelector(id);

    if (section) {
      const navHeight = document.querySelector('.nav').offsetHeight;

      const offsetTop = section.offsetTop - navHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  });
});

// ------------ GET TO THE TOP OF THE WEB PAGE -------
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
    history.replaceState(null, null, ' ');
  }, 0);
});

// -----------DYNAMIC SLIDER TABBED STARTS -------
const slidesContainer = document.querySelector('.slides-container');
const buttonsByCategory = document.querySelectorAll('.btn-image-slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currentSlide = 0;
let currentSlides = [];

const sliderData = {
  weddings: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map(
    n => `src/img/bodas/boda${n}`
  ),
  exteriores: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map(
    n => `src/img/ext/ext${n}`
  ),
  graduaciones: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map(
    n => `src/img/grad/grad${n}`
  ),
  retratos: ['1.jpg', '2.jpg', '3.jpg'].map(n => `src/img/estudio/est${n}`),
};

const renderSlides = images => {
  slidesContainer.innerHTML = '';
  currentSlides = images;
  images.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');
    slide.style.transform = `translateX(${100 * i}%)`;
    slide.innerHTML = `<img src="${img}" alt="slide" />`;

    slidesContainer.appendChild(slide);
  });
  currentSlide = 0;
};

buttonsByCategory.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    renderSlides(sliderData[category]);
  });
});

const moveToSlide = slideIndex => {
  document.querySelectorAll('.slide').forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
  });
};

btnRight.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % currentSlides.length;
  moveToSlide(currentSlide);
});

btnLeft.addEventListener('click', () => {
  currentSlide =
    (currentSlide - 1 + currentSlides.length) % currentSlides.length;
  moveToSlide(currentSlide);
});

renderSlides(sliderData.weddings);
// -----------DYNAMIC SLIDER TABBED ENDS -------

// -------------------- SLIDES FOR EVENTS -------------- //
const slidesEventContainer = document.querySelector('.slides-event-container');

let currEventSlide = 0;
let currEventSlideArr = [];

const sliderEventData = {
  eventos: [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg',
    // '7.jpg',
    // '8.jpg',
    // '9.jpg',
  ].map(numImage => `src/img/eventos/event${numImage}`),
};

const renderEventSlides = images => {
  slidesEventContainer.innerHTML = '';
  currEventSlideArr = images;
  images.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.classList.add('slide-event');
    slide.style.transform = `translateX(${100 * i}%)`;
    slide.innerHTML = `<img src="${img}" alt="slide" />`;

    slidesEventContainer.appendChild(slide);
  });
  currEventSlide = 0;
};

const moveToEventSlide = index => {
  document
    .querySelectorAll('.slides-event-container .slide-event')
    .forEach((s, i) => {
      const translateX = 100 * (i - index);
      s.style.transform = `translateX(${translateX}%)`;
    });
};

renderEventSlides(sliderEventData.eventos);

setInterval(() => {
  if (currEventSlideArr.length === 0) return;
  currEventSlide = (currEventSlide + 1) % currEventSlideArr.length;
  moveToEventSlide(currEventSlide);
}, 3000);
