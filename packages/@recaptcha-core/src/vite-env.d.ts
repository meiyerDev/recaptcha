/// <reference types="vite/client" />

interface Window {
    __executeRecaptchaQueueInstall: () => void;
    grecaptcha: {
        execute: (widgetId: string) => Promise<string>;
        render: (element: HTMLElement | string, options: { size: string, sitekey: string, callback: (token: string) => void }) => number;
        reset: (widgetId: number | string) => void;
        getResponse: (widgetId: number) => string;
    }
}