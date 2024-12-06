import Colors from "@/constants/Colors";
import { Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
  title: string;
  disabled?: boolean;
  onPress?: () => void;
}
const Button = ({ disabled, onPress, title }: ButtonProps) => {
  return (
    <Pressable
      style={[styles.pressable, disabled ? styles.disabled : styles.enabled]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={{ fontSize: 20, textAlign: "center", fontWeight: 500 }}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
    padding: 12,
    margin: 8,
  },
  disabled: {
    backgroundColor: Colors.icon,
  },
  enabled: {
    backgroundColor: Colors.button,
  },
});
