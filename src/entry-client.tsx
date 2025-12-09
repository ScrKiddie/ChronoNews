import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import './index.css';
import App from './App.tsx';

const container = document.getElementById('root')!;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialData = (window as any).__INITIAL_DATA__;

const appElement = (
    <StrictMode>
        <BrowserRouter>
            <App initialData={initialData} />
        </BrowserRouter>
    </StrictMode>
);

const revealContent = () => {
    requestAnimationFrame(() => {
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';

        setTimeout(() => {
            const antiFoucStyle = document.getElementById('anti-fouc');
            if (antiFoucStyle) antiFoucStyle.remove();
        }, 500);
    });
};

if (initialData) {
    hydrateRoot(container, appElement);
    revealContent();
} else {
    const root = createRoot(container);
    root.render(appElement);
    revealContent();
}
