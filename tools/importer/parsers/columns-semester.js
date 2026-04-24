/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-highlight variant used for semester sections.
 * Extracts: H2 semester heading + blockquote description on left, subject images + CTAs on right.
 * Source: https://www.econiti.org/ecohons
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h2');
  const blockquote = element.querySelector('blockquote');
  const images = Array.from(element.querySelectorAll('.image-block img, .sqs-block-image img'));
  const links = Array.from(element.querySelectorAll('a[href]'));

  if (!heading) return;

  // Left column: heading + description
  const leftCol = document.createElement('div');
  leftCol.append(heading.cloneNode(true));
  if (blockquote) leftCol.append(blockquote.cloneNode(true));

  // Right column: subject images
  const rightCol = document.createElement('div');
  images.forEach((img) => {
    const src = img.getAttribute('src') || '';
    // Skip decorative divider images, include subject thumbnails
    if (src.includes('squarespace') || src.includes('images/')) {
      rightCol.append(img.cloneNode(true));
    }
  });

  const cells = [[leftCol, rightCol]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-highlight', cells });

  // Keep CTA links (Syllabus, Preview, Enrol) as default content after the block
  const ctaContainer = document.createElement('div');
  links.forEach((link) => {
    const text = link.textContent.trim();
    if (text === 'Syllabus' || text === 'Preview' || text === 'Enrol') {
      const p = document.createElement('p');
      p.append(link.cloneNode(true));
      ctaContainer.append(p);
    }
  });

  const wrapper = document.createElement('div');
  wrapper.append(block);
  if (ctaContainer.children.length > 0) {
    wrapper.append(ctaContainer);
  }

  element.replaceWith(wrapper);
}
