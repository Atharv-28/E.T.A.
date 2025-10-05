import { StyleSheet } from 'react-native';

// Enhanced Color Palette - Baby Blue Theme
export const colors = {
  // Primary Colors - Baby Blue Theme
  primary: '#87CEEB',      // Sky blue
  primaryDark: '#4682B4',  // Steel blue
  primaryLight: '#B0E0E6', // Powder blue
  
  // Secondary Colors - Complementary pastels
  secondary: '#DDA0DD',    // Plum
  secondaryDark: '#DA70D6', // Orchid
  secondaryLight: '#E6E6FA', // Lavender
  
  // Success & Income - Soft mint/aqua
  success: '#40E0D0',      // Turquoise
  successDark: '#20B2AA',  // Light sea green
  successLight: '#AFEEEE', // Pale turquoise
  
  // Danger & Expense - Soft coral
  danger: '#F08080',       // Light coral
  dangerDark: '#CD5C5C',   // Indian red
  dangerLight: '#FFB6C1',  // Light pink
  
  // Warning - Soft yellow
  warning: '#F0E68C',      // Khaki
  warningDark: '#DAA520',  // Goldenrod
  warningLight: '#FFFFE0', // Light yellow
  
  // Info - Baby blue variations
  info: '#87CEEB',         // Sky blue
  infoDark: '#4682B4',     // Steel blue
  infoLight: '#E0F6FF',    // Alice blue
  
  // Neutral Colors - Soft and light
  background: '#F0F8FF',   // Alice blue background
  backgroundDark: '#E6F3FF', // Light blue background
  white: '#FFFFFF',
  black: '#2F4F4F',        // Dark slate gray (softer than pure black)
  gray: '#708090',         // Slate gray
  grayLight: '#B0C4DE',    // Light steel blue
  grayDark: '#2F4F4F',     // Dark slate gray
  
  // Gradient Colors - Baby Blue Theme
  gradientStart: '#87CEEB', // Sky blue
  gradientEnd: '#4682B4',   // Steel blue
  
  // Income Gradient - Aqua theme
  incomeGradientStart: '#40E0D0', // Turquoise
  incomeGradientEnd: '#20B2AA',   // Light sea green
  
  // Expense Gradient - Soft coral theme
  expenseGradientStart: '#F08080', // Light coral
  expenseGradientEnd: '#CD5C5C',   // Indian red
  
  // Card Gradients - Baby Blue Variations
  cardGradient1Start: '#87CEEB',   // Sky blue
  cardGradient1End: '#4682B4',     // Steel blue
  cardGradient2Start: '#B0E0E6',   // Powder blue
  cardGradient2End: '#87CEEB',     // Sky blue
  cardGradient3Start: '#B0E0E6',   // Powder blue
  cardGradient3End: '#87CEEB',     // Sky blue
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary, // Baby blue header
    padding: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerAccountText: {
    color: colors.primaryLight,
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight, // Baby blue border
    elevation: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeNavItem: {
    backgroundColor: colors.primaryLight + '40', // Soft baby blue active state
  },
  navText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavText: {
    color: colors.primary,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primary, // Baby blue shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight + '60', // Soft baby blue border
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.success,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayLight + '30',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight + '50',
    backgroundColor: 'transparent',
  },
  transactionDescription: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  addButton: {
    backgroundColor: colors.primary, // Baby blue buttons
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  placeholder: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  
  // Type selection styles
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    backgroundColor: '#ffffff',
  },
  activeTypeButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  activeTypeButtonText: {
    color: '#ffffff',
  },
  
  // Input styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingVertical: 16,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  
  // Category grid styles
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    padding: 16,
    margin: 4,
    alignItems: 'center',
  },
  activeCategoryItem: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  
  // Transaction card styles
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 2,
  },
  deleteButton: {
    marginTop: 8,
    padding: 4,
  },
  
  // Filter styles
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  activeFilterButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2c3e50',
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Section header styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Summary styles
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  
  // Reports screen styles
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#3498db',
  },
  periodButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  activePeriodButtonText: {
    color: '#ffffff',
  },
  
  // Summary cards styles
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Savings rate card styles
  savingsRateCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  savingsRateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  savingsRateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  savingsRateValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savingsRateSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  
  // Chart styles
  chartHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  
  // Category breakdown styles
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  categoryAmountContainer: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  
  // Insights styles
  insightContainer: {
    marginTop: 8,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: '#2c3e50',
    marginLeft: 12,
    lineHeight: 18,
  },
  
  // Mini chart styles
  viewAllButton: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  miniChart: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  miniChartTitle: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  miniChartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
  },
  miniChartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  miniChartBarFill: {
    width: '80%',
    borderRadius: 2,
    marginBottom: 4,
  },
  miniChartBarLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  
  // Account Management Styles
  accountItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
    fontWeight: '500',
  },
  accountRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  activeAccountCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeAccountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeAccountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
    flex: 1,
  },
  activeAccountBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activeAccountLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    backgroundColor: '#ffffff',
    minWidth: '45%',
    marginBottom: 8,
  },
  typeOptionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  
  // SMS Pattern Styles
  smsPattern: {
    fontSize: 11,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 2,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  exampleContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
    lineHeight: 16,
  },

  // New styles for improved designs
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Filter container for Reports screen
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  miniFilterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 6,
    borderRadius: 4,
    backgroundColor: '#ecf0f1',
  },

  activeMiniFilterButton: {
    backgroundColor: '#3498db',
  },

  miniFilterText: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  activeMiniFilterText: {
    color: '#ffffff',
  },

  // Account actions and delete button
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  actionButton: {
    padding: 8,
    marginLeft: 4,
  },

  deleteButton: {
    padding: 8,
    marginLeft: 4,
  },

  editButton: {
    padding: 8,
    marginLeft: 4,
  },

  // Chart header improvements
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // SMS Import Button Styles
  smsImportButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  smsImportButtonDisabled: {
    backgroundColor: '#95a5a6',
    elevation: 0,
  },

  smsImportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  smsImportHint: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Backup & Export Styles
  backupButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },

  backupButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  backupButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  backupHint: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // New layout styles for better alignment
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  filterRowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 8,
  },

  // =================
  // PHASE 6: ANIMATIONS & ENHANCED UI
  // =================

  // Gradient Card Styles
  gradientCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  gradientButton: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  gradientButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Enhanced Transaction Item with Animation
  animatedTransactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderLeftWidth: 4,
  },

  // Enhanced Account Card
  enhancedAccountCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayLight + '30',
  },

  // Loading Animation Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray,
    fontWeight: '600',
  },

  // Shimmer Loading Effect
  shimmerContainer: {
    backgroundColor: colors.grayLight + '30',
    borderRadius: 8,
    overflow: 'hidden',
  },

  shimmer: {
    height: '100%',
    width: '100%',
  },

  // Pulse Animation
  pulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Enhanced Modal Styles
  enhancedModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
    elevation: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },

  enhancedModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight + '40',
  },

  enhancedModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: 0.3,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Enhanced Input Styles
  enhancedTextInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.grayLight,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  enhancedTextInputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    elevation: 4,
    shadowOpacity: 0.1,
  },

  // Notification/Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
  },

  toastText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },

  // Enhanced Category Selection
  enhancedCategoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  enhancedCategoryOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
    elevation: 4,
    shadowOpacity: 0.1,
  },

  // Bouncing animation for buttons
  bounceButton: {
    transform: [{ scale: 1 }],
  },

  // Slide in animation
  slideInFromRight: {
    transform: [{ translateX: 0 }],
    opacity: 1,
  },

  slideInFromLeft: {
    transform: [{ translateX: 0 }],
    opacity: 1,
  },

  // Fade animation
  fadeIn: {
    opacity: 1,
  },

  fadeOut: {
    opacity: 0,
  },

  // Scale animation
  scaleIn: {
    transform: [{ scale: 1 }],
    opacity: 1,
  },

  scaleOut: {
    transform: [{ scale: 0.8 }],
    opacity: 0,
  },
});
