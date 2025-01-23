type TRecaptchaState = {
    queue: Array<{
        type: 'install';
        payload: {
            elementOrId: string | HTMLDivElement;
            options: {
                identifier: string;
                siteKey: string;
            };
        };
    }>;
    identifiers: Record<string, number | string>;
    promises: Record<string, undefined | [(token: string) => void, (reason?: any) => void] | []>
}

const RecaptchaState: TRecaptchaState = {
    queue: [],
    identifiers: {},
    promises: {},
};

const getState = <T extends keyof TRecaptchaState>(state: T): TRecaptchaState[T] => {
    return RecaptchaState[state];
};

export const setState = <T extends keyof TRecaptchaState>(state: T, value: TRecaptchaState[T]) => {
    RecaptchaState[state] = value;
};

export const getIdentifiers = () => {
    return getState('identifiers');
};

export const getQueue = () => {
    return getState('queue');
};

export const getPromises = () => {
    return getState('promises');
};

export const getPromisesByIdentifier = (identifier: string) => {
    return getState('promises')[identifier] ?? [];
};

export const setIdentifiers = (identifiers: TRecaptchaState['identifiers']) => {
    setState('identifiers', identifiers);
};

export const setPromises = (promises: TRecaptchaState['promises']) => {
    setState('promises', promises);
};

export const setQueue = (queue: TRecaptchaState['queue']) => {
    setState('queue', queue);
};
