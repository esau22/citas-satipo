import Colors from "@/constants/Colors";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModal = ({ visible, title, message, onClose }: AlertModalProps) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.containerAlert}>
        <View style={styles.view}>
          <Text style={styles.titles}>{title}</Text>
          <Text style={{ color: Colors.text, marginBottom: 16 }}>
            {message}
          </Text>
          <Pressable
            style={{
              backgroundColor: Colors.button,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={onClose}
          >
            <Text style={{ color: Colors.text, textAlign: "center" }}>
              Cerrar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  containerAlert: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  view: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 10,
    width: 250,
  },
  titles: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 2,
  },
});
