import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  colors: {
    blue: {
      50: '#e9edff',
      100: '#c2c8f3',
      200: '#9ba4e5',
      300: '#737fd9',
      400: '#4c5bcd',
      500: '#3241b3',
      600: '#26338c',
      700: '#1a2465',
      800: '#0e163f',
      900: '#03061a',
    },
    orange: {
      50: '#fff4da',
      100: '#ffe0ae',
      200: '#ffcb7d',
      300: '#ffb74b',
      400: '#ffa21a',
      500: '#e68800',
      600: '#b36a00',
      700: '#814c00',
      800: '#4f2c00',
      900: '#1f0d00',
    },
  },
});

export default customTheme;
