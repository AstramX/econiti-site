/* eslint-disable */
/* global WebImporter */

import econotiCleanupTransformer from './transformers/econiti-cleanup.js';
import columnsHighlightParser from './parsers/columns-highlight.js';
import cardsTeamParser from './parsers/cards-team.js';

const transformers = [econotiCleanupTransformer];
const parsers = {
  'columns-highlight': columnsHighlightParser,
  'cards-team': cardsTeamParser,
};

const PAGE_TEMPLATE = {
  name: 'about-page',
  urls: ['https://www.econiti.org/aboutus'],
  blocks: [
    { name: 'columns-highlight', instances: ['article > section.page-section:first-of-type .fluid-engine'] },
    { name: 'cards-team', instances: ['article > section.page-section:nth-of-type(2) .fluid-engine'] },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        pageBlocks.push({ name: blockDef.name, selector, element: el });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Parse ${block.name}:`, e); }
      }
    });
    executeTransformers('afterTransform', main, payload);
    document.querySelectorAll('meta[content*="++"]').forEach((meta) => {
      meta.setAttribute('content', meta.getAttribute('content').replace(/\+\+/g, '__'));
    });
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    try { WebImporter.rules.adjustImageUrls(main, url, params.originalURL); } catch (e) { /* safe */ }
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
