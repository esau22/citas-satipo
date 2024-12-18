import CardProfile from "@/components/shared/cardProfile";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const SettingsPage = () => {
  const router = useRouter();
  const onSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign out", "Error signing out!"); // Mostrar alerta si ocurre un error
    } else {
      router.replace("/(auth)");
    }
  };
  const { profile, loading, saveProfile } = useAuth();
  return (
    <CardProfile
      profile={profile}
      onLogout={onSignOut}
      loading={loading}
      onSave={saveProfile || (() => {})}
    />
  );
};

export default SettingsPage;
