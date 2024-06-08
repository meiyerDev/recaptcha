import { defineComponent, h, ref } from "vue";
import { useRecaptcha } from "./useRecaptcha";

export default defineComponent({
    name: 'Recaptcha',
    props: {
        sitekey: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
    },
    setup(props, { expose }) {
        const element = ref<HTMLDivElement>()
        const [execute, reset] = useRecaptcha(element, {
            siteKey: props.sitekey,
            identifier: props.id
        });

        expose({ execute, reset });
        return () => h('div', { ref: element, id: props.id })
    }
})