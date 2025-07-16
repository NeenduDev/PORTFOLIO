import gsap from "gsap";
import Swiper from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import { reviews } from "./data";

const bar = document.querySelector(".loading__bar--inner");
const counter_num = document.querySelector(".loading__counter--number");
let c = 0;

let barInterval = setInterval(() => {
  bar.style.width = c + "%";
  counter_num.innerText = c + "%";
  c++;
  if (c == 101) {
    clearInterval(barInterval);
    gsap.to(".loading__bar", {
      duration: 5,
      rotate: "90deg",
      left: "1000%",
    });
    gsap.to(".loading__text,.loading__counter", {
      duration: 0.5,
      opacity: 0,
    });

    gsap.to(".loading__box", {
      duration: 1,
      height: "500px",
      borderRadius: "50%",
    });
    gsap.to(".loading__svg", {
      duration: 10,
      opacity: 1,
      rotate: "360deg",
    });

    gsap.to(".loading__box", {
      delay: 2,
      border: "none",
    });
    gsap.to(".loading", {
      delay: 2,
      duration: 2,
      zIndex: 1,
      background: "transparent",
      opacity: 0.5,
    });
    gsap.to(".loading__svg", {
      delay: 2,
      duration: 100,
      rotate: "360deg",
    });
  }
}, 20);

document.addEventListener("DOMContentLoaded", () => {
  const scrollers = document.querySelectorAll(".skills_text");

  scrollers.forEach((scroller) => {
    // Get the content from the scroller
    const scrollerContent = scroller.innerHTML;

    // Duplicate the content and add it back
    // The "aria-hidden" makes the duplicate invisible to screen readers
    scroller.innerHTML += `<span aria-hidden="true">${scrollerContent}</span>`;
  });
});

// swiper
Swiper.use([Pagination, Navigation]);
var swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  watchSlidesProgress: true,
  breakpoints: {
    850: {
      slidesPerView: 2,
    },
    1400: {
      slidesPerView: 3,
    },
    1900: {
      slidesPerView: 4,
    },
  },
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
const swiper_container = document.querySelector(".swiper-wrapper");
reviews.map((review) => {
  let template = `<div class=swiper-slide>
<div class=review>
<svg viewBox="0 0 24 24" xmlns=http://www.w3.org/2000/svg fill=#000000>
<g id=SVGRepo_bgCarrier stroke-width=0></g>
<g id=SVGRepo_tracerCarrier stroke-linecap=round stroke-linejoin=round></g>
<g id=SVGRepo_iconCarrier>
<g>
<path fill=none d="M0 0h24v24H0z"></path>
<path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
</g>
</g>
</svg>
<div class=review__card>
<div class=review__topborder></div>
<div class=review__text>
<span>${review.review.substring(0, 1)}</span>${review.review.substring(
    1,
    review.review.length
  )}
</div>
<img src="${review.image}" alt="" class=review__img>
<div class=review__profile>
<span>${review.name}</span><span>${review.position}</span>
</div>
</div>
</div>
</div>`;
  swiper_container.innerHTML += template;
});
// Then add two empty placeholder slides
for (let i = 0; i < 2; i++) {
  swiper_container.innerHTML += `<div class="swiper-slide swiper-slide-placeholder"></div>`;
}
