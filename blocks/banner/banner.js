export default function decorate(block) {
  let ctaText = '';
  let ctaLink = '';
  let ctaButton = '';
  let ctaFontColor = ''; // New variable for font color
  const titleFontColor = '';
  const descriptionFontColor = '';
  let titleEl;
  let descEl;
  [...block.children].forEach((row, index) => {
    console.log(row, index);
    if (index === 0) {
      titleEl = row.querySelector('h1, h2, h3, h4, h5, h6');
    }
    if (index === 1) {
      descEl = row.querySelector('p');
    }
    if (index === 6) {
      // Authorable CTA font color
      ctaFontColor = row.textContent.trim();
      const buttonLinks = document.querySelectorAll('.section.banner-container a.button:any-link, button');
      buttonLinks.forEach((button) => {
        button.style.color = ctaFontColor;
      });
      row.textContent = '';
    }
    if (index === 5) {
      const buttonLinks = document.querySelectorAll('.section.banner-container a.button:any-link, button');
      buttonLinks.forEach((button) => {
        // eslint-disable-next-line max-len
        console.log(button);
        // eslint-disable-next-line max-len
        button.style.backgroundColor = row.textContent.trim(); // Set your desired background color here
      });
      row.textContent = '';
    }
    if (index === 4) {
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
      ctaButton.classList.add('button'); // Add the class "button" to ctaButton
      ctaLink = ctaButton.textContent;
    }
    if (index === 7) {
      // Authorable title font color
      titleFontColor = row.textContent.trim();
      row.textContent = '';
      console.log('titleFontColor', titleFontColor);
    }
    if (index === 8) {
      // Authorable description font color
      descriptionFontColor = row.textContent.trim();
      row.textContent = '';
      console.log('descriptionFontColor', descriptionFontColor);
    }
  });

  ctaButton.textContent = ctaText;
  ctaButton.href = ctaLink;

  if (titleEl && titleFontColor) {
    titleEl.style.color = titleFontColor;
  }
  if (descEl && descriptionFontColor) {
    descEl.style.color = descriptionFontColor;
  }
}
