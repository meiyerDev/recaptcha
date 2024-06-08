export type RecaptchaOptions = {
    identifier: string;
    siteKey: string;
};

const REASON_ERRORS = {
    E_RECAPTCHA_NOT_LOADED: "reCAPTCHA is not loaded",
    E_RECAPTCHA_FAILED: "reCAPTCHA failed",
    E_RECAPTCHA_CANCELED: "reCAPTCHA canceled",
};

const executeQueueInstall = () => {
    const queue = window.__reacaptchaQueue || [];
    window.__recaptchaIdentifiers = window.__recaptchaIdentifiers || {};
    queue.forEach((item) => {
        const commonOptions = {
            size: "invisible",
            sitekey: item.payload.options.siteKey,
            callback: (token: string) => {
                const promise = window.__recaptchaPromises[item.payload.options.identifier];
                if (promise.length === 0) return;

                const [resolve] = promise;
                resolve(token);
            },
            "error-callback": () => {
                const promise = window.__recaptchaPromises[item.payload.options.identifier];
                if (promise.length === 0) return;

                const [, reject] = promise;
                reject(REASON_ERRORS.E_RECAPTCHA_FAILED);
            }
        };
        window.__recaptchaIdentifiers[item.payload.options.identifier] = window.grecaptcha.render(
            item.payload.elementOrId,
            commonOptions
        );
    });
}

const cancel = (identifier: string) => {
    window.__recaptchaPromises = window.__recaptchaPromises || {};
    const promise = window.__recaptchaPromises[identifier];
    if (promise !== undefined && promise.length === 2) {
        const [, reject] = promise;
        reject(REASON_ERRORS.E_RECAPTCHA_CANCELED);
        window.__recaptchaPromises[identifier] = [];
    }
};

export const reset = (identifier: string) => {
    window.__recaptchaIdentifiers = window.__recaptchaIdentifiers || {};
    window.__recaptchaPromises = window.__recaptchaPromises || {};
    return new Promise<void>((resolve, reject) => {
        if (!window.grecaptcha || window.__recaptchaIdentifiers[identifier] === undefined) {
            reject(REASON_ERRORS.E_RECAPTCHA_NOT_LOADED);
            return;
        }

        window.grecaptcha.reset(window.__recaptchaIdentifiers[identifier].toString());
        resolve();
    });

}

export const execute = (identifier: string) => {
    window.__recaptchaIdentifiers = window.__recaptchaIdentifiers || {};
    window.__recaptchaPromises = window.__recaptchaPromises || {};
    return new Promise<string>((resolve, reject) => {
        if (!window.grecaptcha || window.__recaptchaIdentifiers[identifier] === undefined) {
            reject(REASON_ERRORS.E_RECAPTCHA_NOT_LOADED);
            return;
        }

        cancel(identifier);

        window.__recaptchaPromises[identifier] = [resolve, reject];
        window.grecaptcha.execute(window.__recaptchaIdentifiers[identifier].toString());
    });
}

export const checkIsLoaded = () => {
    if (window === undefined) {
        return false;
    }

    return !!window.__executeRecaptchaQueueInstall
        && (Object.hasOwn(window, "grecaptcha") && Object.hasOwn(window.grecaptcha, "execute"));
};

export const install = (elementOrId: string | HTMLDivElement, options: RecaptchaOptions) => {
    window.__reacaptchaQueue = window.__reacaptchaQueue || [];
    if (!window.__reacaptchaQueue.some((item) => item.payload.options.identifier === options.identifier && item.payload.elementOrId === elementOrId)) {
        window.__reacaptchaQueue.push({
            type: 'install',
            payload: { elementOrId, options },
        });
    }

    if (checkIsLoaded()) {
        executeQueueInstall();
        return;
    }

    window.__executeRecaptchaQueueInstall = executeQueueInstall;
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?onload=__executeRecaptchaQueueInstall";
    script.async = true;
    script.defer = true;

    document.head.append(script);
}