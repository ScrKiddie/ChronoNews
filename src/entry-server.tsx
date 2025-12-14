import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import initialDataUtils from './utils/initialDataUtils.ts';
import { headUtils, generateDefaultHead } from './utils/headUtils.ts';

export { generateDefaultHead };

interface RenderOptions {
    url: string;
}

export async function render(options: RenderOptions) {
    const { url } = options;
    const urlObj = new URL(url, 'http://localhost');
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    const dataOrRedirect = await initialDataUtils(pathname, searchParams);

    if ('redirect' in dataOrRedirect) {
        return { redirect: dataOrRedirect.redirect };
    }

    let headHtml;
    if (dataOrRedirect.post) {
        headHtml = headUtils(dataOrRedirect.post);
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
