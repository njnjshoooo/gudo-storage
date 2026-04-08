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
          green: '#8C5726',          // GUDO brand warm brown (primary)
          'green-hover': '#A56830',  // lighter brown hover
          'green-light': '#F0E4D4',  // light warm sand
          'green-dark': '#5C3618',   // dark warm brown (header/footer)
          bg: '#F5F0EB',             // warm cream background
          text: '#2C2C2C',
          muted: '#888888',
          yellow: '#F5A623',
          red: '#D0454C',
          border: '#DCCFC3',         // warm border
          teal: '#4A8A96',           // GUDO secondary teal
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
