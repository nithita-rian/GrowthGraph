// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',   // all components
    './layouts/**/*.vue',               // all layouts
    './pages/**/*.vue',                 // all pages
    './plugins/**/*.{js,ts}',           // all plugins
    './app.vue',                        // root app file
    './nuxt.config.{js,ts}'             // nuxt config
  ],
  theme: {
    extend: {
      // เพิ่มค่า theme ของคุณได้ เช่น สี ฟอนต์
      colors: {
        primary: '##E97681',
        secondary: '#14171A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    // เพิ่ม plugin Tailwind ถ้าต้องการ
  ],
}
