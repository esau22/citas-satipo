import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

const LayoutNews = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Novedades",
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
export default LayoutNews;
