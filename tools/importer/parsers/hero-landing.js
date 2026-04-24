/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-landing variant.
 * Base block: hero
 * Source: https://www.econiti.org/
 * Element: .fluid-engine.fe-67efc7fcfb62b1532821f89b (parent container with heading, text, image)
 */
export default function parse(element, { document }) {
  // Extract heading (H1) from first fe-block
  const heading = element.querySelector('h1, h2');

  // Extract description paragraphs from second fe-block
  const paragraphs = Array.from(element.querySelectorAll('p.sqsrte-large, .sqs-html-content p'));

  // Extract illustration image from third fe-block
  const img = element.querySelector('.image-block img, .sqs-block-image img');

  // Build cells matching hero block library structure (1 column):
  // Row 1 (optional): image
  // Row 2: heading + text content (all in single cell)
  const cells = [];

  if (img) {
    cells.push([img]);
  }

  // Combine all content into a single container for one cell
  const contentWrapper = document.createElement('div');
  if (heading) contentWrapper.append(heading);
  paragraphs.forEach((p) => contentWrapper.append(p));
  cells.push([contentWrapper]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
