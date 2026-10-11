import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, styles } from '../theme';
import { useReducedMotion } from '../lib/anim';

const skeleton = StyleSheet.create({
  bar: { backgroundColor: COLORS.muted, opacity: 0.35, height: 18, marginBottom: 8 },
  meta: { backgroundColor: COLORS.muted, opacity: 0.25, height: 14, width: '60%' },
});

// Pops once when the row is the just-added name (transform-only: no contrast or layout cost).
const Row = memo(function Row({ row, flash }) {
  const reduce = useReducedMotion();
  const pop = useRef(new Animated.Value(flash && !reduce ? 0.9 : 1)).current;
  useEffect(() => {
    if (flash && !reduce) {
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }).start();
    }
  }, [flash]);
  return (
    <Animated.View role="listitem" style={[styles.row, { transform: [{ scale: pop }] }]}>
      <Text style={styles.rowName}>{row.name}</Text>
      <Text style={styles.rowMeta}>
        {row.time} · {row.device}
      </Text>
      {row.queued ? (
        <View style={[styles.badge, { marginBottom: 0, marginTop: 8 }]}>
          <Text style={styles.badgeText}>QUEUED</Text>
        </View>
      ) : null}
      {flash ? (
        <View style={[styles.badge, { marginBottom: 0, marginTop: 8, backgroundColor: COLORS.cta }]}>
          <Text style={[styles.badgeText, { color: COLORS.onCta }]}>★ NEW!</Text>
        </View>
      ) : null}
    </Animated.View>
  );
});

export default function NameList({ rows = [], loading = false, highlight = null }) {
  if (loading) {
    return (
      <View accessibilityBusy aria-busy="true" accessibilityLabel="Loading names">
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.row}>
            <View style={skeleton.bar} />
            <View style={skeleton.meta} />
          </View>
        ))}
      </View>
    );
  }
  if (!rows.length) {
    return (
      <Text role="status" style={styles.body}>
        No names yet — be the first!
      </Text>
    );
  }
  const ordered = rows;
  return (
    <View role="list" accessibilityRole="list">
      {ordered.map((row, i) => (
        <Row key={`${row.name}-${row.time}-${i}`} row={row} flash={highlight === `${row.name}|${row.time}`} />
      ))}
    </View>
  );
}
