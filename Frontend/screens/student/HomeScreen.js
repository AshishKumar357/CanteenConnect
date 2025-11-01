import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ReviewModal from '../../components/ReviewModal';
import OptOutModal from '../../components/OptOutModal';
import OptOutRangeModal from '../../components/OptOutRangeModal';
import useResponsive from '../../utils/responsive';
import theme from '../../utils/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function getDateArray(centerDate, days = 7) {
  const arr = [];
  const start = new Date(centerDate);
  start.setDate(start.getDate() - Math.floor(days / 2));
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
}

// Meal palette: use dedicated meal tokens (keeps semantic meaning separate from generic status colors)
const MEALS = [
  { key: 'breakfast', label: 'Breakfast', time: '7:00 - 9:00', color: theme.colors.mealBreakfast },
  { key: 'lunch', label: 'Lunch', time: '12:00 - 14:00', color: theme.colors.mealLunch },
  { key: 'snacks', label: 'Snacks', time: '16:00 - 17:00', color: theme.colors.mealSnacks },
  { key: 'dinner', label: 'Dinner', time: '19:00 - 21:00', color: theme.colors.mealDinner },
];

// mock menu items generator (same for all days for now)
function mockMenuFor(mealKey) {
  switch (mealKey) {
    case 'breakfast':
      return ['Eggs', 'Toast', 'Tea', 'Fruit'];
    case 'lunch':
      return ['Rice', 'Dal', 'Sabzi', 'Salad'];
    case 'snacks':
      return ['Samosa', 'Tea', 'Juice'];
    case 'dinner':
      return ['Chapati', 'Paneer Curry', 'Raita'];
    default:
      return [];
  }
}

function lightenColor(hex, factor) {
  // Blend color toward white by factor (0..1). factor=0 => original, factor=1 => white
  const c = hex.replace('#', '');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const nr = Math.round(r + (255 - r) * factor);
  const ng = Math.round(g + (255 - g) * factor);
  const nb = Math.round(b + (255 - b) * factor);
  return `rgb(${nr}, ${ng}, ${nb})`;
}

function mealIconName(key) {
  switch (key) {
    case 'breakfast':
      return 'free-breakfast';
    case 'lunch':
      return 'sunny';
    case 'snacks':
      return 'fastfood';
    case 'dinner':
      return 'restaurant';
    default:
      return 'restaurant-menu';
  }
}

