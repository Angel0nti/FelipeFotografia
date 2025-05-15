'use strict';
// // -------------STICKY NAVIGATION---------------- //
const nav = document.querySelector('.nav');
const header = document.querySelector('.hero');

const navHeight = nav.getBoundingClientRect().height;

let isSticky = false;

const obs = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      if (!isSticky) {
        nav.classList.add('sticky');
        header.style.marginTop = `${navHeight}px`;
        isSticky = true;
      }
    } else {
      if (isSticky) {
        nav.classList.remove('sticky');
        header.style.marginTop = `0`;
        isSticky = false;
      }
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
  threshold: 0.4,
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
const spinner = document.querySelector('.spinner');
const buttonsByCategory = document.querySelectorAll('.btn-image-slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currentSlide = 0;
let currentSlides = [];

const sliderData = {
  weddings: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map(n => `bodas/boda${n}`),
  exteriores: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map(n => `ext/ext${n}`),
  graduaciones: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'].map(n => `grad/grad${n}`),
  retratos: ['1.jpg', '2.jpg', '3.jpg'].map(n => `estudio/est${n}`),
};

const renderSlides = images => {
  spinner.classList.remove('hidden');

  currentSlide = 0;

  const existingSlides = slidesContainer.querySelectorAll('.slide');
  existingSlides.forEach(slide => slide.remove());

  currentSlides = images;

  moveToSlide(0);

  let loadedCount = 0;

  images.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');
    // slide.style.transform = `translateX(${100 * i}%)`;

    const image = new Image();
    image.src = img;
    image.alt = 'slide';

    image.onload = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        spinner.classList.add('hidden');
        moveToSlide(0);
      }
    };

    slide.appendChild(image);
    slidesContainer.appendChild(slide);
  });

  slidesContainer.appendChild(spinner);
  moveToSlide(0);
};

buttonsByCategory.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    renderSlides(sliderData[category]);
  });
});

const moveToSlide = slideIndex => {
  slidesContainer.style.transform = `translateX(-${100 * slideIndex}%)`;
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
  ].map(numImage => `eventos/event${numImage}`),
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
}, 1500);

// ------------------- HAMBURGER BUTTON -------------------
const hamMenu = document.querySelector('.ham-menu');
const offsScreenMenu = document.querySelector('.off-screen-menu');

hamMenu.addEventListener('click', event => {
  event.stopPropagation();
  hamMenu.classList.toggle('active');
  offsScreenMenu.classList.toggle('active');
});
offsScreenMenu.addEventListener('click', event => {
  event.stopPropagation();
});

document.addEventListener('click', () => {
  hamMenu.classList.remove('active');
  offsScreenMenu.classList.remove('active');
});
