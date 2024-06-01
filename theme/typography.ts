import {
  SofiaSans_100Thin as sofia100,
  SofiaSans_200ExtraLight as sofia200,
  SofiaSans_300Light as sofia300,
  SofiaSans_400Regular as sofia400,
  SofiaSans_500Medium as sofia500,
  SofiaSans_600SemiBold as sofia600,
  SofiaSans_700Bold as sofia700,
  SofiaSans_800ExtraBold as sofia800,
  SofiaSans_900Black as sofia900,
  SofiaSans_100Thin_Italic as sofia100_italic,
  SofiaSans_200ExtraLight_Italic as sofia200_italic,
  SofiaSans_300Light_Italic as sofia300_italic,
  SofiaSans_400Regular_Italic as sofia400_italic,
  SofiaSans_500Medium_Italic as sofia500_italic,
  SofiaSans_600SemiBold_Italic as sofia600_italic,
  SofiaSans_700Bold_Italic as sofia700_italic,
  SofiaSans_800ExtraBold_Italic as sofia800_italic,
  SofiaSans_900Black_Italic as sofia900_talic,
} from '@expo-google-fonts/sofia-sans';
import { TextStyle } from 'react-native';

export const fontsToLoad = {
  //Classic font
  sofia100,
  sofia200,
  sofia300,
  sofia400,
  sofia500,
  sofia600,
  sofia700,
  sofia800,
  sofia900,

  //Classic font but italic
  sofia100_italic,
  sofia200_italic,
  sofia300_italic,
  sofia400_italic,
  sofia500_italic,
  sofia600_italic,
  sofia700_italic,
  sofia800_italic,
  sofia900_talic,
};

export const fonts = {
  sofia100: 'sofia100',
  sofia200: 'sofia200',
  sofia300: 'sofia300',
  sofia400: 'sofia400',
  sofia500: 'sofia500',
  sofia600: 'sofia600',
  sofia700: 'sofia700',
  sofia800: 'sofia800',
  sofia900: 'sofia900',
  sofia100_italic: 'sofia100_italic',
  sofia200_italic: 'sofia200_italic',
  sofia300_italic: 'sofia300_italic',
  sofia400_italic: 'sofia400_italic',
  sofia500_italic: 'sofia500_italic',
  sofia600_italic: 'sofia600_italic',
  sofia700_italic: 'sofia700_italic',
  sofia800_italic: 'sofia800_italic',
  sofia900_italic: 'sofia900_italic',
};

export const $sizeStyles = {
  xs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
  s: { fontSize: 14, lineHeight: 20 } satisfies TextStyle,
  n: { fontSize: 16, lineHeight: 22 } satisfies TextStyle,
  l: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  xl: { fontSize: 20, lineHeight: 30, fontFamily: 'sofia800' } satisfies TextStyle,
  h3: { fontSize: 24, lineHeight: 32, fontFamily: 'sofia800' } satisfies TextStyle,
  h2: { fontSize: 28, lineHeight: 36, fontFamily: 'sofia800' } satisfies TextStyle,
  h1: { fontSize: 32, lineHeight: 42, fontFamily: 'sofia800' } satisfies TextStyle,
};
