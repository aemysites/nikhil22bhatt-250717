/* global WebImporter */
export default function parse(element, { document }) {
  // Get the immediate children of the root element
  const rootDivs = Array.from(element.children);

  // Defensive: find the main content wrapper (the first child with class _NY5Sh)
  let mainContent = rootDivs.find(div => div.classList.contains('_NY5Sh')) || rootDivs[0];
  if (!mainContent) {
    // fallback: use the element itself
    mainContent = element;
  }

  // Get the two main columns: left (images), right (text+buttons)
  // Usually, structure is: <div class="_NY5Sh"><div class="NNtwez">...</div><div class="_b504b">...</div></div>
  const columns = Array.from(mainContent.children);
  let leftCol = columns.find(div => div.classList.contains('NNtwez')) || columns[0];
  let rightCol = columns.find(div => div.classList.contains('_b504b')) || columns[1];

  // Defensive: if not found, fallback to first and second child
  if (!leftCol) leftCol = columns[0];
  if (!rightCol) rightCol = columns[1];

  // Prepare the header row
  const headerRow = ['Columns (columns2)'];

  // Prepare the columns row
  // For leftCol: collect all images
  const leftImages = Array.from(leftCol.querySelectorAll('img'));

  // For rightCol: collect all content (text, buttons)
  // We'll include all children of rightCol
  const rightColChildren = Array.from(rightCol.children);

  // Compose right column content: wrap all children in a fragment
  const rightColFragment = document.createDocumentFragment();
  rightColChildren.forEach(child => rightColFragment.appendChild(child.cloneNode(true)));

  // Compose left column content: wrap all images in a fragment
  const leftColFragment = document.createDocumentFragment();
  leftImages.forEach(img => leftColFragment.appendChild(img));

  // Build the table rows
  const tableRows = [
    headerRow,
    [leftColFragment, rightColFragment]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
