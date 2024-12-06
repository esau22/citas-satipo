import { Image, StyleSheet, Text, View } from "react-native";

const Logo = () => {
  return (
    <View style={styles.image}>
      <Image
        source={require("@/assets/images/logo_citas.png")}
        style={{
          width: 300,
          height: 300,
          resizeMode: "center",
        }}
      ></Image>
      <Text style={styles.text}>CitaMatch</Text>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  image: {
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: 800,
    top: -40,
  },
});
