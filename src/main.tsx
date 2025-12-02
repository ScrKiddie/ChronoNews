import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* 2. Provide the client to your App */}
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
    </StrictMode>,
)
