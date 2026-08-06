/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
	darkMode: 'class',
	variants: {
		typography: ['dark'],
		extend: {
			translate: ['dark'],
		}
	},
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			display: ['Spectral', 'Georgia', 'serif'],
			serif: ['Spectral', 'Georgia', 'serif'],
			sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
			mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
		},
		borderRadius: {
			'none': '0px',
			'sm': '4px',
			DEFAULT: '6px',
			'md': '6px',
			'lg': '8px',
			'xl': '10px',
			'full': '9999px',
		},
		fontSize: {
			'tiny': '0.6875rem',  // 11px
			'xs': '0.75rem',     // 12px
			'sm': '0.875rem',    // 14px
			'base': '1rem',      // 16px
			'lg': '1.125rem',    // 18px
			'xl': '1.25rem',     // 20px
			'2xl': '1.5rem',     // 24px
			'3xl': '1.875rem',   // 30px
			'4xl': '2.25rem',    // 36px
			'5xl': '3rem',       // 48px
			'6xl': '3.75rem',    // 60px
			'7xl': '4.5rem',     // 72px
		},
		container: {
			padding: {
				DEFAULT: '1.25rem',
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
				theme: '8px',
				DEFAULT: '8px',
				sm: '4px',
				md: '8px',
				lg: '12px',
				xl: '16px',
				full: '9999px',
			},
			animation: {
				fadein: 'fadein 300ms ease-out',
			},
			keyframes: {
				fadein: {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
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
					'@screen sm': { maxWidth: '640px' },
					'@screen md': { maxWidth: '768px' },
					'@screen lg': { maxWidth: '960px' },
					'@screen xl': { maxWidth: '1100px' },
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
