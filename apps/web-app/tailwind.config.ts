/* eslint-disable no-mixed-spaces-and-tabs */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', "ui-sans-serif", "system-ui", "sans-serif", 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji',]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {},
			keyframes: {
				"shine": {
					from: { backgroundPosition: '200% 0' },
					to: { backgroundPosition: '-200% 0' },
				},
			},
			animation: {
				"shine": "shine 8s ease-in-out infinite",
			},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
