import { Post } from '../../types/post.tsx';
import he from 'he';

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export function generatePostHead(post: Post): string {
    const postUrl = `${baseUrl}/post/${post.id}`;

    const imageUrl = post.thumbnail
        ? `${apiUri}/post_picture/${post.thumbnail}`
        : `${baseUrl}/thumbnail.svg`;

    const authorImageUrl = post.user?.profilePicture
        ? `${apiUri}/profile_picture/${post.user.profilePicture}`
        : `${baseUrl}/profilepicture.svg`;

    const publisherLogoUrl = `${baseUrl}/chrononews.svg`;

    const siteName = 'ChronoNews';
    const twitterHandle = '@chrononews';

    const safeTitle = he.encode(post.title);
    const safeSummary = he.encode(post.summary);
    const safeCategory = post.category?.name ? he.encode(post.category.name) : 'Berita';
    const safeAuthorName = post.user?.name ? he.encode(post.user.name) : 'Anonymous';

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.title,
        image: [imageUrl],
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
            '@type': 'Person',
            name: post.user?.name || 'Anonymous',
            image: authorImageUrl,
        },
        description: post.summary,
        publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
                '@type': 'ImageObject',
                url: publisherLogoUrl,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
        },
    };

    const safeJsonLd = JSON.stringify(structuredData).replace(/</g, '\\u003c');

    return `
        <title>${safeTitle} - ${safeCategory} | ${siteName}</title>
        <meta name="description" content="${safeSummary}" />
        <meta name="author" content="${safeAuthorName}" />
        <link rel="canonical" href="${postUrl}" />

        <meta property="og:type" content="article" />
        <meta property="og:url" content="${postUrl}" />
        <meta property="og:title" content="${safeTitle}" />
        <meta property="og:description" content="${safeSummary}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:site_name" content="${siteName}" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="${postUrl}" />
        <meta property="twitter:title" content="${safeTitle}" />
        <meta property="twitter:description" content="${safeSummary}" />
        <meta property="twitter:image" content="${imageUrl}" />
        <meta property="twitter:site" content="${twitterHandle}" />
        <meta property="twitter:creator" content="${twitterHandle}" />

        <script type="application/ld+json">
            ${safeJsonLd}
        </script>
    `;
}

export function generateDefaultHead(): string {
    return `
        <title>ChronoNews - Portal Berita Terkini</title>
        <meta name="description" content="Dapatkan berita terkini dan terpercaya dari berbagai kategori hanya di ChronoNews." />
        <link rel="canonical" href="${baseUrl}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${baseUrl}" />
        <meta property="og:title" content="ChronoNews - Portal Berita Terkini" />
        <meta property="og:description" content="Dapatkan berita terkini dan terpercaya dari berbagai kategori hanya di ChronoNews." />
        
        <meta property="og:image" content="${baseUrl}/chrononews.svg" />
        <meta property="og:site_name" content="ChronoNews" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="${baseUrl}" />
        <meta property="twitter:title" content="ChronoNews - Portal Berita Terkini" />
        <meta property="twitter:description" content="Dapatkan berita terkini dan terpercaya dari berbagai kategori hanya di ChronoNews." />
        <meta property="twitter:image" content="${baseUrl}/chrononews.svg" />
        <meta property="twitter:site" content="@chrononews" />
    `;
}
