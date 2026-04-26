export const palette = {
  primary: '#0D6EFD',
  primaryDark: '#0B57CB',
  primarySoft: '#E8F0FF',
  primaryTint: '#EDF2FD',
  success: '#0D9488',
  successSoft: '#D7F5EF',
  danger: '#C20E37',
  dangerSoft: '#FCE6EB',
  warning: '#F59E0B',
  textPrimary: '#0F172A',
  textSecondary: '#667085',
  textMuted: '#94A3B8',
  background: '#F3F5FB',
  surface: '#FFFFFF',
  border: '#E4E7EC',
};

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  xxxxl: 30,
  xxxxxl: 35,
};

export const radius = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 32,
  full: 9999,
  pill: 999,
};

export const borderWidth = {
  none: 0,
  hairline: 0.5,
  sm: 1,
  md: 2,
  lg: 4,
};

export const opacity = {
  transparent: 0,
  xs: 0.05,
  sm: 0.1,
  md: 0.2,
  lg: 0.35,
  xl: 0.5,
  disabled: 0.5,
  muted: 0.7,
  solid: 1,
};

export const sizing = {
  icon: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 30,
    xxl: 36,
  },
  control: {
    chip: 42,
    input: 52,
    button: 46,
    smallButton: 30,
    fab: 74,
  },
  avatar: {
    sm: 44,
    md: 50,
    lg: 60,
    xl: 74,
    xxl: 84,
  },
  card: {
    tile: 50,
    metric: 74,
    modalFabOffset: 7,
    transactionMetaWidth: 98,
  },
  rule: {
    thin: 1,
  },
  chart: {
    strokeSm: 1,
    strokeMd: 2,
    heightMd: 220,
    legendNone: 0,
  },
  nav: {
    itemWidth: 78,
    capsuleWidth: 52,
    capsuleHeight: 44,
    barPaddingTop: 10,
    barPaddingBottom: 18,
  },
};

export const layout = {
  screenHorizontal: spacing.lg,
  screenBottomInset: 110,
  modalSheetRadius: radius.xxl,
  sectionGap: spacing.lg,
  cardGap: spacing.md,
};

export const type = {
  title: { fontSize: 20, lineHeight: 26, fontWeight: '800' },
  h1: { fontSize: 16, lineHeight: 20, fontWeight: '800' },
  h2: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  h3: { fontSize: 16, lineHeight: 20, fontWeight: '700' },
  h4: { fontSize: 14, lineHeight: 18, fontWeight: '700' },
  body: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  bodyBold: { fontSize: 14, lineHeight: 18, fontWeight: '700' },
  button: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
  label: { fontSize: 10, lineHeight: 14, fontWeight: '600', letterSpacing: 0.2 },
  caption: { fontSize: 12, lineHeight: 14, fontWeight: '500', letterSpacing: 0.3 },
  overline: { fontSize: 10, lineHeight: 13, fontWeight: '700', letterSpacing: 1 },
};

export const shadows = {
  card: {
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  floating: {
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
};
