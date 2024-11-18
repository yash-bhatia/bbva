export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.textContent.trim().startsWith('#')) {
      const bannerContainer = document.querySelector('.section.banner-container.bannerimage-container');
      if (bannerContainer) {
        bannerContainer.style.backgroundColor = row.textContent.trim(); // Set your desired background color here
      }
      row.textContent = '';
    }
  });
}
