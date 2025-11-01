import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import useResponsive from '../../utils/responsive';
import theme from '../../utils/theme';
import { generateCalendar, TOTAL_STUDENTS } from '../../data/messSample';
import accountsStore from '../../utils/accountsStore';

const MEALS = [
  { key: 'breakfast', label: 'Breakfast', color: theme.colors.mealBreakfast },
  { key: 'lunch', label: 'Lunch', color: theme.colors.mealLunch },
  { key: 'snacks', label: 'Snacks', color: theme.colors.mealSnacks },
  { key: 'dinner', label: 'Dinner', color: theme.colors.mealDinner },
];

function DatePill({ item, isActive, onPress }) {
  const label = item.date.toLocaleDateString(undefined, { weekday: 'short' });
  const day = item.date.getDate();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.dateCol, isActive && styles.dateColActive]}>
      <Text style={[styles.dateLabel, isActive && styles.dateLabelActive]}>{label}</Text>
      <Text style={[styles.dateDay, isActive && styles.dateDayActive]}>{day}</Text>
    </TouchableOpacity>
  );
}

export default function MessOverviewScreen() {
  const today = useMemo(() => new Date(), []);
  const cal = useMemo(() => generateCalendar(today, 11), [today]);
  const { rs, width } = useResponsive();
  const [seeded, setSeeded] = useState(false);
  // select today's date by default
  const todayKey = today.toDateString();
  const todayIndex = cal.findIndex(d => d.date.toDateString() === todayKey);
  const [selectedIndex, setSelectedIndex] = useState(todayIndex >= 0 ? todayIndex : Math.floor(cal.length / 2));

  useEffect(() => {
    // seed sample mess accounts (Mess_A..Mess_D) when this screen is opened
    let mounted = true;
    accountsStore.seedSampleAccounts().then(() => {
      if (mounted) setSeeded(true);
    }).catch(() => {
      if (mounted) setSeeded(false);
    });
    return () => { mounted = false; };
  }, []);

  const selected = cal[selectedIndex] || cal[0];

  function renderDateItem({ item, index }) {
    return <DatePill item={item} isActive={index === selectedIndex} onPress={() => setSelectedIndex(index)} />;
  }

  function renderMealCard(meal) {
    const optOut = selected.optOut[meal.key] || 0;
    const coming = Math.max(0, (selected.totalStudents || TOTAL_STUDENTS) - optOut);
    const pct = Math.round((coming / (selected.totalStudents || TOTAL_STUDENTS)) * 100);
    return (
      <View key={meal.key} style={[styles.mealCard, { backgroundColor: theme.colors.card }] }>
        <View style={styles.mealRow}>
          <View style={[styles.mealColor, { backgroundColor: meal.color }]} />
          <View style={styles.mealBody}>
            <Text style={styles.mealLabelLarge}>{meal.label}</Text>
            <Text style={styles.mealComing}>{coming.toLocaleString()} coming</Text>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: meal.color }]} />
            </View>

            <Text style={styles.mealSkip}>{optOut} skipping</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topRow}>
        <Text style={[styles.header, { fontSize: Math.max(18, rs(20)) }]}>Mess overview</Text>
        <Text style={styles.total}>Total students: {selected.totalStudents || TOTAL_STUDENTS}</Text>
      </View>

      {seeded && <Text style={{ textAlign: 'center', color: theme.colors.muted, marginBottom: 6 }}>Sample accounts (Mess_A..D) seeded</Text>}

      <View style={styles.dateStrip}>
        <FlatList data={cal} horizontal keyExtractor={(d) => d.date.toISOString()} renderItem={renderDateItem} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }} />
      </View>

      <ScrollView style={{ flex: 1, padding: 12 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.selectedDateLabel}>{selected.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>

        <View style={{ height: 12 }} />

        {MEALS.map(renderMealCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { fontWeight: '700', padding: 12, textAlign: 'center' },
  topRow: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 6, alignItems: 'center' },
  total: { color: theme.colors.muted, marginTop: 6 },
  dateStrip: { paddingVertical: 6, paddingLeft: 8 },
  dateCol: { width: 72, height: 72, borderRadius: 12, backgroundColor: theme.colors.neutralLight, marginRight: 10, alignItems: 'center', justifyContent: 'center', padding: 8 },
  dateColActive: { backgroundColor: theme.colors.primary },
  dateLabel: { fontSize: 12, color: theme.colors.muted },
  dateLabelActive: { color: theme.colors.onPrimary },
  dateDay: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  dateDayActive: { color: theme.colors.onPrimary },
  selectedDateLabel: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  card: { padding: 12, borderRadius: 12, marginBottom: 10 },
  cardDate: { fontWeight: '700', marginBottom: 6 },
  cardTotal: { marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  mealCard: { borderRadius: 12, padding: 12, marginBottom: 12, overflow: 'hidden' },
  mealRow: { flexDirection: 'row', alignItems: 'center' },
  mealColor: { width: 6, height: 64, borderRadius: 4, marginRight: 12 },
  mealBody: { flex: 1 },
  mealLabelLarge: { fontSize: 16, fontWeight: '800' },
  mealComing: { fontSize: 14, marginTop: 6, fontWeight: '700' },
  progressTrack: { height: 8, backgroundColor: theme.colors.neutralSoft, borderRadius: 6, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 6 },
  mealSkip: { marginTop: 8, color: theme.colors.muted, fontSize: 13 },
});
