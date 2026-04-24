/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-course variant.
 * Base block: accordion
 * Source: https://www.econiti.org/competitive-econ/upsc
 * Extracts Squarespace accordion items: h4 title + content body
 */
export default function parse(element, { document }) {
  // Squarespace accordion uses .accordion-items-container > .accordion-item
  const items = element.querySelectorAll('.accordion-item');

  if (items.length === 0) return;

  const cells = [];

  items.forEach((item) => {
    // Title is in the header/button area
    const titleEl = item.querySelector('h4, .accordion-item__title, .accordion-item__click-target');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // Body content
    const bodyEl = item.querySelector('.accordion-item__dropdown, .accordion-item__content');
    const bodyContent = document.createElement('div');

    if (bodyEl) {
      // Clone all content paragraphs from the body
      const bodyParagraphs = bodyEl.querySelectorAll('p, ul, ol, h5, h6');
      bodyParagraphs.forEach((el) => bodyContent.append(el.cloneNode(true)));
    }

    if (titleText) {
      const titleDiv = document.createElement('div');
      const h4 = document.createElement('h4');
      h4.textContent = titleText;
      titleDiv.append(h4);
      cells.push([titleDiv, bodyContent]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-course', cells });
  element.replaceWith(block);
}
