import { StyleSheet } from 'react-native';
import { radius, sizing, spacing } from '../../../ui';

export const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconTile: {
    width: sizing.control.input + spacing.xxs,
    height: sizing.control.input + spacing.xxs,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  metaCol: {
    alignItems: 'flex-end',
    minWidth: sizing.card.transactionMetaWidth,
  },
});

export const getIconTileToneStyle = (income) => ({
  backgroundColor: income ? '#DFF6F2' : '#FDECEF',
});
