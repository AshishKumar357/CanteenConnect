import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useResponsive from '../utils/responsive';

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function OptOutRangeModal({ visible, onClose, onConfirm, defaultDate, dates = [] }) {
  const [multiple, setMultiple] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const { rs, wp, width } = useResponsive();

  // create internal dates list: today .. today+14 (15 days) — no past dates allowed
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const MAX_DAYS = 15; // allow ranges up to 15 days
  const internalDates = [];
  for (let i = 0; i < MAX_DAYS; i++) {
    const d = new Date(startOfToday);
    d.setDate(startOfToday.getDate() + i);
    internalDates.push(d);
  }

  useEffect(() => {
    if (!visible) return;
    // find defaultDate within internalDates, otherwise use today (index 0)
    const idx = internalDates.findIndex(d => sameDay(d, defaultDate));
    const initial = idx >= 0 ? idx : 0;
    setStartIndex(initial);
    setEndIndex(initial);
    setMultiple(false);
  }, [visible, defaultDate]);

  function confirm() {
    const s = Math.min(startIndex, endIndex);
    const e = Math.max(startIndex, endIndex);
    onConfirm && onConfirm({ multiple, startDate: internalDates[s], endDate: internalDates[e] });
    onClose && onClose();
  }

  function renderDateCard({ item, index }) {
    const selected = (!multiple && index === startIndex) || (multiple && (index === startIndex || index === endIndex || (index > startIndex && index < endIndex)));
    // all internalDates are today or future, so none are disabled; keep structure for clarity
    const disabled = false;
    const size = Math.max(56, Math.min(84, Math.round(width * 0.13)));
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          if (!multiple) {
            setStartIndex(index);
            setEndIndex(index);
            return;
          }

          // when multiple selection is enabled, we treat the first tap as start and second as end
          if (index < startIndex) {
            // set new start; keep end at least start
            setStartIndex(index);
            setEndIndex(index);
          } else {
            // ensure end index is no more than startIndex + (MAX_DAYS-1)
            const maxEnd = Math.min(internalDates.length - 1, startIndex + (MAX_DAYS - 1));
            const chosen = Math.min(index, maxEnd);
            setEndIndex(chosen);
          }
        }}
        style={[styles.dateCard, { width: size, height: size, borderRadius: Math.round(size * 0.14) }, selected && styles.dateCardSel, disabled && { opacity: 0.4 }]}>
        <Text style={[styles.dateLabelSmall, { fontSize: Math.max(11, rs(12)) }]}>{item.toLocaleDateString(undefined, { weekday: 'short' })}</Text>
        <Text style={[styles.dateDaySmall, { fontSize: Math.max(16, rs(18)) }]}>{item.getDate()}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.card, { marginHorizontal: wp(10) }]}>
          <Text style={styles.title}>Opt out — All meals for {defaultDate.toLocaleDateString()}</Text>
          <Text style={styles.disclaimer}>Opt out of all meals for the selected day or a range of days. Abuse may lead to restrictions.</Text>

          <TouchableOpacity style={[styles.multRow, { paddingVertical: rs(6) }]} onPress={() => setMultiple(m => !m)}>
            <MaterialIcons name={multiple ? 'check-box' : 'check-box-outline-blank'} size={rs(18)} color={multiple ? '#06b6d4' : '#666'} />
            <Text style={[styles.multText, { fontSize: Math.max(13, rs(13)) }]}>Allow multiple days</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>{multiple ? 'Select start and end dates' : 'Select date'}</Text>
            <FlatList data={internalDates} horizontal keyExtractor={d => d.toISOString()} renderItem={renderDateCard} showsHorizontalScrollIndicator={false} />
          </View>

          <View style={styles.rowRight}>
            <TouchableOpacity onPress={onClose} style={styles.btn}><Text style={{ fontSize: Math.max(13, rs(13)) }}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={confirm} style={[styles.btn, styles.primary]}><Text style={{color:'#fff', fontSize: Math.max(13, rs(13))}}>Confirm</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  title: { fontWeight: '700', fontSize: 18, marginBottom: 8 },
  disclaimer: { color: '#444', marginBottom: 12 },
  multRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  multText: { marginLeft: 8, fontWeight: '600' },
  dateCard: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#f6f6f9', marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  dateCardSel: { backgroundColor: '#06b6d4', shadowColor: '#06b6d4', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12, elevation: 6 },
  dateLabelSmall: { fontSize: 12, color: '#333' },
  dateDaySmall: { fontSize: 18, fontWeight: '700' },
  rowRight: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  btn: { padding: 8 },
  primary: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
});
