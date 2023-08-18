import type { Action } from 'svelte/action';
import autosize from 'autosize';

export default (function (el) {
    const node = autosize(el);
    return {
        destroy() {
            autosize.destroy(node);
        },
        update() {
            autosize.update(node);
        },
    };
} satisfies Action);
