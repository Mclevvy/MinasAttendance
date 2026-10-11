// Minas G6 Attendance — pixel game theme, single source of truth.
// Components must use COLORS / FONTS / styles only — never raw hex.
import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#0A1A3C',
  card: '#12295E',
  accent: '#1E3A8A',
  cta: '#FACC15',
  onCta: '#0A1A3C',
  text: '#FFFFFF',
  highlight: '#7DD3FC',
  muted: '#9FB3D9',
  error: '#F87171',
  border: '#000000',
};

export const FONTS = {
  heading: 'Press Start 2P',
  body: 'monospace',
};

// Returns false offline/missing asset → callers keep monospace. No new deps.
export async function loadPixelFont() {
  try {
    const Font = require('expo-font');
    await Font.loadAsync({ 'Press Start 2P': require('../assets/fonts/PressStart2P.ttf') });
    return true;
  } catch { return false; }
}

const edge = {
  borderWidth: 4,
  borderColor: COLORS.border,
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 0,
  boxShadow: '4px 4px 0 #000',
};

export const SIZE = { touch: 44, btnH: 56, inputFont: 20, maxW: 720 };

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  bgDim: { flex: 1, backgroundColor: 'rgba(10,26,60,0.55)' }, // keeps text readable over the art
  wrap: { flex: 1, width: '100%', maxWidth: SIZE.maxW, alignSelf: 'center', padding: 16 },
  card: { ...edge, backgroundColor: COLORS.card, padding: 16, marginBottom: 16 },
  heading: { fontFamily: FONTS.heading, color: COLORS.cta, fontSize: 20, lineHeight: 30, marginBottom: 8 },
  sub: { fontFamily: FONTS.heading, color: COLORS.highlight, fontSize: 12, lineHeight: 20, marginBottom: 12 },
  body: { fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: FONTS.body, color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { ...edge, backgroundColor: '#fff', color: COLORS.onCta, fontFamily: FONTS.body, fontSize: SIZE.inputFont, minHeight: SIZE.btnH, paddingHorizontal: 16, paddingVertical: 12 },
  btn: { ...edge, minHeight: SIZE.btnH, minWidth: SIZE.touch, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: 12 },
  btnPrimary: { backgroundColor: COLORS.cta },
  btnSecondary: { backgroundColor: COLORS.accent },
  btnText: { fontFamily: FONTS.heading, fontSize: 14, lineHeight: 20 },
  btnTextDark: { color: COLORS.onCta },
  btnTextLight: { color: COLORS.text },
  badge: { ...edge, backgroundColor: COLORS.accent, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
  badgeText: { fontFamily: FONTS.heading, color: COLORS.highlight, fontSize: 10, lineHeight: 16 },
  row: { ...edge, backgroundColor: COLORS.card, padding: 12, marginBottom: 12 },
  rowName: { fontFamily: FONTS.body, color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  rowMeta: { fontFamily: FONTS.body, color: COLORS.muted, fontSize: 14, marginTop: 4 },
  errorText: { fontFamily: FONTS.body, color: COLORS.error, fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,26,60,0.92)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  overlayCard: { ...edge, backgroundColor: COLORS.card, padding: 24, alignItems: 'center', maxWidth: 420, width: '100%' },
  focusRing: { outlineWidth: 3, outlineColor: COLORS.highlight, outlineStyle: 'solid' },
  disabled: { opacity: 0.5 },
});
