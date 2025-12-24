/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        deepTeal: '#0D3B3B',
        saffron: '#FF9933',
        turmericGold: '#FFC107',
        mintChutney: '#00BFA5',
        cardamomCream: '#FFF8E1',
        chilliRed: '#D32F2F',
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-bold': ['Poppins_700Bold'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        inter: ['Inter_400Regular'],
      },
    },
  },
  plugins: [],
}
