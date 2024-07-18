/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require('@iconify/tailwind');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/*'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui'), addDynamicIconSelectors()],
	daisyui: {
		themes: ['retro', 'synthwave']
	}
};
