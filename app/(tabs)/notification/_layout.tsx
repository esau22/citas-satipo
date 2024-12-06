import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

const LayoutNotification = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Notificacion",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.primary },

          headerSearchBarOptions: {
            placeholder: "Search",
          },
        }}
      />
    </Stack>
  );
};
export default LayoutNotification;
