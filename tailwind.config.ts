import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#4A7C59',
          'green-hover': '#6A9B78',
          'green-light': '#E8F0EA',
          'green-dark': '#2F5E40',
          bg: '#F7F5F0',
          text: '#2C2C2C',
          muted: '#888888',
          yellow: '#F5A623',
          red: '#D0454C',
          border: '#DDD8CF',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang TC"', '"Noto Sans TC"', 'sans-serif'],
        mono: ['"SF Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'pill': '24px',
        'input': '10px',
        'badge': '20px',
      },
    },
  },
  plugins: [],
};
export default config;
