
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#0184FF', // Primary color from HITPA theme
					foreground: '#FFFFFF',
					hover: '#0062cc',
					text: '#0F172A' // Primary text from HITPA theme
				},
				secondary: {
					DEFAULT: '#DEDFF', // Secondary color from HITPA theme
					foreground: '#0F172A',
					text: '#647488' // Secondary text from HITPA theme
				},
				destructive: {
					DEFAULT: '#F1272A', // Danger text from HITPA theme
					foreground: '#FFFFFF',
					background: '#FFE2E1' // Danger background from HITPA theme
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#043C77', // Accent main from HITPA theme
					foreground: '#FFFFFF',
					light: '#8BD0FF', // Accent 1 from HITPA theme
					lighter: '#84BDFF' // Accent 2 from HITPA theme
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				warning: {
					DEFAULT: '#B75A00', // Warning text from HITPA theme
					foreground: '#FFFFFF',
					background: '#FFF7E1' // Warning background from HITPA theme
				},
				success: {
					DEFAULT: '#008B1C', // Success text from HITPA theme
					foreground: '#FFFFFF',
					background: '#D0FFEB' // Success background from HITPA theme
				},
				disabled: {
					DEFAULT: '#8295A7', // Disabled text from HITPA theme
					foreground: '#0F172A',
					container: '#F1F5F9' // Disabled container from HITPA theme
				},
				sidebar: {
					DEFAULT: '#0184FF', // Using primary color for sidebar background
					foreground: '#FFFFFF',
					primary: '#0184FF',
					'primary-foreground': '#FFFFFF',
					accent: '#043C77',
					'accent-foreground': '#FFFFFF',
					border: '#0062cc',
					ring: '#0062cc'
				},
				status: {
					completed: '#D0FFEB',
					'completed-text': '#008B1C',
					pending: '#dbeafe',
					'pending-text': '#0184FF',
					'desk-audit': '#FFF7E1',
					'desk-audit-text': '#B75A00',
					'claim-processing': '#f3e8ff',
					'claim-processing-text': '#6b21a8',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
