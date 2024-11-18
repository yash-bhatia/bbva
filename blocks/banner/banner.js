export default function decorate(block) {
  [...block.children].forEach((row) => {
    console.log(row.textContent.trim());
  });
}
