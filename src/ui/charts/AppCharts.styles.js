import { StyleSheet } from 'react-native';
import { palette, radius, spacing, sizing, type } from '../theme/tokens';

export const styles = StyleSheet.create({
  lineChart: {
    borderRadius: radius.lg,
  },
  lineChartInner: {
    paddingRight: 0,
    marginRight: 0,
  },
  lineChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxisColumn: {
    width: 45,
    height: 200,
    borderRightWidth: 1,
    borderColor: palette.border,
    paddingRight: spacing.md,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    // paddingBottom: spacing.md,
    marginTop: spacing.xxl,
  },
  yAxisLabel: {
    color: palette.textSecondary,
    fontSize: type.overline.fontSize,
    lineHeight: type.overline.lineHeight,
    textAlign: 'right',
  },
  lineChartScroll: {
    paddingRight: 0,
  },
});
