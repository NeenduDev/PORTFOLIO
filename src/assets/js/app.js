import gsap from "gsap";
import Swiper from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import { reviews } from "./data";
import imagesLoaded from "imagesloaded";
import Scrollbar, { ScrollbarPlugin } from "smooth-scrollbar";

// Custom Plugins
class DisableScrollPlugin extends ScrollbarPlugin {
  static pluginName = "disableScroll";

  static defaultOptions = {
    direction: "",
  };

  transformDelta(delta) {
    if (this.options.direction) {
      delta[this.options.direction] = 0;
    }
    return { ...delta };
  }
}

class LoaderLockPlugin extends ScrollbarPlugin {
  static pluginName = "loaderLock";

  static defaultOptions = {
    locked: true,
  };

  transformDelta(delta) {
    return this.options.locked ? { x: 0, y: 0 } : delta;
  }
}

class AnchorPlugin extends ScrollbarPlugin {
  static pluginName = "anchor";

  onHashChange = () => this.jumpToHash(window.location.hash);

  onClick = (event) => {
    const { target } = event;
    if (target.tagName !== "A") return;

    const hash = target.getAttribute("href");
    if (!hash || hash.charAt(0) !== "#") return;

    this.jumpToHash(hash);
  };

  jumpToHash = (hash) => {
    if (!hash) return;
    this.scrollbar.containerEl.scrollTop = 0;
    this.scrollbar.scrollIntoView(document.querySelector(hash));
  };

  onInit() {
    this.jumpToHash(window.location.hash);
    window.addEventListener("hashchange", this.onHashChange);
    this.scrollbar.contentEl.addEventListener("click", this.onClick);
  }

  onDestroy() {
    window.removeEventListener("hashchange", this.onHashChange);
    this.scrollbar.contentEl.removeEventListener("click", this.onClick);
  }
}

// Register plugins
Scrollbar.use(DisableScrollPlugin, LoaderLockPlugin, AnchorPlugin);

// Initialize scrollbar with loader lock
const scrollbar = Scrollbar.init(document.body, {
  damping: 0.1,
  plugins: {
    loaderLock: { locked: true },
    disableScroll: { direction: "x" },
  },
});
scrollbar.track.xAxis.element.remove();

// Loading Animation
const initLoader = () => {
  const bar = document.querySelector(".loading__bar--inner");
  const counter_num = document.querySelector(".loading__counter--number");
  let c = 0;

  const barInterval = setInterval(() => {
    bar.style.width = `${c}%`;
    counter_num.innerText = `${c}%`;
    c++;

    if (c === 101) {
      clearInterval(barInterval);
      animateLoaderCompletion();
    }
  }, 5);
};

const animateLoaderCompletion = () => {
  gsap.to(".loading__bar", {
    duration: 5,
    rotate: "90deg",
    left: "1000%",
  });

  gsap.to(".loading__text, .loading__counter", {
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

  imagesLoaded(document.querySelectorAll("img"), () => {
    handleContentLoaded();
  });
};

const handleContentLoaded = () => {
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

  gsap.to("header", {
    duration: 1,
    delay: 2,
    top: "0",
  });

  gsap.to(".socials", {
    duration: 1,
    delay: 2.5,
    bottom: "10rem",
  });

  gsap.to(".scrollDown", {
    duration: 1,
    delay: 3,
    bottom: "3rem",
  });

  setTimeout(() => {
    // Unlock vertical scrolling
    scrollbar.updatePluginOptions("loaderLock", { locked: false });
  }, 2000);
};

// Initialize Skills Scroller
const initSkillsScroller = () => {
  document.querySelectorAll(".skills_text").forEach((scroller) => {
    scroller.innerHTML += `<span aria-hidden="true">${scroller.innerHTML}</span>`;
  });
};

// Initialize Swiper
const initSwiper = () => {
  Swiper.use([Pagination, Navigation]);

  new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    // rewind: true,
    resistanceRatio: 0.95, // Reduced from 0.95 for smoother dragging
    speed: 500, // Add transition speed
    grabCursor: true, // Visual feedback
    preloadImages: false, // Let lazy loading handle images
    lazy: {
      loadPrevNext: true, // Preload adjacent slides
      loadOnTransitionStart: true,
    },
    watchSlidesProgress: true,
    watchOverflow: true,
    freeMode: {
      enabled: false, // Disable free mode for better control
      sticky: false,
    },
    breakpoints: {
      850: { slidesPerView: 2 },
      1400: { slidesPerView: 3 },
      1900: { slidesPerView: 4 },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      //dynamicBullets: true, // Better performance for many bullets
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // Add these for smoother animations
    effect: "slide", // Default effect is most performant
    preventInteractionOnTransition: true, // Prevent interactions during transitions
  });

  // Optimized review loading
  const swiper_container = document.querySelector(".swiper-wrapper");
  const fragment = document.createDocumentFragment();

  reviews.forEach((review) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="review">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
              </g>
            </g>
          </svg>
          <div class="review__card">
            <div class="review__topborder"></div>
            <div class="review__text">
              <span>${review.review.substring(
                0,
                1
              )}</span>${review.review.substring(1)}
            </div>
            <img src="${review.image}" alt="" class="review__img">
            <div class="review__profile">
              <span>${review.name}</span>
              <span>${review.position}</span>
            </div>
          </div>
      </div>
    `;
    fragment.appendChild(slide);
  });

  swiper_container.appendChild(fragment);
};
// // Load reviews
// const swiper_container = document.querySelector(".swiper-wrapper");
// reviews.forEach((review) => {
//   swiper_container.innerHTML += `
//     <div class="swiper-slide">
//       <div class="review">
//         <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
//           <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
//           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
//           <g id="SVGRepo_iconCarrier">
//             <g>
//               <path fill="none" d="M0 0h24v24H0z"></path>
//               <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
//             </g>
//           </g>
//         </svg>
//         <div class="review__card">
//           <div class="review__topborder"></div>
//           <div class="review__text">
//             <span>${review.review.substring(
//               0,
//               1
//             )}</span>${review.review.substring(1)}
//           </div>
//           <img src="${review.image}" alt="" class="review__img">
//           <div class="review__profile">
//             <span>${review.name}</span>
//             <span>${review.position}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;
//   });
// };

// Initialize FAQ Accordion
const initFAQ = () => {
  document.querySelectorAll(".question").forEach((question) => {
    question.querySelector("h3").addEventListener("click", () => {
      document.querySelectorAll(".question").forEach((q) => {
        if (q !== question) q.classList.remove("open");
      });
      question.classList.toggle("open");
    });
  });
};

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initSkillsScroller();
  initSwiper();
  initFAQ();
});
