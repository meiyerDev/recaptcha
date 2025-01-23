import { getIdentifiers, getPromises, getPromisesByIdentifier, getQueue, setIdentifiers, setPromises, setQueue } from "./state";

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
    const queue = getQueue();
    queue.forEach((item) => {
        const commonOptions = {
            size: "invisible",
            sitekey: item.payload.options.siteKey,
            callback: (token: string) => {
                const promise = getPromisesByIdentifier(item.payload.options.identifier);
                if (!promise || promise.length === 0) return;

                const [resolve] = promise;
                resolve(token);
            },
            "error-callback": () => {
                const promise = getPromisesByIdentifier(item.payload.options.identifier);
                if (!promise || promise.length === 0) return;

                const [, reject] = promise;
                reject(REASON_ERRORS.E_RECAPTCHA_FAILED);
            }
        };

        const identifiers = getIdentifiers();
        identifiers[item.payload.options.identifier] = window.grecaptcha.render(
            item.payload.elementOrId,
            commonOptions
        );
        setIdentifiers(identifiers);
    });
}

const cancel = (identifier: string) => {
    const promises = getPromises();
    const promise = promises[identifier];
    if (promise !== undefined && promise.length === 2) {
        const [, reject] = promise;
        reject(REASON_ERRORS.E_RECAPTCHA_CANCELED);
        promises[identifier] = [];
        setPromises(promises)
    }
};

export const reset = (identifier: string) => {
    return new Promise<void>((resolve, reject) => {
        const identifiers = getIdentifiers();
        if (!window.grecaptcha || identifiers[identifier] === undefined) {
            reject(REASON_ERRORS.E_RECAPTCHA_NOT_LOADED);
            return;
        }

        window.grecaptcha.reset(identifiers[identifier].toString());
        resolve();
    });
}

export const execute = (identifier: string) => {
    return new Promise<string>((resolve, reject) => {
        const identifiers = getIdentifiers();
        if (!window.grecaptcha || identifiers[identifier] === undefined) {
            reject(REASON_ERRORS.E_RECAPTCHA_NOT_LOADED);
            return;
        }

        cancel(identifier);

        const promises = getPromises();
        promises[identifier] = [resolve, reject];
        setPromises(promises);

        window.grecaptcha.execute(identifiers[identifier].toString());
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
    const queue = getQueue();
    if (!queue.some((item) => item.payload.options.identifier === options.identifier && item.payload.elementOrId === elementOrId)) {
        queue.push({
            type: 'install',
            payload: { elementOrId, options },
        });
        setQueue(queue);
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