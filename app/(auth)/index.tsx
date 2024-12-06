import AlertModal from "@/components/ui/alertModal";
import Button from "@/components/ui/button";
import ButtonIcon from "@/components/ui/buttonIcon";
import Container from "@/components/ui/container";
import { Email, User, Lock, ArrowBack } from "@/components/ui/icon";
import Input from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/utils/isValidEmail";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthPage = () => {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signUp">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Verifica si los campos requeridos están completos
    const isFormValid =
      email &&
      password &&
      isValidEmail(email) &&
      (mode === "signUp"
        ? username && confirmPassword && password === confirmPassword
        : true);

    setIsButtonDisabled(!isFormValid);
  }, [email, password, username, confirmPassword, mode]);

  const handleSubmit = async () => {
    setLoading(true);
    if (
      !email ||
      !password ||
      (mode === "signUp" && (!username || !confirmPassword))
    ) {
      setAlertTitle("Error");
      setAlertMessage("Por favor, completa todos los campos");
      setAlertVisible(true);
      return;
    } else if (!isValidEmail(email)) {
      setAlertTitle("Email Invalido");
      setAlertMessage("Por favor, ingrese un correo valido!");
      setAlertVisible(true);
      return;
    } else if (mode === "signUp" && password !== confirmPassword) {
      setAlertTitle("Error");
      setAlertMessage("Las contraseñas no coinciden");
      setAlertVisible(true);
      return;
    } else if (mode === "signUp") {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) {
        setAlertTitle("Error");
        setAlertMessage(`Error al registrarse: ${error.message}`);
        setAlertVisible(true);
        return;
      }
      if (session) {
        setAlertTitle("Éxito");
        setAlertMessage("Te has registrado con exito!");
        setAlertVisible(true);
        router.replace("/(auth)");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } else if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAlertTitle("Error");
        setAlertMessage(`Error al Iniciar: ${error.message}`);
        setAlertVisible(true);
        return;
      } else {
        setAlertTitle("Éxito");
        setAlertMessage("Has iniciado sesión correctamente");
        setAlertVisible(true);
      }
      setLoading(false);
    }
  };
  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{ flexDirection: "row" }}>
            <ButtonIcon href={".."}>
              <ArrowBack />
            </ButtonIcon>
            <Logo />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ padding: 10, top: -40 }}>
                {mode === "signUp" && (
                  <Input
                    keyboardType="default"
                    placeholder="Nombre de usuario"
                    onChangeText={(text) => setUsername(text)}
                  >
                    <User />
                  </Input>
                )}
                <Input
                  placeholder="Correo"
                  onChangeText={(text) => setEmail(text)}
                  keyboardType="email-address"
                >
                  <Email />
                </Input>

                <Input
                  placeholder="Contraseña"
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  keyboardType="default"
                >
                  <Lock />
                </Input>
                {mode === "signUp" && (
                  <Input
                    placeholder="Confirmar contraseña"
                    onChangeText={(text) => setConfirmPassword(text)}
                    secureTextEntry={true}
                    keyboardType="default"
                  >
                    <Lock />
                  </Input>
                )}

                <Button
                  title={mode === "login" ? "Iniciar sesión" : "Registrarse"}
                  onPress={handleSubmit}
                  disabled={isButtonDisabled || loading}
                />
                <View style={styles.text}>
                  <Text style={{ marginBottom: 5, fontSize: 16 }}>
                    {mode === "login"
                      ? "¿No tienes una cuenta?"
                      : "¿Ya tienes una cuenta?"}
                  </Text>
                  <Button
                    title={mode === "login" ? "Regístrate" : "Inicia sesión"}
                    onPress={() =>
                      setMode(mode === "login" ? "signUp" : "login")
                    }
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
      <AlertModal
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </Container>
  );
};

export default AuthPage;

const styles = StyleSheet.create({
  text: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20 - 0 - 0 - 0,
  },
});
