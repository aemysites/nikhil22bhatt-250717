/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Accordion (accordion5)'];

  // Find all accordion items: each item is a title/content pair
  // Titles are in <div class="pTGvBS"> <p><strong>Title</strong></p>
  // Content is all following <p> until next <div class="pTGvBS">
  const items = Array.from(element.querySelectorAll('.pTGvBS'));
  const rows = [];

  items.forEach(item => {
    // Title cell: first <p><strong>...</strong></p> in this item
    const titleP = item.querySelector('p strong');
    let titleCell;
    if (titleP) {
      titleCell = document.createElement('span');
      titleCell.textContent = titleP.textContent;
    } else {
      titleCell = document.createTextNode('');
    }

    // Content cell: all <p> except the first (title)
    const ps = Array.from(item.querySelectorAll('p'));
    const contentCell = document.createElement('div');
    ps.forEach((p, idx) => {
      if (!(idx === 0 && p.querySelector('strong'))) {
        contentCell.appendChild(p.cloneNode(true));
      }
    });
    rows.push([titleCell, contentCell]);
  });

  // Add important links as a separate accordion item if present
  const linksRow = element.querySelector('.ghBbwg');
  if (linksRow) {
    // Title: label span
    const labelSpan = linksRow.querySelector('.DH_z7m');
    let titleCell;
    if (labelSpan) {
      titleCell = document.createElement('span');
      titleCell.textContent = labelSpan.textContent;
    } else {
      titleCell = document.createTextNode('Important Links');
    }
    // Content: all links
    const contentCell = document.createElement('div');
    Array.from(linksRow.querySelectorAll('a')).forEach(a => {
      contentCell.appendChild(a.cloneNode(true));
      contentCell.appendChild(document.createElement('br'));
    });
    rows.push([titleCell, contentCell]);
  }

  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
