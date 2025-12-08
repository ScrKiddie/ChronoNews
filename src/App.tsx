import 'primereact/resources/themes/lara-light-amber/theme.css';
import 'primeicons/primeicons.css';
import { AuthProvider } from './context/AuthProvider.tsx';
import { ToastProvider } from './context/ToastProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APIOptions, PrimeReactProvider } from 'primereact/api';
import { Route, Routes } from 'react-router-dom';
import GuestRoutes from './routes/GuestRoutes.tsx';
import AuthRoutes from './routes/AuthRoutes.tsx';
import { InitialDataStructure } from './types/initialData.tsx';

interface AppProps {
    initialData?: InitialDataStructure;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const primeReactConfig: Partial<APIOptions> = {
    autoZIndex: false,
    zIndex: {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1101,
        toast: 2000,
    },
    ripple: true,
    pt: {
        button: {
            root: {
                className:
                    'outline-none border-0 focus:border-0 focus:outline-none focus:ring-0 box-shadow-none',
            },
        },
        toast: {
            root: {
                className: 'm-0',
            },
        },
    },
};

const App = ({ initialData }: AppProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <PrimeReactProvider value={primeReactConfig}>
                    <ToastProvider>
                        <Routes>
                            <Route path="/*" element={<GuestRoutes initialData={initialData} />} />
                            <Route path="/admin/*" element={<AuthRoutes />} />
                        </Routes>
                    </ToastProvider>
                </PrimeReactProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
