import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import useResponsive from "../utils/responsive";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../utils/theme";

export default function IssueDetailScreen({ route, navigation }) {
  const { issue } = route.params || {};
  if (!issue) return null;

  const media = issue.media || [];
  const { width } = Dimensions.get("window");
  const { rs, wp } = useResponsive();
  const [status, setStatus] = useState(issue.status || "open");

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: wp(4), paddingBottom: 40 }}
    >
      <View
        style={[
          styles.card,
          { padding: rs(14), borderRadius: 14, marginBottom: rs(12) },
        ]}
      >
        <View style={[styles.headerRow, { marginBottom: rs(8) }]}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.title, { fontSize: Math.max(18, rs(20)) }]}
              numberOfLines={2}
            >
              {issue.title}
            </Text>
            <Text style={{ color: theme.colors.muted, marginTop: 6 }}>
              {issue.details}
            </Text>
          </View>

          <View style={styles.headerRightControls}>
            {issue.priority === "urgent" && (
              <View
                style={[
                  styles.urgentLarge,
                  {
                    paddingHorizontal: rs(10),
                    paddingVertical: rs(6),
                    marginRight: 8,
                  },
                ]}
              >
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("RaiseIssue", { issue, edit: true })
              }
              accessibilityLabel="Edit issue"
              style={styles.headerEditBtn}
            >
              <MaterialIcons
                name="edit"
                size={rs(18)}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: rs(12) }}
        >
          {media.length ? (
            media.map((m, i) => {
              const src = typeof m === "string" ? { uri: m } : m;
              return (
                <Image
                  key={i}
                  source={src}
                  style={{
                    width: Math.round(wp(78)),
                    height: rs(200),
                    borderRadius: 12,
                    marginRight: rs(12),
                    resizeMode: "cover",
                  }}
                />
              );
            })
          ) : (
            <View
              style={[
                styles.noMedia,
                { height: rs(120), justifyContent: "center" },
              ]}
            >
              <MaterialIcons
                name="image"
                size={rs(36)}
                color={theme.colors.muted}
              />
              <Image
                source={{
                  uri: "https://media.istockphoto.com/id/1820528838/photo/broken-chair.jpg?s=2048x2048&w=is&k=20&c=iv9DLlb1UXFP-3wydrn4aUAjKqFU7Os-rGmRkWPuBdw=",
                }}
                style={{
                  width: rs(120),
                  height: rs(80),
                  marginTop: rs(8),
                  borderRadius: 8,
                }}
              />
            </View>
          )}
        </ScrollView>

        <View style={{ marginTop: rs(6), marginBottom: rs(6) }}>
          <Text style={[styles.sectionTitle, { marginBottom: rs(6) }]}>
            Progress & Responses
          </Text>
          {["User", "Infra club", "Mess", "Campus admin"].map((s, i) => {
            const resp = issue.responses && issue.responses[i];
            const done = i <= issue.stage;
            return (
              <View key={s} style={styles.detailRow}>
                <View
                  style={[
                    styles.detailDot,
                    {
                      backgroundColor: done
                        ? theme.colors.accent
                        : theme.colors.border,
                    },
                  ]}
                />
                <View style={styles.detailBody}>
                  <Text
                    style={[
                      styles.flowLabel,
                      { color: done ? theme.colors.text : theme.colors.muted },
                    ]}
                  >
                    {s}
                  </Text>
                  {resp ? (
                    <View
                      style={[
                        styles.responseCard,
                        {
                          borderLeftColor: done
                            ? theme.colors.accent
                            : theme.colors.neutralSoft,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.responseText,
                          { fontSize: Math.max(12, rs(12)) },
                        ]}
                        numberOfLines={6}
                      >
                        {resp.text}
                      </Text>
                      <Text
                        style={[
                          styles.responseTime,
                          { fontSize: Math.max(10, rs(10)) },
                        ]}
                      >
                        {resp.time.toLocaleString()}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.noResponse,
                        { fontSize: Math.max(11, rs(11)) },
                      ]}
                    >
                      {done ? "No response recorded yet" : "Pending"}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: rs(6),
          }}
        >
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => {
              Alert.alert(
                "Cancel issue",
                "Are you sure you want to cancel this issue?",
                [
                  { text: "No" },
                  {
                    text: "Yes",
                    onPress: () => {
                      setStatus("cancelled");
                      Alert.alert(
                        "Cancelled",
                        "Issue marked as cancelled (local)."
                      );
                    },
                  },
                ]
              );
            }}
            accessibilityLabel="Cancel issue"
          >
            <MaterialIcons
              name="cancel"
              size={rs(18)}
              color={theme.colors.onPrimary}
              style={styles.actionIcon}
            />
            <Text style={[styles.actionText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.escalateBtn]}
            onPress={() => {
              Alert.alert(
                "Escalate issue",
                "Escalate this issue to the next authority?",
                [
                  { text: "No" },
                  {
                    text: "Yes",
                    onPress: () => {
                      Alert.alert("Escalated", "Issue escalated (simulated).");
                    },
                  },
                ]
              );
            }}
            accessibilityLabel="Escalate issue"
          >
            <MaterialIcons
              name="arrow-upward"
              size={rs(18)}
              color={theme.colors.onPrimary}
              style={styles.actionIcon}
            />
            <Text style={[styles.actionText, styles.escalateText]}>
              Escalate
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Not yet needed
      
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontWeight: "800" },
  urgentLarge: {
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  urgentText: { color: theme.colors.onPrimary, fontWeight: "800" },
  noMedia: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "100%",
  },
  sectionTitle: { fontWeight: "700" },
  detailsText: { color: theme.colors.text },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  detailDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 6,
  },
  detailBody: { flex: 1 },
  flowLabel: { fontWeight: "700", marginBottom: 6 },
  responseCard: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.colors.neutralSoft,
  },
  responseText: { color: theme.colors.text },
  responseTime: { color: theme.colors.muted, marginTop: 6, fontSize: 12 },
  noResponse: { color: theme.colors.muted },
  headerRightControls: { flexDirection: "row", alignItems: "center" },
  headerEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  closeBtn: {
    alignSelf: "center",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  closeText: { color: theme.colors.text, fontWeight: "700" },
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionIcon: { marginRight: 8 },
  actionText: { color: theme.colors.onPrimary, fontWeight: "700" },
  /* edit (secondary) */
  editBtn: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.shadows.default,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 3,
  },
  editText: { color: theme.colors.text },
  /* cancel (danger) */
  cancelBtn: {
    backgroundColor: theme.colors.danger,
    shadowColor: theme.shadows.strong,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  cancelText: { color: theme.colors.onPrimary },
  /* escalate (warning) */
  escalateBtn: {
    backgroundColor: theme.colors.warn,
    shadowColor: theme.shadows.default,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 5,
  },
  escalateText: { color: theme.colors.onPrimary },
});
