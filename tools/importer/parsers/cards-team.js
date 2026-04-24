/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-team variant.
 * Base block: cards
 * Source: https://www.econiti.org/aboutus
 * Extracts team member cards: image + h4 name + paragraph bio
 */
export default function parse(element, { document }) {
  // Find all team member image blocks and text blocks
  const imageBlocks = element.querySelectorAll('.image-block img');
  const textBlocks = element.querySelectorAll('.sqs-html-content');

  // Pair images with their corresponding text (name + bio)
  // Each team member has: image block + text block with h4 and p
  const cells = [];
  const memberTexts = [];

  textBlocks.forEach((textBlock) => {
    const h4 = textBlock.querySelector('h4');
    if (h4) {
      memberTexts.push(textBlock);
    }
  });

  // Match images to text blocks (they appear in order)
  const memberImages = Array.from(imageBlocks).filter((img) => {
    // Filter to portrait/team images (not decorative)
    const src = img.getAttribute('src') || '';
    return src.includes('squarespace') || src.includes('images/');
  });

  const count = Math.min(memberImages.length, memberTexts.length);
  for (let i = 0; i < count; i += 1) {
    const img = memberImages[i];
    const textBlock = memberTexts[i];

    // Build content cell with name heading + bio paragraph
    const contentDiv = document.createElement('div');
    const h4 = textBlock.querySelector('h4');
    if (h4) contentDiv.append(h4.cloneNode(true));

    const paragraphs = textBlock.querySelectorAll(':scope > p');
    paragraphs.forEach((p) => contentDiv.append(p.cloneNode(true)));

    cells.push([img, contentDiv]);
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
