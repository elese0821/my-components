import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.scss';
import './assets/fonts/fonts.css';
import './assets/scss/style.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient()

async function enableMocking() {
    if (!import.meta.env.DEV) return
    if (import.meta.env.VITE_API_BASE_URL) return // 실서버 연결 시 MSW 비활성화
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
}

const renderApp = () => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </BrowserRouter>
        </React.StrictMode>
    )
}

enableMocking().then(renderApp).catch(() => renderApp())
