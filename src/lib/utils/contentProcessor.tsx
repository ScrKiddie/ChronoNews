const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const processContentForEditor = (htmlContent: string): string => {
    if (typeof window === 'undefined') return htmlContent || '';

    if (!htmlContent) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    doc.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
            img.setAttribute('src', `${apiUri}/post_picture/${src}`);
        }
    });
    return doc.body.innerHTML;
};

export const reverseProcessContentForServer = (htmlContent: string): string => {
    if (typeof window === 'undefined') return htmlContent || '';

    if (!htmlContent) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    doc.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && src.startsWith(`${apiUri}/post_picture/`)) {
            img.setAttribute('src', src.replace(`${apiUri}/post_picture/`, ''));
        }
    });
    return doc.body.innerHTML;
};
