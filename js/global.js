function loadFonts(fonts, doc = document){
  const data = fonts;
  if(!data) return;
  const root = document.documentElement;

  let splitArray = data.toString().replace(/,\s*/g, ',').split(',');

  let googleFontsURL = `https://fonts.googleapis.com/css2?`;

  const ghostFonts = document.querySelector('link[href*="fonts.bunny.net/css"]');

  if(ghostFonts) return;

  for(let i = 0; i < splitArray.length; i++){
    if(i == 4) break;

    root.style.setProperty(`--font${i+1}`, `'${splitArray[i].toString()}'`);

    splitArray[i] = splitArray[i].replace(' ', '+');
    googleFontsURL += `family=${splitArray[i]}:wght@300;400;500;600;700&`  
  }

  googleFontsURL += 'display=swap'

  const linkElement = doc.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = googleFontsURL;

  doc.head.appendChild(linkElement);
}

function hexToRgba(hex) {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  let opac_20 =  `rgba(${r}, ${g}, ${b}, 0.2)`;

  document.documentElement.style.setProperty('--text-color-20', opac_20);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function debounce(fn, delay) {
   let timerId;
   return function(...args) {
     if (timerId) {
       clearTimeout(timerId);
     }
     timerId = setTimeout(() => {
       fn(...args);
       timerId = null;
     }, delay);
   };
}

let scrollPosition = 0;

function disableScrolling() {
  scrollPosition = window.pageYOffset;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
  document.documentElement.style.scrollBehavior = 'auto';
  
}
  
function enableScrolling(scrollToPosition = true) {
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('position');
  document.body.style.removeProperty('top');
  document.body.style.removeProperty('width');
  if(scrollToPosition){
    window.scrollTo(0, scrollPosition);
  } 
  document.documentElement.style.scrollBehavior = 'smooth';
}

function lazyLoadImages(container = document){
  container.querySelectorAll('.hover-image-opacity figure').forEach(wrapper => {
    let img = wrapper.querySelector('img');
    if(!img) return;
    if (img.complete) {
      wrapper.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        wrapper.classList.add("loaded");
      });
    }
  })
}

function moveFeaturedImage(){
  let article = document.querySelector('article');

  if(article.getAttribute('data-has-feature-image') != 'true') return;
  if(article.getAttribute('data-post-header-type') != 'Narrow') return;
  if(article.getAttribute('data-use-sidebar') != 'true') return;

  document.querySelector('.post-content-outer').insertBefore(document.querySelector('.post-main-image-wrapper'), document.querySelector('.post-content-outer').firstChild);
}

function stickySidebar() {
  let sidebar = document.querySelector('.post-sidebar');
  if(!sidebar) return;

  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  sidebar.offsetHeight > viewportHeight ? sidebar.style.top = `calc(100vh - ${sidebar.offsetHeight}px)` : sidebar.style.top = 'calc(2.64vw * var(--scale))';
}

function setLightense(){
  window.addEventListener('DOMContentLoaded', function () {
      const imagesInAnchors = document.querySelectorAll('.post-content a img, .post-content .kg-product-card img, .kg-signup-card img, .kg-header-card img');
  
      imagesInAnchors.forEach((img) => {
          img.classList.add('no-lightense');  
      });
  
      Lightense('.post-content img:not(.no-lightense)', {
          background: 'var(--background-color)'
      });
  }, false);
}

function setToggle() {
  const toggleHeadingElements = document.getElementsByClassName("kg-toggle-heading");

  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("viewBox", "0 0 16 10");
  svgElement.setAttribute("fill", "none");
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("d", "M16 2L8 10L-3.49691e-07 2L1.42 0.580001L8 7.16L14.58 0.58L16 2Z");

  svgElement.appendChild(pathElement);

  document.querySelectorAll('.kg-toggle-card').forEach(card => {
      card.querySelector('.kg-toggle-heading svg').remove();

      const container = card.querySelector(".kg-toggle-card-icon");
      const clonedSvg = svgElement.cloneNode(true);

      container.appendChild(clonedSvg);
  })
  
  const toggleFn = function(event) {
      
      const targetElement = event.target;
      const parentElement = targetElement.closest('.kg-toggle-card');
      var toggleState = parentElement.getAttribute("data-kg-toggle-state");
      if (toggleState === 'close') {
          parentElement.setAttribute('data-kg-toggle-state', 'open');
      } else {
          parentElement.setAttribute('data-kg-toggle-state', 'close');
      }
  };

  for (let i = 0; i < toggleHeadingElements.length; i++) {
      toggleHeadingElements[i].addEventListener('click', toggleFn, false);
  }
}

function copyUrlToClipboard(parentElement){
  let parent = document.querySelector(`.${parentElement}`)
  let alert = parent.querySelector('.clipboard-alert');

  parent.querySelector('.clipboard-link').addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      alert.style.display = "block";

      setTimeout(function () {
          alert.style.display = "none";
      }, 3000);
  })
}