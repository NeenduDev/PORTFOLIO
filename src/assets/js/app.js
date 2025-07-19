import gsap from "gsap";
import Swiper from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import { reviews } from "./data";
import imagesLoaded from "imagesloaded";
import Scrollbar, { ScrollbarPlugin } from "smooth-scrollbar";

// Custom Plugins
class DisableScrollPlugin extends ScrollbarPlugin {
  static pluginName = "disableScroll";
  static defaultOptions = { direction: "" };
  transformDelta(delta) {
    if (this.options.direction) {
      delta[this.options.direction] = 0;
    }
    return { ...delta };
  }
}
class LoaderLockPlugin extends ScrollbarPlugin {
  static pluginName = "loaderLock";
  static defaultOptions = { locked: true };
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
Scrollbar.use(DisableScrollPlugin, LoaderLockPlugin, AnchorPlugin);

// Initialize scrollbar with loader lock
const scrollbar = Scrollbar.init(document.body, {
  damping: 0.05,
  plugins: {
    loaderLock: { locked: true },
    disableScroll: { direction: "x" },
  },
});
scrollbar.track.xAxis.element.remove();

// Cache selectors
const bar = document.querySelector(".loading__bar--inner");
const counter_num = document.querySelector(".loading__counter--number");
const loadingBar = document.querySelector(".loading__bar");
const loadingText = document.querySelector(".loading__text");
const loadingCounter = document.querySelector(".loading__counter");
const loadingBox = document.querySelector(".loading__box");
const loadingSVG = document.querySelector(".loading__svg");
const header = document.querySelector("header");
const socials = document.querySelector(".socials");
const scrollDown = document.querySelector(".scrollDown");

// Loading Animation
const initLoader = () => {
  let c = 0;
  const barInterval = setInterval(() => {
    if (bar) bar.style.width = `${c}%`;
    if (counter_num) counter_num.innerText = `${c}%`;
    c++;
    if (c === 101) {
      clearInterval(barInterval);
      animateLoaderCompletion();
    }
  }, 5);
};
const animateLoaderCompletion = () => {
  if (loadingBar) {
    gsap.to(loadingBar, { duration: 5, rotate: "90deg", left: "1000%" });
  }
  if (loadingText && loadingCounter) {
    gsap.to([loadingText, loadingCounter], { duration: 0.5, opacity: 0 });
  }
  if (loadingBox) {
    gsap.to(loadingBox, { duration: 1, height: "500px", borderRadius: "50%" });
    gsap.to(loadingBox, { delay: 2, border: "none" });
  }
  if (loadingSVG) {
    gsap.to(loadingSVG, { duration: 10, opacity: 1, rotate: "360deg" });
  }
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
  if (loadingSVG) {
    gsap.to(loadingSVG, { delay: 2, duration: 100, rotate: "360deg" });
  }
  if (header) {
    gsap.to(header, { duration: 1, delay: 2, top: "0" });
  }
  if (socials) {
    gsap.to(socials, { duration: 1, delay: 2.5, bottom: "10rem" });
  }
  if (scrollDown) {
    gsap.to(scrollDown, { duration: 1, delay: 3, bottom: "3rem" });
  }
  setTimeout(() => {
    scrollbar.updatePluginOptions("loaderLock", { locked: false });
  }, 2000);
};
// Skills Scroller
const initSkillsScroller = () => {
  document.querySelectorAll(".skills_text").forEach((scroller) => {
    scroller.innerHTML += `<span aria-hidden="true">${scroller.innerHTML}</span>`;
  });
};
// Swiper
const initSwiper = () => {
  Swiper.use([Pagination, Navigation]);
  new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    rewind: true,
    resistanceRatio: 0.95,
    speed: 500,
    grabCursor: true,
    lazy: { loadPrevNext: true, loadOnTransitionStart: true },
    watchSlidesProgress: true,
    watchOverflow: true,
    freeMode: { enabled: false, sticky: false },
    breakpoints: {
      850: { slidesPerView: 2 },
      1400: { slidesPerView: 3 },
      1900: { slidesPerView: 4 },
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "slide",
  });
  // Optimized review loading
  const swiper_container = document.querySelector(".swiper-wrapper");
  if (swiper_container) {
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
  }
};
// FAQ Accordion (event delegation)
const initFAQ = () => {
  const faqContainer = document.querySelector(".faq");
  if (!faqContainer) return;
  faqContainer.addEventListener("click", (e) => {
    const question = e.target.closest(".question");
    if (!question) return;
    document.querySelectorAll(".question.open").forEach((q) => {
      if (q !== question) q.classList.remove("open");
    });
    question.classList.toggle("open");
  });
};
// Single smooth scroll handler for ALL hash links (event delegation)
function handleHashScroll(event) {
  const hashLink = event.target.closest('a[href^="#"]');
  if (!hashLink) return;
  event.preventDefault();
  const hash = hashLink.getAttribute("href");
  if (hash === "#backToTop") {
    scrollbar.scrollTo(0, 0, 1000);
  } else {
    const target = document.querySelector(hash);
    if (target) {
      scrollbar.scrollIntoView(target, {
        offsetTop: 0,
        onlyScrollIfNeeded: true,
      });
    }
  }
  history.replaceState(null, null, " ");
}
// Initialize everything in a single DOMContentLoaded
// Also clean up event listeners on unload
function initApp() {
  initLoader();
  initSkillsScroller();
  initSwiper();
  initFAQ();
  // Handle clicks on all hash links
  document.addEventListener("click", handleHashScroll);
  // Handle initial page load with hash
  if (window.location.hash) {
    const fakeEvent = {
      target: {
        closest: () => ({ getAttribute: () => window.location.hash }),
        preventDefault: () => {},
      },
    };
    handleHashScroll(fakeEvent);
  }
  // Clean up on unload
  window.addEventListener("unload", () => {
    document.removeEventListener("click", handleHashScroll);
  });
}
document.addEventListener("DOMContentLoaded", initApp);
