import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

const LayoutSettings = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Configuracion",
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
export default LayoutSettings;
