export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      console.log(col.textContent.trim());
    });
  });
}
