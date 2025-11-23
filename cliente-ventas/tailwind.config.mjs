/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'cyber-black': '#050505',
				'cyber-dark': '#0a0a12',
				'cyber-gray': '#1a1a24',
				'neon-blue': '#00f3ff',
				'neon-purple': '#bc13fe',
			},
			boxShadow: {
				'neon': '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
				'neon-purple': '0 0 10px rgba(188, 19, 254, 0.5), 0 0 20px rgba(188, 19, 254, 0.3)',
			}
		},
	},
	plugins: [],
}