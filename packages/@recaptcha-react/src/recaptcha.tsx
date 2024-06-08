import { forwardRef, useImperativeHandle, useRef } from "react";
import { useRecaptcha } from "./useRecaptcha";

type RecaptchaProps = {
    siteKey: string;
    id: string;
};

type RecaptchaHandle = {
    execute: () => Promise<string>;
    reset: () => void;
};

const Recaptcha = forwardRef<RecaptchaHandle, RecaptchaProps>((props, ref) => {
    const element = useRef<HTMLDivElement | null>(null);
    const [execute, reset] = useRecaptcha(element, {
        siteKey: props.siteKey,
        identifier: props.id,
    });

    useImperativeHandle(ref, () => ({
        execute,
        reset,
    }), [execute, reset]);

    return <div ref={element} id={props.id} />;
})

export default Recaptcha;