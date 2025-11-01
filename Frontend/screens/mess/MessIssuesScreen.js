import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import useResponsive from '../../utils/responsive';
import theme from '../../utils/theme';
import issuesStore from '../../utils/issuesStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function MessIssuesScreen({ navigation }) {
  const [issues, setIssues] = useState([]);
  const { rs, wp } = useResponsive();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await issuesStore.getIssues();
      if (mounted) setIssues(data);
    })();
    const unsub = navigation.addListener('focus', async () => {
      const data = await issuesStore.getIssues();
      setIssues(data);
    });
    return () => { mounted = false; unsub(); };
  }, [navigation]);

  function renderItem({ item }) {
    const thumb = item.media && item.media[0];
    return (
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('IssueDetail', { issue: item })}>
        <View style={styles.left}>
          {thumb ? (
            <Image source={{ uri: thumb }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.noThumb]}>
              <MaterialIcons name="image" size={24} color={theme.colors.muted} />
            </View>
          )}
        </View>
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.meta}>{item.category} • {new Date(item.time).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { fontSize: Math.max(16, rs(18)) }]}>Reported issues</Text>
      <FlatList
        data={issues}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: wp(4) }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={() => <Text style={styles.empty}>No issues reported yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { fontWeight: '700', paddingHorizontal: 16, paddingTop: 16 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, borderRadius: 10, padding: 12 },
  left: { marginRight: 12 },
  thumb: { width: 84, height: 64, borderRadius: 8, resizeMode: 'cover' },
  noThumb: { backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
  title: { fontWeight: '700', color: theme.colors.text },
  meta: { color: theme.colors.muted, marginTop: 6 },
  empty: { padding: 16, color: theme.colors.muted },
});
