export default function (condition: unknown, msg: string = 'assertion failed'): asserts condition {
    if (!condition) throw new Error(msg);
}