export default function HomeScreen() {
  const today = useMemo(() => new Date(), []);
  const dates = useMemo(() => getDateArray(today, 11), [today]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(Math.floor(dates.length / 2));
  const dateListRef = useRef(null);
  const { width, rs, wp } = useResponsive();
  // spacing between date items in px (kept in sync with styles.dateItem marginRight)
  const GAP = 10;
  // compute a uniform date item size so we can center items precisely
  const dateSize = Math.max(56, Math.min(96, Math.round(width * 0.14)));
  // padding so the strip centers within the viewport (we render equal padding left/right)
  const sidePad = Math.max(8, Math.round((width - dateSize) / 2));
  // total content width of the date strip
  const contentWidth = sidePad * 2 + dates.length * dateSize + Math.max(0, (dates.length - 1) * GAP);
  // animated offset controller for smooth scrolling
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const scrollAnimListener = useRef(null);
  const [expanded, setExpanded] = useState({});
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [optOutModalVisible, setOptOutModalVisible] = useState(false);
  const [optOutRangeVisible, setOptOutRangeVisible] = useState(false);
  const [optOutRangeConfirmData, setOptOutRangeConfirmData] = useState(null);
  const [activeReview, setActiveReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [activeOptOut, setActiveOptOut] = useState(null);
  const [optReasonOpen, setOptReasonOpen] = useState(false);
  const [optReason, setOptReason] = useState('');

  function toggleExpand(mealKey) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [mealKey]: !prev[mealKey] }));
  }

  function renderDate({ item, index }) {
    const isActive = index === selectedDateIndex;
    const label = item.toLocaleDateString(undefined, { weekday: 'short' });
    const day = item.getDate();
    return (
      <TouchableOpacity
        style={[styles.dateItem, { width: dateSize, height: dateSize, borderRadius: Math.round(dateSize * 0.18) }, isActive && styles.dateItemActive]}
        onPress={() => {
          setSelectedDateIndex(index);
          // center this index in the viewport by computing offset and animating
          if (typeof index === 'number') {
            try {
              const itemCenter = sidePad + index * (dateSize + GAP) + dateSize / 2;
              let offset = itemCenter - width / 2;
              animateToOffset(offset, 380);
            } catch (e) { /* ignore */ }
          }
        }}>
        <Text style={[styles.dateLabel, isActive && styles.dateLabelActive, { fontSize: Math.max(11, rs(12)) }]}>{label}</Text>
        <Text style={[styles.dateDay, isActive && styles.dateDayActive, { fontSize: Math.max(16, rs(20)) }]}>{day}</Text>
      </TouchableOpacity>
    );
  }

  // center the selected date on mount
  useEffect(() => {
    const idx = selectedDateIndex;
    if (dateListRef.current && typeof idx === 'number') {
      setTimeout(() => {
        try {
          // center on mount using offset calculation (set value directly to avoid animation)
          const itemCenter = sidePad + idx * (dateSize + GAP) + dateSize / 2;
          let offset = itemCenter - width / 2;
          const maxOffset = Math.max(0, contentWidth - width);
          if (offset < 0) offset = 0;
          if (offset > maxOffset) offset = maxOffset;
          // sync animated value and set without animation
          scrollAnim.setValue(offset);
        } catch (e) {
          // ignore; fallback will just render normally
        }
      }, 80);
    }
  }, [dateListRef, selectedDateIndex]);

  // whenever selectedDateIndex changes (user press or programmatic), ensure it's centered
  useEffect(() => {
    // add listener to drive the scroll view from animated value
    if (!scrollAnimListener.current) {
      scrollAnimListener.current = scrollAnim.addListener(({ value }) => {
        if (dateListRef.current) {
          try { dateListRef.current.scrollToOffset({ offset: value, animated: false }); } catch (e) { /* ignore */ }
        }
      });
    }

    return () => {
      if (scrollAnimListener.current) {
        scrollAnim.removeListener(scrollAnimListener.current);
        scrollAnimListener.current = null;
      }
    };
  }, []);

  // helper to animate to an offset smoothly
  function animateToOffset(targetOffset, duration = 360) {
    const maxOffset = Math.max(0, contentWidth - width);
    let final = targetOffset;
    if (final < 0) final = 0;
    if (final > maxOffset) final = maxOffset;
    Animated.timing(scrollAnim, { toValue: final, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }

  const selectedDate = dates[selectedDateIndex];

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { fontSize: Math.max(18, rs(22)), padding: Math.max(12, rs(14)) }]}>Menu For The Day</Text>

      <View style={styles.dateStrip}>
        <FlatList
          ref={dateListRef}
          data={dates}
          horizontal
          keyExtractor={d => d.toISOString()}
          renderItem={renderDate}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(data, index) => ({ length: dateSize + GAP, offset: sidePad + (dateSize + GAP) * index, index })}
          contentContainerStyle={[styles.dateListContent, { paddingHorizontal: sidePad }]}
        />
      </View>

      <ScrollView style={styles.meals} contentContainerStyle={{ paddingBottom: 60 }}>
        <Text style={styles.subHeader}>Menus for {selectedDate.toLocaleDateString()}</Text>

        {MEALS.map(meal => {
          const items = mockMenuFor(meal.key);
          const isOpen = !!expanded[meal.key];
          return (
            <View key={meal.key} style={[styles.mealCard, styles.mealCardShadow]}>
              <TouchableOpacity onPress={() => toggleExpand(meal.key)} style={[styles.mealHeader, { backgroundColor: meal.color, shadowColor: meal.color, padding: Math.max(10, rs(12)) }] }>
                <View style={styles.mealHeaderLeft}>
                  <View style={[styles.headerIconWrap, { backgroundColor: 'rgba(255,255,255,0.12)', width: Math.max(36, rs(42)), height: Math.max(36, rs(42)) }]}>
                      <MaterialIcons name={mealIconName(meal.key)} size={Math.max(16, rs(18))} color={theme.colors.onPrimary} />
                  </View>
                  <View>
                      <Text style={[styles.mealLabel, { color: theme.colors.onPrimary, textShadowColor: meal.color, textShadowOffset: { width: 0, height: 6 }, textShadowRadius: 12, fontSize: Math.max(14, rs(16)) }]}>{meal.label}</Text>
                      <Text style={[styles.mealTime, { color: 'rgba(255,255,255,0.9)', fontSize: Math.max(11, rs(12)) }]}>{meal.time}</Text>
                  </View>
                </View>
                <MaterialIcons name={isOpen ? 'expand-less' : 'chevron-right'} size={Math.max(22, rs(26))} color="rgba(255,255,255,0.95)" />
              </TouchableOpacity>

              {isOpen && (
                    <View style={[styles.mealBody, { backgroundColor: lightenColor(meal.color, 0.88) }]}>
                      {items.map((it, idx) => (
                        <Text key={idx} style={styles.menuItem}>• {it}</Text>
                      ))}

                      <View style={[styles.footerRow, { padding: 12, borderRadius: 12, marginTop: 14 }] }>
                          <TouchableOpacity style={[styles.footerBtn, styles.reviewBtn]} onPress={() => { setActiveReview(meal); setReviewModalVisible(true); }}>
                            <View style={[styles.iconCircle, styles.reviewIconBg]}>
                              <MaterialIcons name="rate-review" size={18} color={meal.color} />
                            </View>
                            <Text style={[styles.reviewBtnText]}>Review</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.footerBtn, styles.optBtn, { backgroundColor: meal.color, shadowColor: meal.color }]} onPress={() => { setActiveOptOut(meal); setOptOutModalVisible(true); }}>
                            <View style={[styles.iconCircle, styles.optIconBg]}>
                              <MaterialIcons name="block" size={18} color={theme.colors.onPrimary} />
                            </View>
                            <Text style={[styles.optBtnText]}>Opt out</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                  )}
            </View>
          );
        })}

        <View style={styles.optOutButtonContainer}>
          <TouchableOpacity onPress={() => setOptOutRangeVisible(true)} style={styles.optOutButton}>
            <Text style={styles.optOutButtonText}>Opt out for all meals — {selectedDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
          <ReviewModal visible={reviewModalVisible} onClose={() => setReviewModalVisible(false)} onSubmit={(data) => console.log('review', data)} mealLabel={activeReview?.label} />
          <OptOutModal visible={optOutModalVisible} onClose={() => setOptOutModalVisible(false)} onConfirm={(data) => console.log('optout', data)} mealLabel={activeOptOut?.label} />
          <OptOutRangeModal visible={optOutRangeVisible} onClose={() => setOptOutRangeVisible(false)} onConfirm={(data) => { setOptOutRangeVisible(false); setTimeout(() => setOptOutRangeConfirmData(data), 220); }} defaultDate={selectedDate} dates={dates} />

          {/* Confirmation dialog shown after user selects opt-out range in the modal */}
          <Modal visible={!!optOutRangeConfirmData} transparent animationType="fade">
            <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { marginHorizontal: wp(10) }]}>
                <Text style={styles.modalTitle}>Confirm Opt-out</Text>
                {optOutRangeConfirmData && (
                  <View>
                    <Text style={{ marginBottom: 8 }}>You are opting out of all meals for:</Text>
                    <Text style={{ fontWeight: '700' }}>{optOutRangeConfirmData.multiple ? `${optOutRangeConfirmData.startDate.toLocaleDateString()} — ${optOutRangeConfirmData.endDate.toLocaleDateString()}` : `${optOutRangeConfirmData.startDate.toLocaleDateString()}`}</Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
                  <TouchableOpacity onPress={() => { setOptOutRangeConfirmData(null); setOptOutRangeVisible(true); }} style={{ padding: 8, marginRight: 8 }}>
                    <Text>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    // finalize opt-out (placeholder)
                    console.log('optout-final', optOutRangeConfirmData);
                    setOptOutRangeConfirmData(null);
                    // small success confirmation could be shown here
                  }} style={styles.confirmBtn}>
                    <Text style={styles.confirmBtnText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dateListContent: { paddingHorizontal: 60, alignItems: 'center' },
  screen: { flex: 1 },
  header: 
  { 
    fontSize: 22, 
    fontWeight: '700', 
    padding: 16,
    textAlign: 'center',
    padding: 20,
  },
  dateStrip: { paddingLeft: 12, paddingBottom: 8},
  dateItem: { width: 72, height: 72, borderRadius: 12, backgroundColor: theme.colors.neutralLight, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  dateItemActive: { backgroundColor: theme.colors.primary, shadowColor: theme.shadows.default, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 8 },
  dateLabel: { fontSize: 12, color: theme.colors.muted },
  dateLabelActive: { color: theme.colors.onPrimary },
  dateDay: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  dateDayActive: { color: theme.colors.onPrimary },
  meals: { flex: 1, paddingHorizontal: 16 },
  subHeader: 
  { 
    fontSize: 16, 
    fontWeight: '600', 
    marginVertical: 8, 
    textAlign: 'center',
  },
  mealCard: { marginBottom: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: 'transparent' },
  mealCardShadow: { shadowColor: theme.shadows.default, shadowOpacity: 0.12, shadowOffset: { width: 0, height: 10 }, shadowRadius: 24, elevation: 10 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, alignItems: 'center' },
  mealHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIconWrap: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  mealLabel: { fontSize: 16, fontWeight: '800' },
  mealTime: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  mealBody: { padding: 14, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  menuItem: { paddingVertical: 6, fontSize: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  footerBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  outBtn: { /* placeholder: color applied inline */ },
  footerBtnText: { color: theme.colors.onPrimary, marginLeft: 10, fontWeight: '800' },
  /* modern review button */
  reviewBtn: { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row' },
  reviewBtnText: { color: theme.colors.text, marginLeft: 10, fontWeight: '700' },
  reviewIconBg: { backgroundColor: theme.colors.background, width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  /* modern opt-out button */
  optBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', elevation: 6 },
  optBtnText: { color: theme.colors.onPrimary, marginLeft: 10, fontWeight: '800' },
  optIconBg: { backgroundColor: 'rgba(255,255,255,0.12)', width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16 },
  modalCard: { backgroundColor: theme.colors.background, borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  starRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  modalInput: { minHeight: 80, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 8, textAlignVertical: 'top' },
  modalClose: { padding: 8 },
  picker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, marginTop: 8 },
  pickerOptions: { marginTop: 8, backgroundColor: theme.colors.background, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: theme.colors.border },
  optOutButtonContainer: { alignItems: 'flex-end', paddingHorizontal: 12, marginTop: 6, marginBottom: 40 },
  optOutButton: { backgroundColor: theme.colors.text, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  optOutButtonText: { color: theme.colors.onPrimary, fontWeight: '700' },
  confirmBtn: { backgroundColor: theme.colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  confirmBtnText: { color: theme.colors.onPrimary, fontWeight: '700' },
});
