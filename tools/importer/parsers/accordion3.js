/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract FAQ accordion items from the block
  function extractFaqs(container) {
    const faqs = [];
    // Each FAQ is a .AIlHVK (or .AIlHVK.NtWoKR) element
    const faqItems = container.querySelectorAll('.AIlHVK, .AIlHVK.NtWoKR');
    faqItems.forEach(faq => {
      // Title: from h3
      const title = faq.querySelector('h3');
      // Content: .cJ7AvK > .UtdecX (may contain p, ul, etc)
      const contentBox = faq.querySelector('.cJ7AvK .UtdecX');
      if (title && contentBox) {
        faqs.push([title, contentBox]);
      }
    });
    return faqs;
  }

  // Find the FAQ container (should work for all provided HTML)
  let faqContainer = element.querySelector('#faq-container .HuE9zd.container');
  if (!faqContainer) {
    // Defensive: fallback to any .HuE9zd.container inside #faq-container
    faqContainer = element.querySelector('#faq-container') || element.querySelector('.HuE9zd.container');
  }
  if (!faqContainer) return; // No FAQs found, nothing to do

  // Compose the table rows
  const headerRow = ['Accordion (accordion3)'];
  const faqRows = extractFaqs(faqContainer);
  if (faqRows.length === 0) return; // No FAQ items found

  const rows = [headerRow, ...faqRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original FAQ block with the accordion table
  faqContainer.parentNode.replaceChild(table, faqContainer);
}
