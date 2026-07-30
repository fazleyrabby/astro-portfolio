/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
	darkMode: 'class',
	variants: {
		typography: ['dark'],
		extend: {
			// ...
			translate: ['dark'],
		}
	},
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			display: ['Newsreader', 'Spectral', 'serif'],
			serif: ['Newsreader', 'Spectral', 'serif'],
			sans: ['Cal Sans UI', 'Plus Jakarta Sans', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
			mono: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
			logo: ['Newsreader', 'Spectral', 'serif'],
		},
		fontSize: {
			tiny: '0.75rem',   // 12px
			xs: '0.75rem',     // 12px
			sm: '0.875rem',    // 14px
			base: '0.9375rem',  // 15px
			lg: '1.125rem',    // 18px
			xl: '1.375rem',    // 22px
			'2xl': '1.75rem',   // 28px
			'3xl': '2.25rem',  // 36px
			'4xl': '3rem',     // 48px
			'5xl': '3.5rem',   // 56px
		},
		container: {
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
		},
		extend: {
			colors: {
				base: 'var(--color-bg)',
				text: 'var(--color-text)',
				surface: 'var(--color-surface)',
				border: 'var(--color-border)',
				accent: 'var(--color-accent)',
				"theme-primary": 'var(--text-primary)',
				"theme-secondary": 'var(--text-secondary)',
				"theme-muted": 'var(--text-muted)',
				// Admin UI colors (Dynamic via AdminLayout)
				adm: {
					bg: "var(--adm-bg)",
					panel: "var(--adm-panel)",
					border: "var(--adm-border)",
					text: "var(--adm-text)",
					muted: "var(--adm-muted)",
					primary: "var(--adm-primary)"
				},
				// Legacy aliases (if needed by existing files, though I will update them)
				bg: "var(--adm-bg)",
				panel: "var(--adm-panel)",
				"adm-border": "var(--adm-border)",
				muted: "var(--adm-muted)",
				primary: "var(--adm-primary)"
			},
			boxShadow: {
				theme: 'var(--shadow-main)',
			},
			borderRadius: {
				theme: '6px',
				DEFAULT: '6px',
				sm: '4px',
				md: '6px',
				lg: '8px',
				full: '9999px',
			},
			animation: {
				wiggle: 'wiggle 3s ease-in-out infinite',
				bounce: 'bounce 2s ease-in-out infinite',
				fadein: 'fadein 200ms linear',
				objtoright: 'objtoright 10s alternate infinite',
				spin: 'spin 1s linear infinite',
				bgGradient: 'titleAnimate 5s ease infinite forwards',
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-4deg)' },
					'50%': { transform: 'rotate(4deg)' },
				},
				fadein: {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				objtoright: {
					'0%': { 'object-position': 'top left' },
					'100%': { 'object-position': 'top right' },
				},
				spin: {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				titleAnimate: {
					'0%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
					'100%': { 'background-position': '0% 50%' },
				},
			}
		},
	},
	corePlugins: {
		container: true
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animation-delay"),
		plugin(function ({ addVariant, e, postcss, addComponents }) {
			addComponents({
				'.container': {
					maxWidth: '100%',
					'@screen sm': {
						maxWidth: '640px',
					},
					'@screen md': {
						maxWidth: '768px',
					},
					'@screen lg': {
						maxWidth: '860px',
					},
					'@screen xl': {
						maxWidth: '1100px',
					},
				}
			}),

				addVariant('firefox', ({ container, separator }) => {
					const isFirefoxRule = postcss.atRule({
						name: '-moz-document',
						params: 'url-prefix()',
					});

					isFirefoxRule.append(container.nodes);
					container.append(isFirefoxRule);

					isFirefoxRule.walkRules((rule) => {
						rule.selector = `.${e(
							`firefox${separator}${rule.selector.slice(1)}`
						)}`;
					});
				});
		}),
	],
}
