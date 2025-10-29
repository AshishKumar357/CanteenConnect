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
import theme from '../utils/theme';

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

  const sideMargin = Math.max(12, Math.round(width * 0.06));

  return (
    <View style={[styles.screen, { paddingHorizontal: sideMargin }]}>
      <View style={styles.cardColumn}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (editing) pickImage();
          }}
    style={[styles.avatarWrapper, { width: avatarSize, height: avatarSize, borderRadius: Math.round(avatarSize / 2) }]}
        >
          <Image
            source={photo ? { uri: photo } : require('../assets/profile.png')}
            style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: Math.round(avatarSize / 2) }]}
          />
          {editing && (
            <View style={styles.cameraOverlay}>
              <MaterialIcons name="photo-camera" size={20} color={theme.colors.onPrimary} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.detailsColumn}>
          <Text style={styles.displayName}>{name}</Text>
          <Text style={styles.subtleText}>{division} • Roll {rollNumber}</Text>
          <View style={styles.separator} />
          <View style={styles.rowColumn}>
            <Text style={styles.labelColumn}>Name</Text>
            {editing ? (
              <TextInput value={name} onChangeText={setName} style={styles.inputColumn} />
            ) : (
              <Text style={styles.valueColumn}>{name}</Text>
            )}
          </View>

          <View style={styles.rowColumn}>
            <Text style={styles.labelColumn}>Division</Text>
            {editing ? (
              <TextInput value={division} onChangeText={setDivision} style={styles.inputColumn} />
            ) : (
              <Text style={styles.valueColumn}>{division}</Text>
            )}
          </View>

          <View style={styles.rowColumn}>
            <Text style={styles.labelColumn}>Roll number</Text>
            {editing ? (
              <TextInput value={rollNumber} onChangeText={setRollNumber} style={styles.inputColumn} />
            ) : (
              <Text style={styles.valueColumn}>{rollNumber}</Text>
            )}
          </View>

          <View style={styles.rowColumn}>
            <Text style={styles.labelColumn}>PRN</Text>
            {editing ? (
              <TextInput value={prn} onChangeText={setPrn} style={styles.inputColumn} />
            ) : (
              <Text style={styles.valueColumn}>{prn}</Text>
            )}
          </View>

          <View style={styles.rowColumn}>
            <Text style={styles.labelColumn}>Batch</Text>
            {editing ? (
              <TextInput value={batch} onChangeText={setBatch} style={styles.inputColumn} />
            ) : (
              <Text style={styles.valueColumn}>{batch}</Text>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity style={[styles.editButton, { marginHorizontal: sideMargin }]} onPress={editing ? onEditSave : () => setEditing(true)}>
        <Text style={styles.editButtonText}>{editing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingVertical: 16, backgroundColor: theme.colors.background },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  cardColumn: { alignItems: 'center', padding: 18, backgroundColor: theme.colors.card, borderRadius: 12, shadowColor: theme.shadows.default, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  detailsColumn: { width: '100%', marginTop: 12 },
  displayName: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  subtleText: { textAlign: 'center', color: theme.colors.muted, marginTop: 4 },
  separator: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },
  rowColumn: { marginBottom: 10 },
  avatarWrapper: { borderRadius: 8, overflow: 'hidden' },
  avatar: { resizeMode: 'cover' },
  cameraOverlay: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  labelColumn: { fontWeight: '600', marginBottom: 6 },
  valueColumn: { marginBottom: 6 },
  inputColumn: { borderWidth: 1, borderColor: theme.colors.border, padding: 10, borderRadius: 10, backgroundColor: theme.colors.background },
  editButton: {
    marginTop: 18,
    width: '80%',
  backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
  },
  editButtonText: { color: theme.colors.onPrimary, fontWeight: '700' },
  uploadButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: theme.colors.border,
  },
  uploadText: 
  { 
    color: theme.colors.text 
  },
});

