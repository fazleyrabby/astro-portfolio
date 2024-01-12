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
		  'sans' : ['Kumbh Sans','system-ui'],
		  'serif' : ['Lora','serif'],
		  'logo' : ['League Spartan','system-ui'],
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
			spin: 'spin 1s linear infinite'
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
			} 
		  }
		},
	  },
	  corePlugins: {
		container: false
	  },
	  plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animation-delay"),
		plugin(function ({ addVariant, e, postcss, addComponents }) {
		  addComponents({
			'.container': {
			  maxWidth: '80%',
			  '@screen sm': {
				maxWidth: '640px',
			  },
			  '@screen md': {
				maxWidth: '768px',
			  },
			  '@screen lg': {
				maxWidth: '800px',
			  },
			  '@screen xl': {
				maxWidth: '860px',
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
