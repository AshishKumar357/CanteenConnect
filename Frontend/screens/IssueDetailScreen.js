import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import useResponsive from '../utils/responsive';
import { MaterialIcons } from '@expo/vector-icons';

export default function IssueDetailScreen({ route, navigation }) {
  const { issue } = route.params || {};
  if (!issue) return null;

  const media = issue.media || [];
  const { width } = Dimensions.get('window');
  const { rs, wp } = useResponsive();
  const [status, setStatus] = useState(issue.status || 'open');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: wp(4), paddingBottom: 40 }}>
      <View style={[styles.card, { padding: rs(14), borderRadius: 14, marginBottom: rs(12) }]}> 
        <View style={[styles.headerRow, { marginBottom: rs(8) }]}> 
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontSize: Math.max(18, rs(20)) }]} numberOfLines={2}>{issue.title}</Text>
            <Text style={{ color: '#666', marginTop: 6 }}>{issue.details}</Text>
          </View>

          {issue.priority === 'urgent' && (
            <View style={[styles.urgentLarge, { paddingHorizontal: rs(10), paddingVertical: rs(6) }]}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: rs(12) }}>
          {media.length ? media.map((m, i) => (
            <Image key={i} source={m} style={{ width: Math.round(wp(78)), height: rs(200), borderRadius: 12, marginRight: rs(12), resizeMode: 'cover' }} />
          )) : (
            <View style={[styles.noMedia, { height: rs(120), justifyContent: 'center' }]}>
              <MaterialIcons name="image" size={rs(36)} color="#bbb" />
              <Text style={{ color: '#888', marginTop: 8 }}>No media attached</Text>
            </View>
          )}
        </ScrollView>

        <View style={{ marginTop: rs(6), marginBottom: rs(6) }}>
          <Text style={[styles.sectionTitle, { marginBottom: rs(6) }]}>Progress & Responses</Text>
          {['User','Infra club','Mess','Campus admin'].map((s, i) => {
            const resp = issue.responses && issue.responses[i];
            const done = i <= issue.stage;
            return (
              <View key={s} style={styles.detailRow}>
                <View style={[styles.detailDot, { backgroundColor: done ? '#06b6d4' : '#ddd' }]} />
                <View style={styles.detailBody}>
                  <Text style={[styles.flowLabel, { color: done ? '#111' : '#777' }]}>{s}</Text>
                  {resp ? (
                    <View style={[styles.responseCard, { borderLeftColor: done ? '#06b6d4' : '#e6e6e9' }]}>
                      <Text style={[styles.responseText, { fontSize: Math.max(12, rs(12)) }]} numberOfLines={6}>{resp.text}</Text>
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

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: rs(6) }}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#06b6d4' }]} onPress={() => navigation.navigate('RaiseIssue', { issue, edit: true })}>
            <MaterialIcons name="edit" size={rs(18)} color="#fff" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} onPress={() => {
            Alert.alert('Cancel issue', 'Are you sure you want to cancel this issue?', [
              { text: 'No' },
              { text: 'Yes', onPress: () => { setStatus('cancelled'); Alert.alert('Cancelled', 'Issue marked as cancelled (local).'); } }
            ]);
          }}>
            <MaterialIcons name="cancel" size={rs(18)} color="#fff" />
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f59e0b' }]} onPress={() => {
            Alert.alert('Escalate issue', 'Escalate this issue to the next authority?', [
              { text: 'No' },
              { text: 'Yes', onPress: () => { Alert.alert('Escalated', 'Issue escalated (simulated).'); } }
            ]);
          }}>
            <MaterialIcons name="arrow-upward" size={rs(18)} color="#fff" />
            <Text style={styles.actionText}>Escalate</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800' },
  urgentLarge: { backgroundColor: '#F44336', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  urgentText: { color: '#fff', fontWeight: '800' },
  noMedia: { backgroundColor: '#fafafa', borderRadius: 12, padding: 12, alignItems: 'center', width: '100%' },
  sectionTitle: { fontWeight: '700' },
  detailsText: { color: '#333' },
  detailRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  detailDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12, marginTop: 6 },
  detailBody: { flex: 1 },
  flowLabel: { fontWeight: '700', marginBottom: 6 },
  responseCard: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#eef2ff' },
  responseText: { color: '#222' },
  responseTime: { color: '#666', marginTop: 6, fontSize: 12 },
  noResponse: { color: '#999' },
  closeBtn: { alignSelf: 'center', marginTop: 10, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#06b6d4', borderRadius: 8 },
  closeText: { color: '#fff', fontWeight: '700' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginHorizontal: 8 },
  actionText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
});
