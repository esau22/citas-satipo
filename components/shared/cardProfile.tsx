import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { downloadAvatar, Profile } from "@/lib/api";
import * as ImagePicker from "expo-image-picker";
import Avatar from "../ui/avatar";
import Button from "../ui/button";

interface CardProfileProps {
  profile: Profile | null | undefined;
  onSave: (updatedProfile: Profile, avatarUpdated: boolean) => void;
  onLogout: () => void;
  loading: boolean | undefined;
}

const CardProfile = ({
  profile,
  onSave,
  loading,
  onLogout,
}: CardProfileProps) => {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
    if (profile?.avatar_url) {
      downloadAvatar(profile.avatar_url).then(setAvatarUrl);
    }
  }, [profile]);

  const handleSubmit = () => {
    if (profile) {
      onSave({ ...profile, username, avatar_url: avatarUrl }, avatarUpdated);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
      setAvatarUpdated(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.input}>
              <Pressable style={styles.avatarButton} onPress={handlePickImage}>
                <Avatar uri={avatarUrl} size={120} />
              </Pressable>

              {/* Input con ícono de edición */}
              <View style={styles.inputContainer}>
                <Icon
                  name="edit"
                  size={24}
                  color="#5750F1"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Nombre de usuario"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>
            <Button
              title="Guardar cambios"
              onPress={handleSubmit}
              disabled={loading || !username}
            />
            <Button title="Cerrar sesión" onPress={onLogout} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default CardProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#f9f9f9",
  },
  inner: {
    flex: 1,
    top: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarButton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row", // Coloca el icono y el input en una fila
    alignItems: "center", // Alineación vertical centrada
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    width: "100%",
    maxWidth: 300,
  },
  icon: {
    marginRight: 90, // Espacio entre el ícono y el input
  },
  textInput: {
    flex: 1, // El input ocupa el espacio disponible
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
