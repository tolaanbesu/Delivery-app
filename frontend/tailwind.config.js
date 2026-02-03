/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'food-dark': '#1C160E',
        'food-card': '#2A1E14',
        'food-orange': '#F57C1F',
        'food-border': '#3D2C1E',
        'food-text': '#EDE8E2',
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         'food-dark': '#1C160E',     // Background
//         'food-card': '#2A1E14',     // Card background
//         'food-orange': '#F57C1F',   // Brand color
//         'food-border': '#3D2C1E',   // Subtle card borders
//         'food-text': '#EDE8E2',     // Primary text
//       },
//       borderRadius: {
//         '4xl': '32px',
//       }
//     },
//   },
//   plugins: [],
// }
