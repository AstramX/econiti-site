# EcoNiti Site Migration Plan

## Overview

**Source Site:** https://www.econiti.org/ (Squarespace)
**Target:** AEM Edge Delivery Services
**Site Type:** Economics education platform offering undergraduate and competitive exam courses
**Total Pages:** 13 content pages + 3 PDF policy documents (PDFs excluded from migration)

## Site Map

### Pages to Migrate

| # | URL | Page Type | Template |
|---|-----|-----------|----------|
| 1 | `/` (Homepage) | Landing page | Homepage |
| 2 | `/aboutus` | About / Team page | About |
| 3 | `/contact` | Contact page | Contact |
| 4 | `/testimonials` | Testimonials page | Testimonials |
| 5 | `/ecohons` | Course catalog (semester-based) | Course Catalog |
| 6 | `/undergraduate/dse` | Course info page | Course Detail |
| 7 | `/undergraduate/ge` | Course info page | Course Detail |
| 8 | `/competitive-econ/upsc` | Course landing page | Course Landing |
| 9 | `/competitive-econ/ies` | Course landing page | Course Landing |
| 10 | `/competitive-econ/rbi` | Course landing page | Course Landing |
| 11 | `/competitive-econ/pg` | Course landing page | Course Landing |
| 12 | `/competitive-econ/net-jrf` | Course landing page | Course Landing |

### External Links (Not Migrated)
- `https://dashboard.econiti.org/` — Student dashboard (external app)
- PDF policy documents (Privacy, Terms, Refund) — kept as file downloads

## Identified Page Templates

| Template | Pages | Key Characteristics |
|----------|-------|---------------------|
| **Homepage** | 1 | Hero section, value proposition text, animated image |
| **About** | 1 | Core belief section, team member cards with photos and bios |
| **Contact** | 1 | Hero banner, contact info block (email, phone, WhatsApp, address) |
| **Testimonials** | 1 | Hero banner, student testimonial cards with names and achievements |
| **Course Catalog** | 1 | Semester-organized content with subject cards, syllabus downloads, preview links, enrollment CTAs |
| **Course Landing** | 6 | Hero, accordion/expandable sections (exam structure, why choose us, course timeline), resource downloads, enrollment CTAs |

## Anticipated Block Types

| Block | Used On | Description |
|-------|---------|-------------|
| **Hero** | All pages | Full-width hero with heading, optional background image |
| **Cards** | About, Testimonials | Team member cards / testimonial cards |
| **Columns** | Course pages | Multi-column content layouts |
| **Accordion** | Course Landing pages | Expandable FAQ/content sections |
| **CTA / Buttons** | Course pages | Enrollment and preview action buttons |
| **Contact Info** | Contact page | Structured contact details block |
| **Embed** | Course Catalog | YouTube preview links |

## Migration Approach

The migration will use the `excat-site-migration` skill which provides:
- Automated site analysis and URL classification into templates
- Block variant tracking with intelligent reuse (70% similarity threshold)
- Import infrastructure generation (parsers & transformers)
- Content HTML generation for each page
- Design system extraction and CSS adaptation

## Checklist

### Phase 1: Site Analysis & Setup
- [ ] Run site analysis to classify all 12 URLs into page templates
- [ ] Review and confirm template assignments with user

### Phase 2: Design System Migration
- [ ] Extract design tokens (colors, fonts, spacing) from source site
- [ ] Apply global styles to EDS project (`styles.css`, `fonts.css`)

### Phase 3: Page Analysis & Block Mapping
- [ ] Analyze homepage and identify block variants
- [ ] Analyze About Us page and identify block variants
- [ ] Analyze Contact page and identify block variants
- [ ] Analyze Testimonials page and identify block variants
- [ ] Analyze Course Catalog page (ecohons) and identify block variants
- [ ] Analyze one Course Landing page (UPSC) as representative template
- [ ] Map all identified blocks to EDS block library or custom variants

### Phase 4: Import Infrastructure
- [ ] Generate block parsers for each identified block type
- [ ] Generate page transformers for each template
- [ ] Create import scripts combining parsers and transformers

### Phase 5: Content Import
- [ ] Import Homepage
- [ ] Import About Us page
- [ ] Import Contact page
- [ ] Import Testimonials page
- [ ] Import Course Catalog page (ecohons)
- [ ] Import Course Landing pages (UPSC, IES, RBI, PG, NET-JRF)
- [ ] Import UG pages (DSE, GE)

### Phase 6: Block Development & Styling
- [ ] Implement any custom blocks not in the standard library
- [ ] Style all block variants to match original site design
- [ ] Ensure responsive behavior across breakpoints

### Phase 7: Navigation & Footer
- [ ] Set up navigation structure (header menu with dropdowns)
- [ ] Set up footer with policy links and branding

### Phase 8: Verification & QA
- [ ] Preview all migrated pages locally
- [ ] Visual comparison against original site
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Verify all links and downloads work correctly
- [ ] Run linting and fix any issues

---

> **Note:** Execution requires exiting Plan mode. The migration will be orchestrated using the `excat:excat-site-migration` skill which coordinates all phases automatically.
