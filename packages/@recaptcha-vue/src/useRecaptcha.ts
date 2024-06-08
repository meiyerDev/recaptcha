import { MaybeRef, onBeforeMount, onMounted, unref } from "vue";
import { RecaptchaOptions, execute, install, reset } from "@recaptcha/core";

export const useRecaptcha = <T extends string | HTMLDivElement | undefined>(elementRef: MaybeRef<T>, options: RecaptchaOptions) => {
    const element = unref<T>(elementRef);
    const executeRecaptcha = () => execute(options.identifier);
    const resetRecaptcha = () => reset(options.identifier);

    if (element) {
        onMounted(() => {
            install(element, options);
        });

        onBeforeMount(() => {
            reset(options.identifier);
        });
    }

    return [executeRecaptcha, resetRecaptcha];
}