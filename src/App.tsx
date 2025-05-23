import MainRouter from "./routers/MainRouter";
import {APIOptions, PrimeReactProvider} from 'primereact/api';
import "primereact/resources/themes/lara-light-amber/theme.css";
import "primeicons/primeicons.css";
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {ToastProvider} from "./contexts/ToastContext.tsx";

const primeReactConfig: Partial<APIOptions> = {
    autoZIndex:false,
    zIndex:{
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
                    "outline-none border-0 focus:border-0 focus:outline-none focus:ring-0 box-shadow-none",
            },
        },
        toast: {
            root: {
                className: "m-0",
            },
        },
    },
}
const App = () => {
    return (
        <AuthProvider>
            <PrimeReactProvider value={primeReactConfig}>
                <ToastProvider>
                    <MainRouter/>
                </ToastProvider>
            </PrimeReactProvider>
        </AuthProvider>
    );
};

export default App;
