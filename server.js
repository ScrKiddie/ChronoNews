import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

let vite;

const resolve = (p) => path.resolve(__dirname, p);

async function handleRequest(req, res, url, renderFunction) {
    const urlObj = new URL(url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname;

    if (pathname === '/' || pathname === '/beranda') {
        res.statusCode = 302;
        res.setHeader('Location', '/berita');
        res.end();
        return;
    }

    if (
        pathname.startsWith('/post/') ||
        pathname.startsWith('/berita') ||
        pathname.startsWith('/cari')
    ) {
        const result = await renderFunction({ url });

        if (result.redirect) {
            res.statusCode = 302;
            res.setHeader('Location', result.redirect.to);
            res.end();
            return;
        }

        const { appHtml, headHtml, initialData } = result;

        const templatePath = isProd ? resolve('dist/client/index.html') : resolve('index.html');
        const template = await fs.readFile(templatePath, 'utf-8');
        const htmlTemplate = isProd ? template : await vite.transformIndexHtml(url, template);
        const safeJsonData = JSON.stringify(initialData).replace(/</g, '\\u003c');
        const html = htmlTemplate
            .replace('<!--ssr-head-outlet-->', headHtml)
            .replace('<!--ssr-outlet-->', appHtml)
            .replace(
                'window.__INITIAL_DATA__ = undefined;',
                `window.__INITIAL_DATA__ = ${safeJsonData};`
            );

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
        return;
    }

    const templatePath = isProd ? resolve('dist/client/index.html') : resolve('index.html');
    const template = await fs.readFile(templatePath, 'utf-8');
    const htmlTemplate = isProd ? template : await vite.transformIndexHtml(url, template);
    const html = htmlTemplate.replace('<!--ssr-outlet-->', '');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
}

async function createSsrServer() {
    const app = createServer(async (req, res) => {
        try {
            const url = req.url;

            if (!isProd) {
                if (!vite) {
                    vite = await import('vite').then((i) =>
                        i.createServer({
                            server: { middlewareMode: true },
                            appType: 'custom',
                            root: resolve('./'),
                        })
                    );
                }

                await new Promise((resolveMiddleware) =>
                    vite.middlewares(req, res, resolveMiddleware)
                );
                if (res.headersSent) return;

                const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
                await handleRequest(req, res, url, render);
            } else {
                const filePath = resolve(
                    'dist/client' + new URL(url, `http://${req.headers.host}`).pathname
                );
                try {
                    const stat = await fs.stat(filePath);
                    if (stat.isFile()) {
                        const content = await fs.readFile(filePath);
                        const ext = path.extname(filePath);
                        let contentType = 'application/octet-stream';
                        if (ext === '.js') contentType = 'application/javascript';
                        else if (ext === '.css') contentType = 'text/css';
                        else if (ext === '.svg') contentType = 'image/svg+xml';
                        else if (ext === '.html') contentType = 'text/html';
                        res.setHeader('Content-Type', contentType);
                        res.statusCode = 200;
                        res.end(content);
                        return;
                    }
                } catch (e) {
                    if (e.code !== 'ENOENT') {
                        throw e;
                    }
                }

                const { render } = await import('./dist/server/entry-server.js');
                await handleRequest(req, res, url, render);
            }
        } catch (e) {
            if (!isProd && vite) vite.ssrFixStacktrace(e);
            console.error(e);
            res.statusCode = 500;
            res.end(e.stack);
        }
    });

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

createSsrServer();
