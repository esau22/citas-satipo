import CardChat from "@/components/shared/cardChat";
import { useAuth } from "@/context/authContext";
import { Contact, Contacts, fetchChats } from "@/lib/api";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

const TabsPage = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contacts>([]);
  const { profile } = useAuth();

  const loadChats = useCallback(async () => {
    if (profile) {
      const chats = await fetchChats(profile.id);
      setContacts(chats);
    }
  }, [profile]);

  // Recarga de datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [loadChats])
  );

  const handleContactPress = async (contact: Contact) => {
    // Navega al detalle del contacto
    router.push({
      pathname: "/detail/[contactId]",
      params: {
        contactId: contact.id,
        username: contact.username || "",
        avatarUrl: contact.avatar_url || "",
      },
    });
  };

  return (
    <View>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <FlatList
          data={contacts}
          renderItem={({ item }) => (
            <CardChat contact={item} onPress={() => handleContactPress(item)} />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default TabsPage;
