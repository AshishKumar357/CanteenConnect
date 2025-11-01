import AsyncStorage from '@react-native-async-storage/async-storage';

const ISSUES_KEY = '@messbuddy_issues_v1';

async function getIssues() {
  const raw = await AsyncStorage.getItem(ISSUES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

async function saveIssues(list) {
  await AsyncStorage.setItem(ISSUES_KEY, JSON.stringify(list || []));
}

async function saveIssue(issue) {
  const all = await getIssues();
  const toSave = [{
    id: Date.now().toString(),
    title: issue.title || '',
    details: issue.details || issue.description || '',
    media: issue.media || [],
    category: issue.category || '',
    author: issue.author || null,
    time: new Date().toISOString(),
    status: issue.status || 'open',
    stage: 0,
    responses: issue.responses || [],
  }, ...all];
  await saveIssues(toSave);
  return toSave[0];
}

async function clearIssues() {
  await AsyncStorage.removeItem(ISSUES_KEY);
}

export default {
  getIssues,
  saveIssues,
  saveIssue,
  clearIssues,
};
