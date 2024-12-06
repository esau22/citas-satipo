import Container from "@/components/ui/container";
import Logo from "@/components/ui/logo";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const HomePage = () => {
  return (
    <Container>
      <View style={{ top: 100 }}>
        <Logo />
      </View>
      <Link href={"/(auth)"} style={styles.link}>
        <Text style={styles.text}>Iniciar Session</Text>
      </Link>
      <View style={styles.view}>
        <Text style={{ color: Colors.text, fontWeight: 400, fontSize: 15 }}>
          ¿No tienes una cuenta?
        </Text>
        <Link href={"/(auth)"}>
          <Text style={{ color: Colors.text, fontSize: 20, fontWeight: 700 }}>
            Registrate
          </Text>
        </Link>
      </View>
    </Container>
  );
};

export default HomePage;
const styles = StyleSheet.create({
  link: {
    backgroundColor: Colors.button,
    borderRadius: 20,
    padding: 8,
    marginTop: 200,
    marginLeft: 50,
    marginRight: 50,
  },
  text: {
    color: Colors.text,
    fontWeight: 600,
    fontSize: 30,
    textAlign: "center",
  },
  view: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    margin: 20 - 0,
  },
});
