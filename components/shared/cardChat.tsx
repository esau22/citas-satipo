import AppleStyleSwipeableRow from "@/components/shared/AppleStyleSwipeableRow";
import Colors from "@/constants/Colors";
import { Contact, ContactFull, downloadAvatar } from "@/lib/api";
import { useEffect, useState } from "react";
import { View, Text, Image, TouchableHighlight } from "react-native";

interface CardChatProps {
  contact?: Contact;
  onPress?: () => void;
  contactFull?: ContactFull;
}

const CardChat = ({ contact, onPress, contactFull }: CardChatProps) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  //console.log(chat);
  useEffect(() => {
    if (contact?.avatar_url || contactFull?.avatar_url)
      downloadAvatar(contact?.avatar_url || contactFull?.avatar_url).then(
        setAvatarUrl
      );
  }, [contact]);
  //console.log("imge", contact.avatar_url);

  return (
    <AppleStyleSwipeableRow>
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={Colors.icon}
        onPress={onPress}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 20,
            paddingVertical: 12,
            gap: 9,
          }}
        >
          <Image
            source={{
              uri: avatarUrl || contact?.avatar_url || " ",
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 9999,
              backgroundColor: "gray",
            }}
          />
          <View style={{ display: "flex" }}>
            <Text style={{ fontSize: 15, fontWeight: 700 }}>
              {contact?.username || contactFull?.username}
            </Text>
            <Text style={{ color: "gray" }}>{contact?.last_message}</Text>
          </View>
          {contact?.unread_count && contact.unread_count > 0 ? (
            <View
              style={{
                backgroundColor: "blue",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }}>
                {contact?.unread_count}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: "gray" }}>
              Sin notificaciones
            </Text>
          )}
        </View>
      </TouchableHighlight>
    </AppleStyleSwipeableRow>
  );
};

export default CardChat;
