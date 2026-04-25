import React, { useMemo, useState } from 'react';
import { Alert, Modal, Switch, View } from 'react-native';
import { useAccounts } from '../context/AccountContext';
import { useTransactions } from '../context/TransactionContext';
import BackupService from '../services/BackupService';
import NativeSMSService from '../services/NativeSMSService';
import { requestSMSPermissionsWithDialog, checkSMSPermissions } from '../utils/permissions';
import {
  AppButton,
  AppCard,
  AppInput,
  AppScrollScreen,
  AppText,
  AppIcon,
  palette,
  spacing,
} from '../ui';

export default function AccountsScreen({ onAddAccount }) {
  const { accounts, activeAccount, activeAccountId, switchAccount } = useAccounts();
  const { transactions } = useTransactions();

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

  return (
    <>
      <AppScrollScreen>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="h2">Accounts</AppText>
          <AppButton title="+ Add Account" onPress={onAddAccount} />
        </View>

        {activeAccount ? (
          <AppCard style={{ borderLeftWidth: 4, borderLeftColor: palette.danger }}>
            <AppText variant="label" color={palette.textSecondary} style={{ letterSpacing: 1 }}>
              PRIMARY ACCOUNT
            </AppText>
            <View style={{ marginTop: spacing.md, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <AppText variant="h2">{activeAccount.bankName || activeAccount.name}</AppText>
                <AppText variant="label" color={palette.textSecondary} style={{ marginTop: spacing.lg }}>
                  Current Balance
                </AppText>
                <AppText variant="h1" color={balance < 0 ? palette.danger : palette.success}>
                  {balance < 0 ? '-' : ''}₹{Math.abs(balance).toFixed(2)}
                </AppText>
              </View>
              <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FCEEEF',
                  }}
                >
                  <AppIcon name="account-balance" size={26} color={palette.danger} />
                </View>
                <View>
                  <AppText variant="label" color={palette.textSecondary}>
                    Linked Status
                  </AppText>
                  <AppText variant="h3" color={palette.success}>
                    Active
                  </AppText>
                </View>
              </View>
            </View>
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
            <AppText variant="h3" style={{ marginBottom: spacing.md }}>
              Switch Account
            </AppText>
            {accounts.map((account) => (
              <AppButton
                key={account.id}
                title={account.name}
                variant={account.id === activeAccountId ? 'primary' : 'secondary'}
                onPress={() => switchAccount(account.id)}
                style={{ marginBottom: spacing.sm }}
              />
            ))}
          </AppCard>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
          <AppIcon name="wifi-tethering" size={30} color={palette.primary} />
          <AppText variant="h2" style={{ marginLeft: spacing.sm }}>
            Smart Monitoring
          </AppText>
        </View>

        <AppCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <AppText variant="h3">Native SMS Monitoring</AppText>
              <AppText variant="body" color={palette.textSecondary} style={{ marginTop: spacing.xs }}>
                Automatically detect and categorize transactions from SMS alerts.
              </AppText>
            </View>
            <Switch value={smsEnabled} onValueChange={toggleSms} trackColor={{ true: palette.primary }} />
          </View>

          <AppCard style={{ marginTop: spacing.lg, backgroundColor: '#EDF2FD', borderWidth: 0 }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppIcon name="verified-user" size={20} color={palette.primary} />
              <AppText variant="body" color={palette.textSecondary} style={{ flex: 1 }}>
                Financier uses edge-processing to parse SMS locally. Financial data stays on your device.
              </AppText>
            </View>
          </AppCard>

          <AppButton title="Check Service Status" variant="ghost" onPress={checkSmsStatus} style={{ marginTop: spacing.md }} />
        </AppCard>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
          <AppIcon name="backup" size={30} color={palette.primary} />
          <AppText variant="h2" style={{ marginLeft: spacing.sm }}>
            Backup & Export
          </AppText>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <AppCard style={{ flex: 1 }}>
            <AppIcon name="cloud-upload" size={28} color={palette.primary} />
            <AppText variant="h3" style={{ marginTop: spacing.md }}>
              Cloud Backup
            </AppText>
            <AppText variant="body" color={palette.textSecondary} style={{ marginTop: spacing.xs }}>
              Last synced: recently
            </AppText>
            <AppButton title="Export JSON" onPress={exportJson} style={{ marginTop: spacing.md }} />
          </AppCard>

          <AppCard style={{ flex: 1 }}>
            <AppIcon name="download" size={28} color={palette.success} />
            <AppText variant="h3" style={{ marginTop: spacing.md }}>
              Import Backup
            </AppText>
            <AppText variant="body" color={palette.textSecondary} style={{ marginTop: spacing.xs }}>
              Paste JSON backup data
            </AppText>
            <AppButton title="Import" variant="secondary" onPress={() => setImportVisible(true)} style={{ marginTop: spacing.md }} />
          </AppCard>
        </View>

        <AppButton title="Manage Data Sources" variant="ghost" style={{ borderStyle: 'dashed', borderWidth: 2, marginTop: spacing.sm }} />
      </AppScrollScreen>

      <Modal visible={importVisible} transparent animationType="slide" onRequestClose={() => setImportVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,14,28,0.34)' }}>
          <View
            style={{
              backgroundColor: palette.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: spacing.xl,
            }}
          >
            <AppText variant="h3">Import Backup JSON</AppText>
            <AppInput
              label="Backup Content"
              value={importText}
              onChangeText={setImportText}
              placeholder="Paste JSON content here"
              multiline
              style={{ marginTop: spacing.md }}
            />
            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <AppButton title="Cancel" variant="ghost" onPress={() => setImportVisible(false)} style={{ flex: 1 }} />
              <AppButton title="Import" onPress={importJson} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
