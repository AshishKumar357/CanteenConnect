import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useResponsive from '../utils/responsive';
import theme from '../utils/theme';

export default function ReviewModal({ visible, onClose, onSubmit, mealLabel }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const { rs, wp } = useResponsive();

  useEffect(() => {
    if (!visible) {
      setRating(0);
      setText('');
    }
  }, [visible]);

  function submit() {
    onSubmit && onSubmit({ rating, text });
    onClose && onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { marginHorizontal: wp(10) }]}>
          <Text style={styles.title}>Rate the food{mealLabel ? ` — ${mealLabel}` : ''}</Text>

          <View style={styles.stars}>
            {[1,2,3,4,5].map(s => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <MaterialIcons name={rating >= s ? 'star' : 'star-border'} size={rs(24)} color={theme.colors.warn} />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput placeholder="Write your comments (optional)" value={text} onChangeText={setText} multiline style={[styles.input, { padding: Math.max(8, rs(8)) }]} />

          <View style={styles.rowRight}>
            <TouchableOpacity onPress={onClose} style={styles.btn}><Text style={{ fontSize: Math.max(13, rs(13)) }}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={submit} style={[styles.btn, styles.primary]}>
              <View style={styles.primaryContent}>
                <MaterialIcons name="send" size={Math.max(16, rs(16))} color={theme.colors.onPrimary} />
                <Text style={{ color: theme.colors.onPrimary, fontSize: Math.max(13, rs(13)), marginLeft: 8 }}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: theme.colors.background, borderRadius: 12, padding: 16 },
  title: { fontWeight: '700', fontSize: 18, marginBottom: 12 },
  stars: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  input: { minHeight: 80, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 8, textAlignVertical: 'top' },
  rowRight: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  btn: { padding: 8 },
  primary: { backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, shadowColor: theme.colors.primary, shadowOpacity: 0.18, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12, elevation: 6 },
  primaryContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
