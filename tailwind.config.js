// tailwind.config.js
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      // เพิ่มค่า theme ของคุณได้ เช่น สี ฟอนต์
      colors: {
        primary: '#E97681',
        secondary: '#14171A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
