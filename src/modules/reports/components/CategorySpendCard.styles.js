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
    width: sizing.card.tile,
    height: sizing.card.tile,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
  },
  progress: {
    marginTop: spacing.md,
  },
});

export const getIconTileStyle = (color) => ({
  backgroundColor: `${color}1A`,
});
