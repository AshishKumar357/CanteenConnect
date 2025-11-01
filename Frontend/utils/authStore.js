import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS_KEY = '@messbuddy_credentials_v1';

async function saveCredentials({ name, email, password, division, roll, prn, batch }) {
  const payload = {
    name: name || '',
    email: email || '',
    password: password || '',
    division: division || '',
    roll: roll || null,
    prn: prn || '',
    batch: batch || null,
  };
  await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(payload));
}

async function getCredentials() {
  const raw = await AsyncStorage.getItem(CREDENTIALS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function updatePassword(newPassword) {
  const creds = (await getCredentials()) || { name: '', email: '', password: '', division: '', roll: null, prn: '', batch: null };
  creds.password = newPassword;
  await saveCredentials(creds);
}

async function clearCredentials() {
  await AsyncStorage.removeItem(CREDENTIALS_KEY);
}

export default {
  saveCredentials,
  getCredentials,
  updatePassword,
  clearCredentials,
};
