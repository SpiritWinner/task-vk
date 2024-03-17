import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import App from './App';
import bridge from '@vkontakte/vk-bridge';


bridge.send("VKWebAppInit");
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

