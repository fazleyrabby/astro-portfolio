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
		  'sans' : ['Figtree','system-ui'],
		  'serif' : ['Figtree','system-ui'],
		  'logo' : ['Patrick Hand','system-ui'],
		  'mono' : ['Geist Mono','ui-monospace'],
		},
		fontSize: {
			xs: '0.8125rem',   // 13px
			sm: '0.875rem',    // 14px
			base: '0.875rem',  // 14px (default base)
			lg: '1rem',        // 16px
			xl: '1.125rem',    // 18px
			'2xl': '1.25rem',  // 20px
			'3xl': '1.5rem',   // 24px
			'4xl': '1.875rem', // 30px
			'5xl': '2.25rem',  // 36px
			'6xl': '3rem',     // 48px
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
			  '0%': { transform: 'translateY(-100%)'},
			  '100%': { transform: 'translateY(0)'},
			},
			objtoright: {
			  '0%': { 'object-position': 'top left'},
			  '100%': { 'object-position': 'top right'},
			},
			spin:{
				from: { transform: 'rotate(0deg)' },
				to: { transform: 'rotate(360deg)'}
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
			  maxWidth: '90%',
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
