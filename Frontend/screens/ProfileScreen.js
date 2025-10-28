import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import useResponsive from '../utils/responsive';

export default function ProfileScreen() {
  // initial sample data
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState('John Doe');
  const [division, setDivision] = useState('A');
  const [rollNumber, setRollNumber] = useState('12345');
  const [prn, setPrn] = useState('PRN000123');
  const [batch, setBatch] = useState('2024');

  useEffect(() => {
    // ask for permissions when editing or on mount (for image picker)
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Camera roll permissions are needed to upload a photo.');
        }
      }
    })();
  }, []);

  const { width, rs } = useResponsive();
  const avatarSize = Math.min(160, Math.round(width * 0.32));

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        // expo SDK 48+: result.assets[0].uri
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setPhoto(uri);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function onEditSave() {
    if (editing) {
      // Save action (just local state for now)
      setEditing(false);
      Alert.alert('Saved', 'Profile changes were saved locally.');
    } else {
      setEditing(true);
    }
  }

  return (
    <View style={styles.screen}>
      {/* <Text style={styles.header}>Profile</Text> */}

      <View style={styles.card}>
        <View style={styles.left}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (editing) pickImage();
            }}
            style={[styles.avatarWrapper, { width: avatarSize, height: avatarSize, borderRadius: Math.round(avatarSize * 0.08) }]}
          >
            <Image
              source={photo ? { uri: photo } : require('../assets/profile.png')}
              style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: Math.round(avatarSize * 0.08) }]}
            />
            {editing && (
              <View style={styles.cameraOverlay}>
                <MaterialIcons name="photo-camera" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.right}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            {editing ? (
              <TextInput value={name} onChangeText={setName} style={styles.input} />
            ) : (
              <Text style={styles.value}>{name}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Division:</Text>
            {editing ? (
              <TextInput value={division} onChangeText={setDivision} style={styles.input} />
            ) : (
              <Text style={styles.value}>{division}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Roll number:</Text>
            {editing ? (
              <TextInput value={rollNumber} onChangeText={setRollNumber} style={styles.input} />
            ) : (
              <Text style={styles.value}>{rollNumber}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>PRN:</Text>
            {editing ? (
              <TextInput value={prn} onChangeText={setPrn} style={styles.input} />
            ) : (
              <Text style={styles.value}>{prn}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Batch:</Text>
            {editing ? (
              <TextInput value={batch} onChangeText={setBatch} style={styles.input} />
            ) : (
              <Text style={styles.value}>{batch}</Text>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={editing ? onEditSave : () => setEditing(true)}>
        <Text style={styles.editButtonText}>{editing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#f6f6f6', borderRadius: 8, marginHorizontal: '10%',},
  left: { width: '36%', alignItems: 'center', justifyContent: 'center' },
  right: { width: '64%', paddingLeft: 12, justifyContent: 'center' },
  avatarWrapper: { width: 120, height: 120, borderRadius: 8, overflow: 'hidden' },
  avatar: { width: 120, height: 120, borderRadius: 8, resizeMode: 'cover' },
  cameraOverlay: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  row: 
  { 
    flexDirection: 'row', 
    marginBottom: 8, 
    alignItems: 'center' 
  },
  label: 
  { 
    width: 110, 
    fontWeight: '600' 
  },
  value: 
  { 
    flex: 1
   },
  input: 
  { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 6, 
    borderRadius: 4 
  },
  editButton: {
    marginTop: 18,
    marginHorizontal: '10%',
    width: '80%',
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: 
  { 
    color: 'white', 
    fontWeight: '700' 
  },
  uploadButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  uploadText: 
  { 
    color: '#333' 
  },
});

