export default function decorate(block) {
  let ctaText = '';
  let ctaLink = '';
  let ctaButton = '';
  [...block.children].forEach((row, index) => {
    console.log(row, index);
    if (row.textContent.trim().startsWith('#')) {
      const bannerContainer = document.querySelector('.section.banner-container.bannerimage-container');
      if (bannerContainer) {
        // eslint-disable-next-line max-len
        bannerContainer.style.backgroundColor = row.textContent.trim(); // Set your desired background color here
      }
      row.textContent = '';
    }
    if (index === 3) {
      ctaText = row.textContent.trim();
      row.textContent = '';
    }
    if (index === 2) {
      ctaButton = row.querySelector('a');
      ctaLink = ctaButton.textContent;
    }
  });
  ctaButton.textContent = ctaText;
  ctaButton.href = ctaLink;
}
