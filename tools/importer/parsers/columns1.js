/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row
  const headerRow = ['Columns (columns1)'];

  // Find main content column (left)
  let mainContent = element.querySelector('.EDit8G');
  if (!mainContent) {
    mainContent = element.querySelector('.contentDescription');
  }

  // Find sidebar column (right)
  let sidebar = element.querySelector('.w6oD5B');
  if (!sidebar) {
    sidebar = element.querySelector('._6Mb0QO');
  }

  if (!mainContent) {
    mainContent = element.querySelector('main, article, [role=main]');
  }
  if (!sidebar) {
    sidebar = element.querySelector('aside');
  }

  const row2 = [mainContent ? mainContent.cloneNode(true) : '', sidebar ? sidebar.cloneNode(true) : ''];

  // About Author section (should be in left column only, and only if present)
  let rows = [headerRow, row2];
  const aboutAuthorHeader = element.querySelector('h2._P8yN6');
  const aboutAuthorBox = element.querySelector('.QFX_YY');
  if (aboutAuthorHeader && aboutAuthorBox) {
    const frag = document.createDocumentFragment();
    frag.appendChild(aboutAuthorHeader.cloneNode(true));
    frag.appendChild(aboutAuthorBox.cloneNode(true));
    // Only push a single cell (left column) to avoid unnecessary empty columns
    rows.push([frag]);
  }

  // Ensure all rows after header have the same number of columns as row2
  const colCount = row2.length;
  for (let i = 1; i < rows.length; i++) {
    while (rows[i].length < colCount) {
      rows[i].push('');
    }
    while (rows[i].length > colCount) {
      rows[i].pop();
    }
  }

  // Remove unnecessary empty columns from last row if present
  if (rows.length > 2 && rows[rows.length-1].every(cell => !cell || (typeof cell === 'string' && cell.trim() === ''))) {
    rows.pop();
  }

  // If About Author row is present and its second column is empty, remove that column
  if (rows.length > 2 && rows[rows.length-1].length === 2 && (!rows[rows.length-1][1] || (typeof rows[rows.length-1][1] === 'string' && rows[rows.length-1][1].trim() === ''))) {
    rows[rows.length-1].pop();
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
