import forms from '@tailwindcss/forms';
import { join } from 'node:path';
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('@skeletonlabs/tw-plugin').CustomThemeConfig} */
const hatid = {
    name: 'hatid',
    properties: {
        // =~= Theme Properties =~=
        '--theme-font-family-base': '"Public Sans", system-ui',
        '--theme-font-family-heading': '"Public Sans", system-ui',
        '--theme-font-color-base': '0 0 0',
        '--theme-font-color-dark': '255 255 255',
        '--theme-rounded-base': '8px',
        '--theme-rounded-container': '8px',
        '--theme-border-base': '2px',
        // =~= Theme On-X Colors =~=
        '--on-primary': '255 255 255',
        '--on-secondary': '0 0 0',
        '--on-tertiary': '0 0 0',
        '--on-success': '0 0 0',
        '--on-warning': '0 0 0',
        '--on-error': '255 255 255',
        '--on-surface': '255 255 255',
        // =~= Theme Colors  =~=
        // primary | #206055
        '--color-primary-50': '222 231 230', // #dee7e6
        '--color-primary-100': '210 223 221', // #d2dfdd
        '--color-primary-200': '199 215 213', // #c7d7d5
        '--color-primary-300': '166 191 187', // #a6bfbb
        '--color-primary-400': '99 144 136', // #639088
        '--color-primary-500': '32 96 85', // #206055
        '--color-primary-600': '29 86 77', // #1d564d
        '--color-primary-700': '24 72 64', // #184840
        '--color-primary-800': '19 58 51', // #133a33
        '--color-primary-900': '16 47 42', // #102f2a
        // secondary | #70aeb2
        '--color-secondary-50': '234 243 243', // #eaf3f3
        '--color-secondary-100': '226 239 240', // #e2eff0
        '--color-secondary-200': '219 235 236', // #dbebec
        '--color-secondary-300': '198 223 224', // #c6dfe0
        '--color-secondary-400': '155 198 201', // #9bc6c9
        '--color-secondary-500': '112 174 178', // #70aeb2
        '--color-secondary-600': '101 157 160', // #659da0
        '--color-secondary-700': '84 131 134', // #548386
        '--color-secondary-800': '67 104 107', // #43686b
        '--color-secondary-900': '55 85 87', // #375557
        // tertiary | #9b92b5
        '--color-tertiary-50': '240 239 244', // #f0eff4
        '--color-tertiary-100': '235 233 240', // #ebe9f0
        '--color-tertiary-200': '230 228 237', // #e6e4ed
        '--color-tertiary-300': '215 211 225', // #d7d3e1
        '--color-tertiary-400': '185 179 203', // #b9b3cb
        '--color-tertiary-500': '155 146 181', // #9b92b5
        '--color-tertiary-600': '140 131 163', // #8c83a3
        '--color-tertiary-700': '116 110 136', // #746e88
        '--color-tertiary-800': '93 88 109', // #5d586d
        '--color-tertiary-900': '76 72 89', // #4c4859
        // success | #94c45a
        '--color-success-50': '239 246 230', // #eff6e6
        '--color-success-100': '234 243 222', // #eaf3de
        '--color-success-200': '228 240 214', // #e4f0d6
        '--color-success-300': '212 231 189', // #d4e7bd
        '--color-success-400': '180 214 140', // #b4d68c
        '--color-success-500': '148 196 90', // #94c45a
        '--color-success-600': '133 176 81', // #85b051
        '--color-success-700': '111 147 68', // #6f9344
        '--color-success-800': '89 118 54', // #597636
        '--color-success-900': '73 96 44', // #49602c
        // warning | #dbc866
        '--color-warning-50': '250 247 232', // #faf7e8
        '--color-warning-100': '248 244 224', // #f8f4e0
        '--color-warning-200': '246 241 217', // #f6f1d9
        '--color-warning-300': '241 233 194', // #f1e9c2
        '--color-warning-400': '230 217 148', // #e6d994
        '--color-warning-500': '219 200 102', // #dbc866
        '--color-warning-600': '197 180 92', // #c5b45c
        '--color-warning-700': '164 150 77', // #a4964d
        '--color-warning-800': '131 120 61', // #83783d
        '--color-warning-900': '107 98 50', // #6b6232
        // error | #a52618
        '--color-error-50': '242 222 220', // #f2dedc
        '--color-error-100': '237 212 209', // #edd4d1
        '--color-error-200': '233 201 197', // #e9c9c5
        '--color-error-300': '219 168 163', // #dba8a3
        '--color-error-400': '192 103 93', // #c0675d
        '--color-error-500': '165 38 24', // #a52618
        '--color-error-600': '149 34 22', // #952216
        '--color-error-700': '124 29 18', // #7c1d12
        '--color-error-800': '99 23 14', // #63170e
        '--color-error-900': '81 19 12', // #51130c
        // surface | #484747
        '--color-surface-50': '228 227 227', // #e4e3e3
        '--color-surface-100': '218 218 218', // #dadada
        '--color-surface-200': '209 209 209', // #d1d1d1
        '--color-surface-300': '182 181 181', // #b6b5b5
        '--color-surface-400': '127 126 126', // #7f7e7e
        '--color-surface-500': '72 71 71', // #484747
        '--color-surface-600': '65 64 64', // #414040
        '--color-surface-700': '54 53 53', // #363535
        '--color-surface-800': '43 43 43', // #2b2b2b
        '--color-surface-900': '35 35 35', // #232323
    },
};

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
    ],
    theme: { extend: {} },
    plugins: [forms, skeleton({ themes: { custom: [hatid] } })],
};
