import { generateDefaultHead } from './generatePostHead';

export const restoreDefaultHead = () => {
    const htmlString = generateDefaultHead();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const newTitle = doc.querySelector('title');
    if (newTitle) {
        document.title = newTitle.innerText;
    }

    const managedSelectors = [
        'meta[name="description"]',
        'meta[name="author"]',
        'meta[name="keywords"]',
        'meta[property^="og:"]',
        'meta[property^="article:"]',
        'meta[property^="twitter:"]',
        'meta[name^="twitter:"]',
        'link[rel="canonical"]',
        'script[type="application/ld+json"]',
    ];

    managedSelectors.forEach((selector) => {
        document.head.querySelectorAll(selector).forEach((el) => el.remove());
    });

    Array.from(doc.head.children).forEach((child) => {
        if (child.tagName.toLowerCase() === 'title') return;

        const newNode = document.importNode(child, true);
        document.head.appendChild(newNode);
    });
};
