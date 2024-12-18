import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import { Profile } from "@/lib/api";
import { Alert } from "react-native";

type AuthContext = {
  session: Session | null;
  user: User | null | undefined; // Permitir undefined
  profile: Profile | null | undefined; // Permitir undefined
  loading?: boolean;
  saveProfile?: (updatedProfile: Profile, avatarUpdated: boolean) => void;
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        router.replace("/(tabs)");
      } else {
        setSession(null);
        router.push("/(auth)");
      }
    });
  }, [router]);

  const getProfile = async () => {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single(); // Obtener solo un perfil, porque el id debería ser único

    if (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo obtener el perfil.");
    } else {
      setProfile(data);
    }
  };

  // Efecto para obtener el perfil cuando la sesión cambia
  useEffect(() => {
    if (session) {
      getProfile(); // Llamamos a la función para obtener el perfil si hay sesión
    }
  }, [session]);

  // Función para guardar el perfil (y el avatar si es necesario)
  const saveProfile = async (
    updatedProfile: Profile,
    avatarUpdated: boolean
  ) => {
    setLoading(true);

    try {
      if (updatedProfile.avatar_url && avatarUpdated) {
        const { avatar_url } = updatedProfile;

        const fileExt = avatar_url.split(".").pop();
        const fileName = avatar_url.replace(/^.*[\\\/]/, "");
        const filePath = `${Date.now()}.${fileExt}`;

        const formData = new FormData();
        const photo = {
          uri: avatar_url,
          name: fileName,
          type: `image/${fileExt}`,
        } as unknown as Blob;
        formData.append("file", photo);

        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData);
        if (error) throw error;
        updatedProfile.avatar_url = filePath;
      }

      // Actualizar el perfil en la base de datos
      const { error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", session?.user?.id);

      if (error) {
        throw error;
      } else {
        getProfile(); // Recargar el perfil después de la actualización
      }
    } catch (error: any) {
      Alert.alert("Server Error", error.message);
    }

    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user, profile, loading, saveProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
