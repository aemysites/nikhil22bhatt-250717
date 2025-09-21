/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns (columns4)'];

  // Defensive: Get immediate children of the block
  const mainChildren = Array.from(element.querySelectorAll(':scope > div'));
  if (mainChildren.length < 2) {
    // Not enough columns, fallback to whole element in one cell
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      [element]
    ], document);
    element.replaceWith(table);
    return;
  }

  // Left column: logo + contact info
  const leftCol = mainChildren[0];

  // Right column: social + logo
  const rightCol = mainChildren[1];

  // Defensive: further split leftCol into logo and contact
  const leftColChildren = Array.from(leftCol.querySelectorAll(':scope > div'));
  // logo
  const logoDiv = leftColChildren[0];
  // contact info
  const contactDiv = leftColChildren[1];

  // Defensive: further split rightCol into social and logo
  const rightColChildren = Array.from(rightCol.querySelectorAll(':scope > div'));
  // social heading
  const socialHeadingDiv = rightColChildren[0];
  // social icons
  const socialIconsDiv = rightColChildren[1];
  // right logo
  const rightLogoDiv = rightColChildren[2];

  // Compose left cell: logo + contact info
  const leftCell = document.createElement('div');
  if (logoDiv) leftCell.appendChild(logoDiv);
  if (contactDiv) leftCell.appendChild(contactDiv);

  // Compose right cell: social heading + icons + right logo
  const rightCell = document.createElement('div');
  if (socialHeadingDiv) rightCell.appendChild(socialHeadingDiv);
  if (socialIconsDiv) rightCell.appendChild(socialIconsDiv);
  if (rightLogoDiv) rightCell.appendChild(rightLogoDiv);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCell, rightCell]
  ], document);

  element.replaceWith(table);
}
