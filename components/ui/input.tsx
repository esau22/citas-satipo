import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface InputProps {
  children: ReactNode;
  value?: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  placeholderTextColor?: string;
  keyboardType?: "default" | "email-address" | "numeric";
}

const Input = ({
  children,
  value,
  placeholder,
  secureTextEntry,
  onChangeText,
  placeholderTextColor,
  keyboardType = "default",
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {children}
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
      />
      {secureTextEntry && (
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </Pressable>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: Colors.input,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginVertical: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontWeight: "300",
    fontSize: 20,
  },
});
