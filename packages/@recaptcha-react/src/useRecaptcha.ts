import { RecaptchaOptions, execute, install, reset } from "@recaptcha/core";
import { MutableRefObject, useEffect } from "react";

export const useRecaptcha = <T extends string | HTMLDivElement | null>(elementRef: MutableRefObject<T>, options: RecaptchaOptions) => {
    const executeRecaptcha = () => execute(options.identifier);
    const resetRecaptcha = () => reset(options.identifier);

    useEffect(() => {
        if (!elementRef.current) {
            return;
        }

        install(elementRef.current, options);
        return () => {
            reset(options.identifier);
        };
    }, []);

    return [executeRecaptcha, resetRecaptcha] as [() => Promise<string>, () => void];
}