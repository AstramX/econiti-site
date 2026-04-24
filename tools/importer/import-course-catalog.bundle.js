var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-course-catalog.js
  var import_course_catalog_exports = {};
  __export(import_course_catalog_exports, {
    default: () => import_course_catalog_default
  });

  // tools/importer/transformers/econiti-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".yui-popup-container-node",
        "#yui3-css-stamp",
        "template",
        ".sqs-announcement-bar-dropzone"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "footer#footer-sections",
        "#floatingCart",
        ".header-menu",
        "noscript",
        "link",
        ".section-divider-display"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-animation-state");
        el.removeAttribute("data-controller");
      });
    }
  }

  // tools/importer/parsers/columns-semester.js
  function parse(element, { document }) {
    const heading = element.querySelector("h2");
    const blockquote = element.querySelector("blockquote");
    const images = Array.from(element.querySelectorAll(".image-block img, .sqs-block-image img"));
    const links = Array.from(element.querySelectorAll("a[href]"));
    if (!heading) return;
    const leftCol = document.createElement("div");
    leftCol.append(heading.cloneNode(true));
    if (blockquote) leftCol.append(blockquote.cloneNode(true));
    const rightCol = document.createElement("div");
    images.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (src.includes("squarespace") || src.includes("images/")) {
        rightCol.append(img.cloneNode(true));
      }
    });
    const cells = [[leftCol, rightCol]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-highlight", cells });
    const ctaContainer = document.createElement("div");
    links.forEach((link) => {
      const text = link.textContent.trim();
      if (text === "Syllabus" || text === "Preview" || text === "Enrol") {
        const p = document.createElement("p");
        p.append(link.cloneNode(true));
        ctaContainer.append(p);
      }
    });
    const wrapper = document.createElement("div");
    wrapper.append(block);
    if (ctaContainer.children.length > 0) {
      wrapper.append(ctaContainer);
    }
    element.replaceWith(wrapper);
  }

  // tools/importer/import-course-catalog.js
  var transformers = [transform];
  var parsers = { "columns-semester": parse };
  var PAGE_TEMPLATE = {
    name: "course-catalog",
    urls: ["https://www.econiti.org/ecohons"],
    blocks: [
      { name: "columns-semester", instances: ["article > section.page-section .fluid-engine"] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(e);
      }
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
  var import_course_catalog_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Parse ${block.name}:`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      document.querySelectorAll('meta[content*="++"]').forEach((meta) => {
        meta.setAttribute("content", meta.getAttribute("content").replace(/\+\+/g, "__"));
      });
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      try {
        WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      } catch (e) {
      }
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_course_catalog_exports);
})();
