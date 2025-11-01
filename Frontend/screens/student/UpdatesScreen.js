import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, Image } from 'react-native';
import useResponsive from '../../utils/responsive';
import { SAMPLE } from '../../data/updates';
import theme from '../../utils/theme';

// categories palette and colors (use theme tokens)
const CATEGORY_COLORS = {
  'Mess Updates': theme.colors.success,
  'Ticket / Issue Updates': theme.colors.info,
  'General Announcements': theme.colors.warn,
  'Others': theme.colors.gray,
};

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
  const sections = useMemo(() => groupByDate(SAMPLE), [SAMPLE]);

  function renderItem({ item }) {
    const imgSource = typeof item.image === 'string' ? { uri: item.image } : item.image;
    return (
      <View style={[styles.updateRow, { padding: rs(12) }]}> 
        <Image source={imgSource} style={[styles.thumb, { width: rs(72), height: rs(72), borderRadius: rs(10) }]} />
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
              const color = CATEGORY_COLORS[cat] || theme.colors.gray;
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
    <View style={[styles.screen, { backgroundColor: theme.colors.neutralLight }]}>
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
  screen: { flex: 1 },
  sectionHeader: { alignItems: 'center', marginVertical: 12 },
  sectionPill: { backgroundColor: theme.colors.neutralSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  sectionText: { color: theme.colors.text, fontWeight: '700' },
  updateRow: { flexDirection: 'row', backgroundColor: theme.colors.background, marginBottom: 10, borderRadius: 12, alignItems: 'center', shadowColor: theme.shadows.default, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 3 },
  thumb: { width: 72, height: 72, borderRadius: 10, marginRight: 14, resizeMode: 'cover' },
  updateBody: { flex: 1 },
  updateTitle: { color: theme.colors.text, fontWeight: '800', marginBottom: 6 },
  updateDesc: { color: theme.colors.muted, marginBottom: 8 },
  updateTime: { color: theme.colors.muted },
  categoryChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, alignSelf: 'flex-start' },
  categoryText: { color: theme.colors.onPrimary, fontWeight: '700', fontSize: 12 },
  urgentBadge: { backgroundColor: theme.colors.danger, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  urgentText: { color: theme.colors.onPrimary, fontWeight: '800' },
});
