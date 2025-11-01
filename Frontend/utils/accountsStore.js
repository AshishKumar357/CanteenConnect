import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_KEY = '@messbuddy_accounts_v1';

async function saveAccounts(accounts) {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts || []));
}

async function getAccounts() {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function seedSampleAccounts() {
  const samples = [
    { username: 'Mess_A', password: 'SIMS2025', role: 'mess' },
    { username: 'Mess_B', password: 'SIMS2025', role: 'mess' },
    { username: 'Mess_C', password: 'SIMS2025', role: 'mess' },
    { username: 'Mess_D', password: 'SIMS2025', role: 'mess' },
  ];
  await saveAccounts(samples);
  return samples;
}

async function ensureSeeded() {
  const existing = await getAccounts();
  if (!existing || existing.length === 0) {
    return seedSampleAccounts();
  }
  return existing;
}

export default {
  saveAccounts,
  getAccounts,
  seedSampleAccounts,
  ensureSeeded,
};
