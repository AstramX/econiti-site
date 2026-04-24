/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-team variant (reused for testimonials).
 * Source: https://www.econiti.org/testimonials
 * Extracts testimonial cards: student photo + testimonial text + name + credentials
 */
export default function parse(element, { document }) {
  // Squarespace testimonial cards in fluid engine
  // Each testimonial has: image + text content (quote + name + credentials)
  const feBlocks = element.querySelectorAll('.fe-block');
  const cells = [];

  let currentImage = null;

  feBlocks.forEach((feBlock) => {
    const img = feBlock.querySelector('.image-block img, .sqs-block-image img');
    const textContent = feBlock.querySelector('.sqs-html-content');

    if (img && !textContent) {
      currentImage = img;
    } else if (textContent) {
      const contentDiv = document.createElement('div');
      const paragraphs = textContent.querySelectorAll(':scope > p');
      paragraphs.forEach((p) => contentDiv.append(p.cloneNode(true)));

      if (contentDiv.children.length > 0) {
        if (currentImage) {
          cells.push([currentImage, contentDiv]);
          currentImage = null;
        } else {
          cells.push([contentDiv]);
        }
      }
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
