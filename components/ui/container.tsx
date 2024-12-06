import Colors from "@/constants/Colors";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <View style={styles.container}>{children}</View>;
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 16,
    paddingRight: 16,
    paddingLeft: 16,
  },
});
