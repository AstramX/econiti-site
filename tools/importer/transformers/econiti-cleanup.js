/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EcoNiti cleanup.
 * Selectors from captured DOM of https://www.econiti.org/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove Squarespace popup overlays and lightbox templates that may interfere with parsing
    WebImporter.DOMUtils.remove(element, [
      '.yui-popup-container-node',
      '#yui3-css-stamp',
      'template',
      '.sqs-announcement-bar-dropzone',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'footer#footer-sections',
      '#floatingCart',
      '.header-menu',
      'noscript',
      'link',
      '.section-divider-display',
    ]);
    // Clean Squarespace tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-animation-state');
      el.removeAttribute('data-controller');
    });
  }
}
