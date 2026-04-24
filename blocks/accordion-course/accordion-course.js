export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-course-item-label';
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-course-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-course-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
