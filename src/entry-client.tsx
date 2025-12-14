import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import './index.css';
import App from './App.tsx';

const container = document.getElementById('root')!;

const initialData = window.__INITIAL_DATA__;

const appElement = (
    <StrictMode>
        <BrowserRouter>
            <App initialData={initialData} />
        </BrowserRouter>
    </StrictMode>
);

if (initialData) {
    hydrateRoot(container, appElement);
} else {
    const root = createRoot(container);
    root.render(appElement);
}
