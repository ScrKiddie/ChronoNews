import { Post } from '../../types/post.tsx';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export function generatePostHead(post: Post): string {
    const postUrl = `${BASE_URL}/post/${post.id}`;

    const imageUrl = post.thumbnail
        ? `${apiUri}/post_picture/${post.thumbnail}`
        : `${BASE_URL}/src/assets/thumbnail.svg`;

    const authorImageUrl = post.user?.profilePicture
        ? `${apiUri}/profile_picture/${post.user.profilePicture}`
        : `${BASE_URL}/src/assets/profilepicture.svg`;

    const publisherLogoUrl = `${BASE_URL}/chrononews.svg`;

    const siteName = 'ChronoNews';
    const twitterHandle = '@chrononews';

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

    return `
        <title>${post.title} - ${post.category?.name || 'Berita'} | ${siteName}</title>
        <meta name="description" content="${post.summary}" />
        <link rel="canonical" href="${postUrl}" />

        <meta property="og:type" content="article" />
        <meta property="og:url" content="${postUrl}" />
        <meta property="og:title" content="${post.title}" />
        <meta property="og:description" content="${post.summary}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:site_name" content="${siteName}" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="${postUrl}" />
        <meta property="twitter:title" content="${post.title}" />
        <meta property="twitter:description" content="${post.summary}" />
        <meta property="twitter:image" content="${imageUrl}" />
        <meta property="twitter:site" content="${twitterHandle}" />
        <meta property="twitter:creator" content="${twitterHandle}" />

        <script type="application/ld+json">
            ${JSON.stringify(structuredData)}
        </script>
    `;
}

export function generateDefaultHead(): string {
    return `
        <title>ChronoNews - Portal Berita Terkini</title>
        <meta name="description" content="Dapatkan berita terkini dan terpercaya dari berbagai kategori hanya di ChronoNews." />
        <link rel="canonical" href="${BASE_URL}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${BASE_URL}" />
        <meta property="og:title" content="ChronoNews - Portal Berita Terkini" />
        <meta property="og:description" content="Dapatkan berita terkini dan terpercaya dari berbagai kategori hanya di ChronoNews." />
        
        <meta property="og:image" content="${BASE_URL}/chrononews.svg" />
        <meta property="og:site_name" content="ChronoNews" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="${BASE_URL}" />
        <meta property="twitter:title" content="ChronoNews - Portal Berita Terkini" />
        <meta property="twitter:description" content="Dapatkan berita terkini dan terpercaya dari berbagai kategori hanya di ChronoNews." />
        <meta property="twitter:image" content="${BASE_URL}/chrononews.svg" />
        <meta property="twitter:site" content="@chrononews" />
    `;
}
