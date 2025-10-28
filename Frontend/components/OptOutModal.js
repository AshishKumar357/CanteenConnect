import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import useResponsive from '../utils/responsive';
import { MaterialIcons } from '@expo/vector-icons';

const REASONS = ['Fast','Bad menu','Leave','Eating out','Ordered online','Others'];

export default function OptOutModal({ visible, onClose, onConfirm, mealLabel }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { rs, wp } = useResponsive();

  useEffect(() => {
    if (!visible) { setOpen(false); setReason(''); }
  }, [visible]);

  function confirm() {
    onConfirm && onConfirm({ reason });
    onClose && onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { marginHorizontal: wp(10) }]}>
          <Text style={[styles.title, { fontSize: rs(18) }]}>Opt out of meal{mealLabel ? ` — ${mealLabel}` : ''}</Text>
          <Text style={[styles.disclaimer, { fontSize: Math.max(12, rs(13)) }]}>By opting out, the mess will not cook this meal for you. Please do not falsify opt-out requests. Misuse may lead to restrictions.</Text>

          <TouchableOpacity style={[styles.picker, { padding: rs(12) }]} onPress={() => setOpen(v => !v)}>
            <Text style={{ fontSize: Math.max(13, rs(13)) }}>{reason || 'Select a reason'}</Text>
            <MaterialIcons name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={rs(18)} />
          </TouchableOpacity>

          {open && (
            <View style={styles.options}>
              {REASONS.map(r => (
                <TouchableOpacity key={r} onPress={() => { setReason(r); setOpen(false); }} style={styles.option}>
                  <Text>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
  picker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  options: { marginTop: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 8, backgroundColor: '#fff' },
  option: { padding: 10 },
  rowRight: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  btn: { padding: 8 },
  primary: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
});
