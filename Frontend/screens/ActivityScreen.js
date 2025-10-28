import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useResponsive from '../utils/responsive';

// sample issues with hierarchical responses per stage
const ISSUES = [
  {
    id: 'i1',
    title: 'Leaking tap in Block A',
    details: 'Tap near room 102 is leaking continuously since morning.',
    media: [require('../assets/icon.png')],
    stage: 1,
    responses: {
      0: { actor: 'User', text: 'Reported leak via app with photo.', time: new Date(2025, 9, 29, 8, 12) },
      1: { actor: 'Infra club', text: 'Assigned maintenance team, ETA 2 hours.', time: new Date(2025, 9, 29, 9, 5) },
    },
  },
  {
    id: 'i2',
    title: 'Food spilled in mess',
    details: 'Large spill reported; needs cleanup and mop request.',
    media: [require('../assets/icon.png'), require('../assets/icon.png')],
    stage: 2,
    responses: {
      0: { actor: 'User', text: 'Spill reported, included area photo.', time: new Date(2025, 9, 28, 13, 2) },
      1: { actor: 'Infra club', text: 'Cleaning team notified.', time: new Date(2025, 9, 28, 13, 20) },
      2: { actor: 'Mess', text: 'Cleanup completed and apology issued.', time: new Date(2025, 9, 28, 13, 45) },
    },
  },
  {
    id: 'i3',
    title: 'Broken chair in common room',
    details: 'Chair leg broken, risky to sit.',
    media: [],
    stage: 0,
    responses: {
      0: { actor: 'User', text: 'Reported, requested replacement.', time: new Date(2025, 9, 27, 10, 0) },
    },
  },
];

const STAGES = ['User', 'Infra club', 'Mess', 'Campus admin'];

function MediaPreview({ media, size }) {
  if (!media || media.length === 0) return <View style={[styles.mediaPlaceholder, { width: size, height: size }]}><MaterialIcons name="image" size={Math.round(size/2)} color="#aaa" /></View>;
  if (media.length === 1) return <Image source={media[0]} style={{ width: size, height: size, borderRadius: 8, resizeMode: 'cover' }} />;
  // multiple: show first and small stack indicator
  return (
    <View>
      <Image source={media[0]} style={{ width: size, height: size, borderRadius: 8, resizeMode: 'cover' }} />
      <View style={styles.mediaMore}><Text style={styles.mediaMoreText}>+{media.length - 1}</Text></View>
    </View>
  );
}

export default function ActivityScreen({ navigation }) {
  const { rs, wp } = useResponsive();
  const issues = useMemo(() => ISSUES, []);

  function renderHierarchyFlow(stage, responses = {}) {
    // render a vertical timeline showing each authority level and any response text/time
    return (
      <View style={styles.timeline}>
        {STAGES.map((s, i) => {
          const done = i <= stage;
          const resp = responses[i];
          return (
            <View key={s} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.flowDot, { backgroundColor: done ? '#06b6d4' : '#ddd' }]} />
                {i < STAGES.length - 1 && <View style={[styles.connector, { backgroundColor: i < stage ? '#06b6d4' : '#e6e6e9' }]} />}
              </View>

              <View style={styles.timelineBody}>
                <Text style={[styles.flowLabel, { fontSize: Math.max(11, rs(11)), color: done ? '#111' : '#777' }]}>{s}</Text>
                {resp ? (
                  <View style={styles.responseCard}>
                    <Text style={[styles.responseText, { fontSize: Math.max(12, rs(12)) }]} numberOfLines={3}>{resp.text}</Text>
                    <Text style={[styles.responseTime, { fontSize: Math.max(10, rs(10)) }]}>{resp.time.toLocaleString()}</Text>
                  </View>
                ) : (
                  <Text style={[styles.noResponse, { fontSize: Math.max(11, rs(11)) }]}>{done ? 'No response recorded yet' : 'Pending'}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function renderItem({ item }) {
    // more compact tile: smaller media, tighter spacing
    const mediaSize = Math.max(56, rs(60));
    return (
      <TouchableOpacity onPress={() => navigation.navigate('IssueDetail', { issue: item })} activeOpacity={0.85}>
        <View style={[styles.tile, { paddingVertical: rs(8), paddingHorizontal: rs(8) }]}> 
          <MediaPreview media={item.media} size={mediaSize} />

          <View style={styles.tileBody}>
            <Text style={[styles.issueTitle, { fontSize: Math.max(13, rs(14)) }]} numberOfLines={2}>{item.title}</Text>
            <Text style={[styles.issueDetails, { fontSize: Math.max(11, rs(12)) }]} numberOfLines={2}>{item.details}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{item.stage >= 3 ? 'Escalated' : item.stage === 0 ? 'New' : 'In progress'}</Text>
              <Text style={styles.metaTime}>{item.responses && item.responses[item.stage] ? new Date(item.responses[item.stage].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
            </View>
          </View>

          <View style={styles.tileFlowCompact}>
            {/** show compact flow: small dots stacked and a chevron */}
            <View style={styles.compactDots}>
              {STAGES.map((s, i) => (
                <View key={s} style={[styles.smallDot, { backgroundColor: i <= item.stage ? '#06b6d4' : '#e6e6e9' }]} />
              ))}
            </View>
            <MaterialIcons name="chevron-right" size={rs(22)} color="#999" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={[styles.header, { fontSize: Math.max(18, rs(20)), paddingHorizontal: wp(4), marginVertical: rs(8) }]}>Issues raised</Text>
      <FlatList data={issues} keyExtractor={i => i.id} renderItem={renderItem} contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: 60 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f6' },
  header: { fontWeight: '700' },
  tile: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 2 },
  mediaPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', borderRadius: 8 },
  mediaMore: { position: 'absolute', right: 6, bottom: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  mediaMoreText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  tileBody: { flex: 1, paddingHorizontal: 10, paddingVertical: 8 },
  issueTitle: { fontWeight: '700', color: '#111' },
  issueDetails: { color: '#444', marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metaText: { color: '#666', fontSize: 12 },
  metaTime: { color: '#999', fontSize: 11 },
  tileFlow: { width: 120, paddingRight: 8 },
  timeline: { flex: 1 },
  timelineRow: { flexDirection: 'row', marginBottom: 12 },
  timelineLeft: { width: 28, alignItems: 'center' },
  connector: { width: 2, flex: 1, marginTop: 4 },
  flowDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  timelineBody: { flex: 1, paddingLeft: 10 },
  flowLabel: { fontWeight: '700', marginBottom: 6 },
  responseCard: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#eef2ff' },
  responseText: { color: '#222' },
  responseTime: { color: '#666', marginTop: 6 },
  noResponse: { color: '#999' },
  tileFlowCompact: { width: 64, alignItems: 'center', justifyContent: 'center' },
  compactDots: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  smallDot: { width: 8, height: 8, borderRadius: 4, marginVertical: 2 },
});
