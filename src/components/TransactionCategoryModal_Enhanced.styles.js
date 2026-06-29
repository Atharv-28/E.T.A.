import { StyleSheet } from 'react-native';
import { colors } from '../styles/GlobalStyles';

export const styles = StyleSheet.create({
  headerActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionBorderless: {
    borderWidth: 0,
  },
  sectionTitleInverse: {
    color: colors.white,
  },
  transactionIconAccent: {
    backgroundColor: colors.white + '30',
  },
  transactionDescriptionEmphasis: {
    color: colors.white,
    fontWeight: '600',
  },
  transactionCategoryEmphasis: {
    color: colors.white,
    opacity: 0.8,
  },
  transactionDateEmphasis: {
    color: colors.white,
    opacity: 0.7,
  },
  transactionAmountEmphasis: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  exampleMuted: {
    fontStyle: 'italic',
    marginTop: 8,
    color: colors.gray,
  },
  categoryOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryOptionIconSelected: {
    backgroundColor: colors.primary,
  },
  categoryOptionIconDefault: {
    backgroundColor: colors.primaryLight + '30',
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  categoryOptionTextSelected: {
    color: colors.primary,
  },
  categoryOptionTextDefault: {
    color: colors.black,
  },
  actionPrimary: {
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    marginLeft: 8,
  },
  addButtonMuted: {
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  addButtonMutedText: {
    color: colors.gray,
  },
});
