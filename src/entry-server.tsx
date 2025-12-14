import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import fetchInitialData from './lib/utils/fetchInitialData.tsx';
import { generatePostHead, generateDefaultHead } from './lib/utils/generatePostHead.tsx';

export { generateDefaultHead };

interface RenderOptions {
    url: string;
}

export async function render(options: RenderOptions) {
    const { url } = options;
    const urlObj = new URL(url, 'http://localhost');
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    const dataOrRedirect = await fetchInitialData(pathname, searchParams);

    if ('redirect' in dataOrRedirect) {
        return { redirect: dataOrRedirect.redirect };
    }

    let headHtml;
    if (dataOrRedirect.post) {
        headHtml = generatePostHead(dataOrRedirect.post);
    } else {
        headHtml = generateDefaultHead();
    }

    const appHtml = ReactDOMServer.renderToString(
        <StaticRouter location={url}>
            <App initialData={dataOrRedirect} />
        </StaticRouter>
    );

    return { appHtml, headHtml, initialData: dataOrRedirect };
}
