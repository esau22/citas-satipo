import {
  Camera,
  Chats,
  Reload,
  Settings,
  Notification,
  AddCircle,
} from "@/components/ui/icon";
import Colors from "@/constants/Colors";
import { Link, Tabs, useSegments } from "expo-router";
import { Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TabsLayout = () => {
  const segments = useSegments();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.icon,
            height: 70,
            justifyContent: "center",
          },
          tabBarInactiveBackgroundColor: Colors.primary,
          tabBarActiveBackgroundColor: Colors.primary,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Chats",
            tabBarIcon: () => <Chats />,
            headerShown: true,
            tabBarStyle: {
              height: 70,
              justifyContent: "center",
              backgroundColor: Colors.icon,
              display: segments[1] === "[contactId]" ? "none" : "flex",
            },
            headerRight: () => (
              <View style={{ flexDirection: "row", marginRight: 15, gap: 12 }}>
                <Pressable>
                  <Camera />
                </Pressable>
                <Link href={"/(contact)/contact"} asChild>
                  <Pressable>
                    <AddCircle />
                  </Pressable>
                </Link>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: "Novedades",
            tabBarIcon: () => <Reload />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: "Notificacion",
            tabBarIcon: () => <Notification />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Configuracion",
            tabBarIcon: () => <Settings />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default TabsLayout;
