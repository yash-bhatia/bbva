import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './aem.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
  import('./sidekick.js').then(({ initSidekick }) => initSidekick());
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();

  let sectionColor;
  let fontColor;
  const headerSection = document.querySelector('.headernav.section');
  if (headerSection) {
    sectionColor = headerSection.getAttribute('data-sectioncolor');
    fontColor = headerSection.getAttribute('data-fontcolor');
    console.log(sectionColor);
    headerSection.style.backgroundColor = `#${sectionColor.split('#')[1]}`;
    headerSection.style.color = `#${fontColor.split('#')[1]}`;
    // Apply font color to all child elements
    const headerChildren = headerSection.querySelectorAll('*');
    headerChildren.forEach(child => {
      child.style.color = `#${fontColor.split('#')[1]}`;
    });
  }
  const footerSection = document.querySelector('.footernav.section');
  if (footerSection) {
    sectionColor = footerSection.getAttribute('data-sectioncolor');
    fontColor = footerSection.getAttribute('data-fontcolor');
    console.log(sectionColor);
    footerSection.style.backgroundColor = `#${sectionColor.split('#')[1]}`;
    footerSection.style.color = `#${fontColor.split('#')[1]}`;
    // Apply font color to all child elements
    const footerChildren = footerSection.querySelectorAll('*');
    footerChildren.forEach(child => {
      child.style.color = `#${fontColor.split('#')[1]}`;
    });
  }

  const remainingNavElement = document.querySelectorAll('body > main > div:nth-child(1) > div p');
  for (let i = 0; i < remainingNavElement.length; i += 1) {
    remainingNavElement[i].addEventListener('click', (event) => {
      event.preventDefault();
      window.history.go(0);
    });
  }

  // eslint-disable-next-line max-len
  /*   const middleButton = document.querySelector('body > main > div.section.columns-container > div.default-content-wrapper > p.button-container a');
  middleButton.addEventListener('click', (event) => {
    event.preventDefault();
    middleButton.href = window.location.href;
  }); */

  const footerAnchors = document.querySelectorAll('body > main > div:nth-child(5) > div a');
  console.log(footerAnchors);
  for (let i = 0; i < footerAnchors.length; i += 1) {
    footerAnchors[i].addEventListener('click', (event) => {
      event.preventDefault();
      footerAnchors[i].href = window.location.href;
    });
  }
}
loadPage();
