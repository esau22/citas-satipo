import Colors from "@/constants/Colors";
import { Image, View } from "react-native";

interface AvatarProps {
  uri: string | null | undefined;
  size?: number;
}

export default function Avatar({ uri, size = 32 }: AvatarProps) {
  const styles = {
    height: size,
    width: size,
    borderRadius: size / 2,
    backgroundColor: Colors.button,
  };
  if (uri) return <Image source={{ uri }} style={styles} />;
  return <View style={styles} />;
}
