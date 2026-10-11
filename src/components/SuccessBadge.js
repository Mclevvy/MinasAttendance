import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { COLORS, FONTS, styles } from '../theme';
import PixelButton from './PixelButton';
import { useReducedMotion } from '../lib/anim';

const STARS = ['★', '✦', '★', '✦', '★'];

export default function SuccessBadge({ name, webinar, onClose }) {
  const reduce = useReducedMotion();
  const pop = useRef(new Animated.Value(0)).current;
  const twinkles = useRef(STARS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (reduce) {
      pop.setValue(1);
      twinkles.forEach((v) => v.setValue(1));
      return;
    }
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start();
    const loops = twinkles.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(v, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.25, duration: 350, useNativeDriver: true }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [reduce]);

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.overlayCard,
          { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] },
        ]}
      >
        <View style={{ flexDirection: 'row', marginBottom: 8 }} aria-hidden="true">
          {STARS.map((s, i) => (
            <Animated.Text
              key={i}
              style={{ opacity: twinkles[i], color: COLORS.cta, fontSize: 26, marginHorizontal: 4, fontFamily: FONTS.body }}
            >
              {s}
            </Animated.Text>
          ))}
        </View>
        <Text style={styles.heading}>★ CERTIFICATE EARNED! ★</Text>
        <Text style={styles.body}>{name}</Text>
        <Text style={styles.rowMeta}>{webinar}</Text>
        <PixelButton title="Close" onPress={onClose} accessibilityLabel="Close success message" />
      </Animated.View>
    </View>
  );
}
