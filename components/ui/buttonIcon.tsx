import Colors from "@/constants/Colors";
import { Href, Link } from "expo-router";
import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

interface ButonIconProps {
  href: Href;
  children: ReactNode;
}
const ButtonIcon = ({ children, href }: ButonIconProps) => {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.buttonIcon}>{children}</Pressable>
    </Link>
  );
};

export default ButtonIcon;

const styles = StyleSheet.create({
  buttonIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: Colors.button,
    borderRadius: 9999,
  },
});
