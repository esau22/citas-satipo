import Colors from "@/constants/Colors";
import React, { ReactNode, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";

interface SelectProps {
  children: ReactNode;
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const Select = ({
  children,
  value,
  placeholder,
  onValueChange,
  options,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {children}
      <Pressable style={styles.selectBox} onPress={() => setModalVisible(true)}>
        <Text
          style={[
            styles.text,
            value ? styles.valueText : styles.placeholderText,
          ]}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder || "Selecciona una opción"}
        </Text>
      </Pressable>

      {/* Modal para mostrar las opciones */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: Colors.input,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginVertical: 8,
  },
  selectBox: {
    borderRadius: 10,
    padding: 10,
  },
  text: {
    fontSize: 20,
  },
  placeholderText: {
    color: "gray",
  },
  valueText: {
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "black",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
