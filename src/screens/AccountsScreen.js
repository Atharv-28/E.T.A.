import React, { useMemo, useState } from 'react';
import { Alert, Modal, Switch } from 'react-native';
import { useAccounts } from '../context/AccountContext';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import BackupService from '../services/BackupService';
import NativeSMSService from '../services/NativeSMSService';
import { requestSMSPermissionsWithDialog, checkSMSPermissions } from '../utils/permissions';
import {
  AppButton,
  AppCard,
  AppInput,
  AppScreenLayout,
  AppView,
  AppText,
  AppIcon,
  palette,
  spacing,
  sizing,
} from '../ui';
import { styles } from './AccountsScreen.styles';

export default function AccountsScreen({ onAddAccount }) {
  const { accounts, activeAccount, activeAccountId, switchAccount } = useAccounts();
  const { transactions } = useTransactions();
  const { signOut, user } = useAuth();

  const [smsEnabled, setSmsEnabled] = useState(true);
  const [importVisible, setImportVisible] = useState(false);
  const [importText, setImportText] = useState('');

  const balance = useMemo(() => {
    if (!activeAccountId) return 0;
    return transactions
      .filter((item) => item.accountId === activeAccountId)
      .reduce((sum, item) => sum + (item.type === 'income' ? Number(item.amount || 0) : -Number(item.amount || 0)), 0);
  }, [transactions, activeAccountId]);

  const exportJson = async () => {
    if (!activeAccount) {
      Alert.alert('No Active Account', 'Please select an account first.');
      return;
    }

    try {
      const accountTransactions = transactions.filter((item) => item.accountId === activeAccount.id);
      await BackupService.exportToJSON([activeAccount], accountTransactions);
    } catch (error) {
      Alert.alert('Export Failed', error?.message || 'Could not export backup.');
    }
  };

  const importJson = async () => {
    if (!importText.trim()) {
      Alert.alert('Missing Input', 'Paste backup JSON data to import.');
      return;
    }

    try {
      await BackupService.importFromBackup(importText.trim());
      setImportText('');
      setImportVisible(false);
      Alert.alert('Import Started', 'Backup import has been initiated.');
    } catch (error) {
      Alert.alert('Import Failed', error?.message || 'Could not import backup data.');
    }
  };

  const toggleSms = async (value) => {
    try {
      if (value) {
        const granted = await requestSMSPermissionsWithDialog();
        if (!granted) {
          setSmsEnabled(false);
          Alert.alert('Permission Required', 'SMS permissions are needed to enable smart monitoring.');
          return;
        }

        await NativeSMSService.startMonitoring();
        setSmsEnabled(true);
      } else {
        await NativeSMSService.stopMonitoring();
        setSmsEnabled(false);
      }
    } catch (error) {
      setSmsEnabled(false);
      Alert.alert('SMS Monitor Error', error?.message || 'Could not update SMS monitoring state.');
    }
  };

  const checkSmsStatus = async () => {
    const granted = await checkSMSPermissions();
    const serviceStatus = NativeSMSService.getMonitoringStatus();

    Alert.alert(
      'Smart Monitoring Status',
      `Permissions: ${granted ? 'Granted' : 'Not granted'}\nService: ${serviceStatus ? 'Running' : 'Stopped'}`
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <AppScreenLayout>
        <AppView style={styles.headerRow}>
          <AppText variant="h2">Accounts</AppText>
          <AppButton title="+ Add Account" onPress={onAddAccount} />
        </AppView>

        {activeAccount ? (
          <AppCard style={styles.primaryCard}>
            <AppText variant="label" color={palette.textSecondary} style={styles.primaryLabel}>
              PRIMARY ACCOUNT
            </AppText>
            <AppView style={styles.primaryRow}>
              <AppView>
                <AppText variant="h2">{activeAccount.bankName || activeAccount.name}</AppText>
                <AppText variant="label" color={palette.textSecondary} style={styles.balanceLabel}>
                  Current Balance
                </AppText>
                <AppText variant="h1" color={balance < 0 ? palette.danger : palette.success}>
                  {balance < 0 ? '-' : ''}₹{Math.abs(balance).toFixed(2)}
                </AppText>
              </AppView>
              <AppView style={styles.primaryMeta}>
                <AppView
                  style={styles.primaryIconTile}
                >
                  <AppIcon name="account-balance" size={sizing.icon.lg + spacing.xxs} color={palette.danger} />
                </AppView>
                <AppView>
                  <AppText variant="label" color={palette.textSecondary}>
                    Linked Status
                  </AppText>
                  <AppText variant="h3" color={palette.success}>
                    Active
                  </AppText>
                </AppView>
              </AppView>
            </AppView>
          </AppCard>
        ) : (
          <AppCard>
            <AppText variant="body" color={palette.textSecondary}>
              No account selected. Add your first account to begin tracking.
            </AppText>
          </AppCard>
        )}

        {accounts.length > 1 ? (
          <AppCard>
            <AppText variant="h3" style={styles.switchTitle}>
              Switch Account
            </AppText>
            {accounts.map((account) => (
              <AppButton
                key={account.id}
                title={account.name}
                variant={account.id === activeAccountId ? 'primary' : 'secondary'}
                onPress={() => switchAccount(account.id)}
                style={styles.switchButton}
              />
            ))}
          </AppCard>
        ) : null}

        <AppView style={styles.sectionHeader}>
          <AppIcon name="wifi-tethering" size={30} color={palette.primary} />
          <AppText variant="h2" style={styles.sectionHeaderTitle}>
            Smart Monitoring
          </AppText>
        </AppView>

        <AppCard>
          <AppView style={styles.smsRow}>
            <AppView style={styles.smsText}>
              <AppText variant="h3">Native SMS Monitoring</AppText>
              <AppText variant="body" color={palette.textSecondary} style={styles.smsDescription}>
                Automatically detect and categorize transactions from SMS alerts.
              </AppText>
            </AppView>
            <Switch value={smsEnabled} onValueChange={toggleSms} trackColor={{ true: palette.primary }} />
          </AppView>

          <AppCard style={styles.smsTipCard}>
            <AppView style={styles.smsTipRow}>
              <AppIcon name="verified-user" size={20} color={palette.primary} />
              <AppText variant="body" color={palette.textSecondary} style={styles.smsTipText}>
                Financier uses edge-processing to parse SMS locally. Financial data stays on your device.
              </AppText>
            </AppView>
          </AppCard>

          <AppButton title="Check Service Status" variant="ghost" onPress={checkSmsStatus} style={styles.smsCheckButton} />
        </AppCard>

        <AppView style={styles.sectionHeader}>
          <AppIcon name="backup" size={30} color={palette.primary} />
          <AppText variant="h2" style={styles.sectionHeaderTitle}>
            Backup & Export
          </AppText>
        </AppView>

        <AppView style={styles.backupRow}>
          <AppCard style={styles.backupCard}>
            <AppIcon name="cloud-upload" size={28} color={palette.primary} />
            <AppText variant="h3" style={styles.backupTitle}>
              Cloud Backup
            </AppText>
            <AppText variant="body" color={palette.textSecondary} style={styles.backupBody}>
              Last synced: recently
            </AppText>
            <AppButton title="Export JSON" onPress={exportJson} style={styles.backupButton} />
          </AppCard>

          <AppCard style={styles.backupCard}>
            <AppIcon name="download" size={28} color={palette.success} />
            <AppText variant="h3" style={styles.backupTitle}>
              Import Backup
            </AppText>
            <AppText variant="body" color={palette.textSecondary} style={styles.backupBody}>
              Paste JSON backup data
            </AppText>
            <AppButton title="Import" variant="secondary" onPress={() => setImportVisible(true)} style={styles.backupButton} />
          </AppCard>
        </AppView>

        <AppButton title="Manage Data Sources" variant="ghost" style={styles.manageButton} />

        {/* ── Account Info & Sign Out ── */}
        <AppCard style={{ marginTop: 8 }}>
          <AppView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <AppIcon name="account-circle" size={20} color="#6C63FF" />
            <AppText variant="body" color="#9CA3AF" style={{ marginLeft: 8 }}>
              Signed in as: {user?.email || 'Unknown'}
            </AppText>
          </AppView>
          <AppButton
            title="Sign Out"
            variant="ghost"
            onPress={handleSignOut}
            style={{ borderColor: '#EF4444', borderWidth: 1 }}
          />
        </AppCard>
      </AppScreenLayout>

      <Modal visible={importVisible} transparent animationType="slide" onRequestClose={() => setImportVisible(false)}>
        <AppView style={styles.modalOverlay}>
          <AppView style={styles.modalSheet}>
            <AppText variant="h3">Import Backup JSON</AppText>
            <AppInput
              label="Backup Content"
              value={importText}
              onChangeText={setImportText}
              placeholder="Paste JSON content here"
              multiline
              style={styles.importInput}
            />
            <AppView style={styles.modalFooter}>
              <AppButton title="Cancel" variant="ghost" onPress={() => setImportVisible(false)} style={styles.modalFooterButton} />
              <AppButton title="Import" onPress={importJson} style={styles.modalFooterButton} />
            </AppView>
          </AppView>
        </AppView>
      </Modal>
    </>
  );
}
