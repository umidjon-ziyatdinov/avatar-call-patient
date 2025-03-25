
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{ts,tsx}', // Added src directory
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		fontFamily: {
			sans: [
				'var(--font-inter)', 'geist'
			],
			mono: [
				'geist-mono'
			],
			heading: ['var(--font-nunito)'],
		},
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',

				/* Homepage Colors */
				homepage: {
					background: 'hsl(var(--homepage-background))',
					foreground: 'hsl(var(--homepage-foreground))',
					card: {
						DEFAULT: 'hsl(var(--homepage-card))',
						foreground: 'hsl(var(--homepage-card-foreground))'
					},
					popover: {
						DEFAULT: 'hsl(var(--homepage-popover))',
						foreground: 'hsl(var(--homepage-popover-foreground))'
					},
					primary: {
						DEFAULT: 'hsl(var(--homepage-primary))',
						foreground: 'hsl(var(--homepage-primary-foreground))',
					},
					secondary: {
						DEFAULT: 'hsl(var(--homepage-secondary))',
						foreground: 'hsl(var(--homepage-secondary-foreground))',
					},
					accent: {
						DEFAULT: 'hsl(var(--homepage-accent))',
						foreground: 'hsl(var(--homepage-accent-foreground))',
					},
					muted: {
						DEFAULT: 'hsl(var(--homepage-muted))',
						foreground: 'hsl(var(--homepage-muted-foreground))',
					},
					destructive: {
						DEFAULT: 'hsl(var(--homepage-destructive))',
						foreground: 'hsl(var(--homepage-destructive-foreground))',
					},
					border: 'hsl(var(--homepage-border))',
					input: 'hsl(var(--homepage-input))',
					ring: 'hsl(var(--homepage-ring))',
				},
			},
			extend: {
				fontFamily: {
					sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
					heading: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
				},
				borderRadius: {
					lg: "var(--radius)",
					md: "calc(var(--radius) - 2px)",
					sm: "calc(var(--radius) - 4px)",
				},
				keyframes: {
					"accordion-down": {
						from: { height: 0 },
						to: { height: "var(--radix-accordion-content-height)" },
					},
					"accordion-up": {
						from: { height: "var(--radix-accordion-content-height)" },
						to: { height: 0 },
					},
				},
				animation: {
					"accordion-down": "accordion-down 0.2s ease-out",
					"accordion-up": "accordion-up 0.2s ease-out",
				},
			},
		},
	},
	plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;