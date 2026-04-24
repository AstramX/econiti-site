/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-highlight variant.
 * Extracts two-column layout: text content on left, image on right.
 * Used for "Our Core Belief" section on about page and similar layouts.
 */
export default function parse(element, { document }) {
  // Find the heading
  const heading = element.querySelector('h1, h2');
  // Find text paragraphs (in sqs-html-content blocks)
  const textBlocks = element.querySelectorAll('.sqs-html-content');
  const paragraphs = [];
  textBlocks.forEach((tb) => {
    tb.querySelectorAll(':scope > p').forEach((p) => {
      if (p.textContent.trim()) paragraphs.push(p);
    });
  });

  // Find the main image
  const img = element.querySelector('.image-block img, .sqs-block-image img');

  if (!heading && paragraphs.length === 0) return;

  // Build left column (text content)
  const leftCol = document.createElement('div');
  if (heading) leftCol.append(heading.cloneNode(true));
  paragraphs.forEach((p) => leftCol.append(p.cloneNode(true)));

  // Build right column (image)
  const rightCol = document.createElement('div');
  if (img) rightCol.append(img.cloneNode(true));

  const cells = [[leftCol, rightCol]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-highlight', cells });
  element.replaceWith(block);
}
