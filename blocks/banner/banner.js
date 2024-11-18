export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.textContent.trim().startsWith('#')) {
      row.style.backgroundColor = row.textContent.trim();
      row.textContent = '';
    }
  });
}
