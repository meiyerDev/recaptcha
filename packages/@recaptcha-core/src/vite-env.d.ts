/// <reference types="vite/client" />

interface Window {
    __executeRecaptchaQueueInstall: () => void;
    __reacaptchaQueue: Array<{
        type: 'install';
        payload: {
            elementOrId: string | HTMLDivElement;
            options: {
                identifier: string;
                siteKey: string;
            };
        };
    }>;
    __recaptchaIdentifiers: Record<string, number | string>;
    __recaptchaPromises: Record<string, [(token: string) => void, (reason?: any) => void] | []>;
    grecaptcha: {
        execute: (widgetId: string) => Promise<string>;
        render: (element: HTMLElement | string, options: { size: string, sitekey: string, callback: (token: string) => void }) => number;
        reset: (widgetId: number | string) => void;
        getResponse: (widgetId: number) => string;
    }
}