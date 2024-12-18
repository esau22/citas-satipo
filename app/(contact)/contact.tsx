import CardChat from "@/components/shared/cardChat";
import { useAuth } from "@/context/authContext";
import { ContactFull, ContactFulls, fetchContacts } from "@/lib/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ContactPage = () => {
  const router = useRouter();
  const [contactFulls, setContactFulls] = useState<ContactFulls>([]);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile && profile.gender) {
      fetchContacts(profile.id, profile.gender).then(setContactFulls);
    }
  }, [profile]);

  const handleContactPress = (contactFull: ContactFull) => {
    router.push({
      pathname: "/detail/[contactId]",
      params: {
        contactId: contactFull.id,
        username: contactFull.username || "",
        avatarUrl: contactFull.avatar_url || "",
      },
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={contactFulls}
        renderItem={({ item }) => (
          <CardChat
            contactFull={item}
            onPress={() => handleContactPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </GestureHandlerRootView>
  );
};

export default ContactPage;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    marginTop: 64,
    paddingBottom: 8,
  },
});
