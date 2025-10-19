import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ReviewModal({ visible, onClose, onSubmit, mealLabel }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

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
        <View style={styles.card}>
          <Text style={styles.title}>Rate the food{mealLabel ? ` — ${mealLabel}` : ''}</Text>

          <View style={styles.stars}>
            {[1,2,3,4,5].map(s => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <MaterialIcons name={rating >= s ? 'star' : 'star-border'} size={32} color="#f59e0b" />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput placeholder="Write your comments (optional)" value={text} onChangeText={setText} multiline style={styles.input} />

          <View style={styles.rowRight}>
            <TouchableOpacity onPress={onClose} style={styles.btn}><Text>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={submit} style={[styles.btn, styles.primary]}><Text style={{color:'#fff'}}>Submit</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  title: { fontWeight: '700', fontSize: 18, marginBottom: 12 },
  stars: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  input: { minHeight: 80, borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 8, textAlignVertical: 'top' },
  rowRight: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  btn: { padding: 8 },
  primary: { backgroundColor: '#6200ee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
});
