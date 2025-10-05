import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestSMSPermissions = async () => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);

    const smsReceiveGranted = granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED;
    const smsReadGranted = granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED;

    if (smsReceiveGranted && smsReadGranted) {
      Alert.alert(
        'Permissions Granted',
        'SMS monitoring is now enabled. Bank transaction SMS will be automatically detected.',
        [{ text: 'OK' }]
      );
      return true;
    } else {
      Alert.alert(
        'Permissions Required',
        'SMS permissions are required for automatic transaction detection. Please enable them in app settings.',
        [
          { text: 'Cancel' },
          { 
            text: 'Settings', 
            onPress: () => {
              // Try to request again or guide user to settings
              console.log('User needs to manually enable SMS permissions in settings');
            }
          }
        ]
      );
      return false;
    }
  } catch (err) {
    console.warn('SMS permission error:', err);
    Alert.alert('Error', 'Failed to request SMS permissions');
    return false;
  }
};

export const checkSMSPermissions = async () => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const hasReceivePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
    const hasReadPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    
    return hasReceivePermission && hasReadPermission;
  } catch (err) {
    console.warn('Error checking SMS permissions:', err);
    return false;
  }
};

export const requestSMSPermissionsWithDialog = async () => {
  return new Promise((resolve) => {
    Alert.alert(
      'SMS Permissions Required',
      'To enable automatic transaction detection, this app needs permission to read SMS messages from your bank. This helps automatically categorize your transactions.\n\nYour SMS data is processed locally and never shared.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => resolve(false)
        },
        { 
          text: 'Grant Permissions', 
          onPress: async () => {
            const granted = await requestSMSPermissions();
            resolve(granted);
          }
        }
      ]
    );
  });
};
