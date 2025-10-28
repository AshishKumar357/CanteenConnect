import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, Image } from 'react-native';
import useResponsive from '../utils/responsive';

// categories palette and colors
const CATEGORY_COLORS = {
  'Mess Updates': '#4CAF50',
  'Ticket / Issue Updates': '#2196F3',
  'General Announcements': '#FFC107',
  'Others': '#9E9E9E',
};

// sample updates data (oldest first, newest last)
const SAMPLE = [
  { id: 'u1', date: new Date(2025, 9, 25, 9, 12), title: 'Menu update', description: 'New biryani will be served on Friday. Try it with raita!', image: require('../assets/icon.png'), category: 'Mess Updates' },
  { id: 'u2', date: new Date(2025, 9, 25, 12, 30), title: 'Reminder', description: 'Please rate today\'s lunch to help us improve food quality.', image: require('../assets/icon.png'), category: 'General Announcements' },
  { id: 'u3', date: new Date(2025, 9, 27, 8, 5), title: 'Festive special', description: 'Signup sheet available for the festive special next week. Limited seats.', image: require('../assets/icon.png'), category: 'General Announcements' },
  { id: 'u4', date: new Date(2025, 9, 29, 10, 45), title: 'Maintenance notice', description: 'Water shutdown at noon today; please plan accordingly.', image: require('../assets/icon.png'), category: 'Ticket / Issue Updates', priority: 'urgent' },
  { id: 'u5', date: new Date(2025, 9, 29, 18, 5), title: 'Tonight\'s dinner', description: 'We are adding extra salad portions to tonight\'s dinner.', image: require('../assets/icon.png') },
];

function groupByDate(items) {
  const map = new Map();
  items.forEach(it => {
    const key = it.date.toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  });
  // produce sections with newest dates first, and newest updates at top within each date
  const sections = Array.from(map.entries()).map(([k, v]) => {
    v.sort((a, b) => b.date - a.date); // newest first within the date
    return { title: k, data: v };
  });
  // sort sections by date descending so latest dates appear at the top
  sections.sort((a, b) => new Date(b.title) - new Date(a.title));
  return sections;
}

export default function UpdatesScreen() {
  const { rs, wp } = useResponsive();
  const sections = useMemo(() => groupByDate(SAMPLE), []);

  function renderItem({ item }) {
    return (
      <View style={[styles.updateRow, { padding: rs(12) }]}> 
        <Image source={item.image} style={[styles.thumb, { width: rs(72), height: rs(72), borderRadius: rs(10) }]} />
        <View style={styles.updateBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={[styles.updateTitle, { fontSize: Math.max(14, rs(16)) }]} numberOfLines={2}>{item.title}</Text>
              <Text style={[styles.updateDesc, { fontSize: Math.max(12, rs(13)) }]} numberOfLines={3}>{item.description}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.updateTime, { fontSize: Math.max(11, rs(11)) }]}>{item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              {item.priority === 'urgent' && <View style={styles.urgentBadge}><Text style={styles.urgentText}>!</Text></View>}
            </View>
          </View>

          <View style={{ marginTop: 8 }}>
            {/* category chip */}
            {(() => {
              const cat = item.category || 'Others';
              const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Others'];
              return (
                <View style={[styles.categoryChip, { backgroundColor: color }]}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              );
            })()}
          </View>
        </View>
      </View>
    );
  }

  function renderSectionHeader({ section: { title } }) {
    const d = new Date(title);
    const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionPill}><Text style={styles.sectionText}>{label}</Text></View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: 60 }}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f2f2f6' },
  sectionHeader: { alignItems: 'center', marginVertical: 12 },
  sectionPill: { backgroundColor: '#e6e6ea', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  sectionText: { color: '#333', fontWeight: '700' },
  updateRow: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 3 },
  thumb: { width: 72, height: 72, borderRadius: 10, marginRight: 14, resizeMode: 'cover' },
  updateBody: { flex: 1 },
  updateTitle: { color: '#111', fontWeight: '800', marginBottom: 6 },
  updateDesc: { color: '#444', marginBottom: 8 },
  updateTime: { color: '#777' },
  categoryChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, alignSelf: 'flex-start' },
  categoryText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  urgentBadge: { backgroundColor: '#F44336', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  urgentText: { color: 'white', fontWeight: '800' },
});
