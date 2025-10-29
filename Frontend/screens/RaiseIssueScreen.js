import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import useResponsive from '../utils/responsive';
import theme from '../utils/theme';

const CATEGORIES = [
  'Quantity issue',
  'Quality issue',
  'Insect in food',
  'Management issue',
  'Others',
];

export default function RaiseIssueScreen() {
  const [images, setImages] = useState([]); // array of uri
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const { width, rs } = useResponsive();
  const thumbSize = Math.max(64, Math.min(120, Math.round(width * 0.18)));

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Please allow media access to attach images.');
        }
      }
    })();
  }, []);

  async function addImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setImages(prev => [uri, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function removeImage(uri) {
    setImages(prev => prev.filter(u => u !== uri));
  }

  function submit() {
    if (!title.trim()) return Alert.alert('Validation', 'Please enter a short title for the issue.');
    if (!description.trim()) return Alert.alert('Validation', 'Please provide a detailed description.');

    // For now just show summary — integration with API/DB later
    Alert.alert('Submitted', `Title: ${title}\nCategory: ${category}\nImages: ${images.length}`);

    // reset form
    setTitle('');
    setDescription('');
    setImages([]);
    setCategory(CATEGORIES[0]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.header, { fontSize: Math.max(18, rs(22)) }]}>Report food issue</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={styles.label}>Attach photos (max 6)</Text>
        <View style={styles.imageRow}>
          <TouchableOpacity style={[styles.addThumb, { width: thumbSize, height: thumbSize }]} onPress={addImage}>
            <MaterialIcons name="add-a-photo" size={Math.max(20, rs(24))} color={theme.colors.primary} />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>

          {images.map(uri => (
                    <View key={uri} style={[styles.thumbWrap, { width: thumbSize, height: thumbSize }]}>
                      <Image source={{ uri }} style={[styles.thumb, { width: thumbSize, height: thumbSize }]} />
                      <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(uri)}>
                        <MaterialIcons name="close" size={Math.max(14, rs(14))} color={theme.colors.onPrimary} />
                      </TouchableOpacity>
                    </View>
          ))}
        </View>

        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Short title for the issue"
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { padding: Math.max(8, rs(10)) }]}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Category</Text>
        <View style={styles.pickerRow}>
              <TouchableOpacity style={[styles.picker, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]} onPress={() => setPickerOpen(p => !p)}>
            <Text style={styles.pickerText}>{category}</Text>
            <MaterialIcons name={pickerOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} />
          </TouchableOpacity>
          {pickerOpen && (
            <View style={[styles.pickerOptions, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} style={styles.pickerOption} onPress={() => { setCategory(cat); setPickerOpen(false); }}>
                  <Text>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Description / Recommendation</Text>
        <TextInput
          placeholder="Describe the problem, what you recommend, and any steps you took"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textarea, { padding: Math.max(8, rs(10)) }]}
          multiline
          numberOfLines={6}
        />

        <TouchableOpacity style={[styles.submit, { paddingVertical: Math.max(12, rs(12)), backgroundColor: theme.colors.primary }]} onPress={submit}>
          <Text style={[styles.submitText, { fontSize: Math.max(14, rs(15)), color: theme.colors.onPrimary }]}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: theme.colors.card, borderRadius: 12, padding: 16 },
  label: { fontWeight: '600', marginBottom: 8 },
  imageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addThumb: {
    width: 84,
    height: 84,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addText: { fontSize: 12, color: theme.colors.primary },
  thumbWrap: { width: 84, height: 84, marginRight: 8 },
  thumb: { width: 84, height: 84, borderRadius: 8, resizeMode: 'cover' },
  removeBtn: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 12,
  },
  input: {
  backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
  borderColor: theme.colors.border,
  },
  textarea: { minHeight: 120, textAlignVertical: 'top' },
  pickerRow: { marginBottom: 8 },
          picker: {
            backgroundColor: theme.colors.background,
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          pickerOptions: { marginTop: 8, backgroundColor: theme.colors.background, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: theme.colors.border },
  pickerOption: { paddingVertical: 8 },
          submit: { marginTop: 16, backgroundColor: theme.colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
          submitText: { color: theme.colors.onPrimary, fontWeight: '700' },
});

