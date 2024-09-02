import type { Config } from "tailwindcss";

export default {
  corePlugins:{
    preflight:false
  },
  important: true,
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
