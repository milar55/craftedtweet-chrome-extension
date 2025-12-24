/**
 * Saffron & Spice Palette
 * Inspired by South Asian colors—vibrant, warm, and appetizing.
 */

const tintColorLight = '#FF9933'; // Saffron
const tintColorDark = '#FFC107'; // Turmeric Gold

export default {
  light: {
    text: '#0D3B3B', // Deep Teal
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#CCC',
    tabIconSelected: tintColorLight,
    primary: '#FF9933', // Saffron
    secondary: '#FFC107', // Turmeric Gold
    success: '#00BFA5', // Mint Chutney
    surface: '#FFF8E1', // Cardamom Cream
    error: '#D32F2F', // Chilli Red
    border: '#E5E5E5',
  },
  dark: {
    text: '#FFF8E1', // Cardamom Cream
    background: '#0D3B3B', // Deep Teal
    tint: tintColorDark,
    tabIconDefault: '#CCC',
    tabIconSelected: tintColorDark,
    primary: '#FF9933',
    secondary: '#FFC107',
    success: '#00BFA5',
    surface: '#1A4D4D', // Slightly lighter teal for dark mode surfaces
    error: '#FF5252',
    border: '#2C5E5E',
  },
  palette: {
    deepTeal: '#0D3B3B',
    saffron: '#FF9933',
    turmericGold: '#FFC107',
    mintChutney: '#00BFA5',
    cardamomCream: '#FFF8E1',
    chilliRed: '#D32F2F',
  }
};
