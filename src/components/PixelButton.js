import { useRef, useState } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { styles } from '../theme';
import { useReducedMotion } from '../lib/anim';

export default function PixelButton({ title, onPress, variant = 'primary', disabled = false, accessibilityLabel }) {
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();
  const squash = useRef(new Animated.Value(1)).current;
  const secondary = variant === 'secondary';

  function press(down) {
    if (disabled || reduce) return;
    Animated.spring(squash, { toValue: down ? 0.92 : 1, friction: 6, tension: 300, useNativeDriver: true }).start();
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPressIn={() => press(true)}
      onPressOut={() => press(false)}
      style={({ pressed }) => [
        styles.btn,
        secondary ? styles.btnSecondary : styles.btnPrimary,
        disabled && styles.disabled,
        focused && !disabled && styles.focusRing,
        pressed && !disabled && { opacity: 0.85 },
        { transform: [{ scale: squash }] },
      ]}
    >
      <Text style={[styles.btnText, secondary ? styles.btnTextLight : styles.btnTextDark]}>{title}</Text>
    </Pressable>
  );
}
