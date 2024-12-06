import { Call, VideoCam } from "@/components/ui/icon";
import { useAuth } from "@/context/authContext";
import {
  fetchMessages,
  getSignedAvatarUrl,
  Message,
  Messages,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { GiftedChat } from "react-native-gifted-chat";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";

const DetailChatPage = () => {
  const {
    contactId: rawdetailId,
    username,
    avatarUrl: rawavatarUrl,
  } = useLocalSearchParams();
  //console.log("Params recibidos:", { rawdetailId, username, avatarUrl });
  //console.log("first", avatarUrl);
  const contactId = Array.isArray(rawdetailId) ? rawdetailId[0] : rawdetailId;
  const avatarUrl = Array.isArray(rawavatarUrl)
    ? rawavatarUrl[0]
    : rawavatarUrl;
  const [messages, setMessages] = useState<Messages>([]);
  const [avatar, setAvatar] = useState<string>("");
  const { profile: user } = useAuth();

  useEffect(() => {
    if (avatarUrl) {
      getSignedAvatarUrl(avatarUrl).then(setAvatar);
    }
  }, [avatarUrl]);

  useEffect(() => {
    if (!user) return;
    fetchMessages(user.id, contactId).then(setMessages);

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${contactId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === user.id) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, contactId]);

  const onSend = useCallback(async (messages = []) => {
    const [message] = messages;
    const { text } = message;

    const { error, data } = await supabase
      .from("messages")
      .insert({
        sender_id: user?.id || "",
        receiver_id: contactId,
        content: text,
      })
      .select("*");
    if (error) {
      Alert.alert("Server Error", error.message);
    } else {
      setMessages((prevMessages) => [data[0], ...prevMessages]);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen
        options={{
          title: "",
          headerBackVisible: true,
          headerTitle: () => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingBottom: 4,
              }}
            >
              <Image
                source={{ uri: avatar || "https://via.placeholder.com/40" }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {username}
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ display: "flex", flexDirection: "row", gap: 15 }}>
              <Pressable>
                <VideoCam />
              </Pressable>
              <Pressable>
                <Call />
              </Pressable>
            </View>
          ),
          headerStyle: {
            backgroundColor: Colors.primary,
          },
        }}
      />
      <GiftedChat
        messages={messages.map((message) => ({
          _id: message?.id,
          text: message?.content,
          createdAt: new Date(message?.created_at),
          user: { _id: message?.sender_id },
        }))}
        onSend={(messages: any) => onSend(messages)}
        user={{
          _id: user?.id || "",
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default DetailChatPage;
