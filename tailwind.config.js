export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        avis: {
          red: '#E41E26',
          black: '#000000',
          darkgray: '#4B4B4B',
          white: '#FFFFFF',
          lightgray: '#F5F5F5',
        }
      },
      fontFamily: {
        // Make Satoshi the primary UI font, fall back to Inter/Poppins/system fonts
        sans: ['Satoshi', 'Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
