import React, { FC } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";

interface AddButtonProps {
  onPress: () => void;
  edit?: boolean;
}

const AddButton: FC<AddButtonProps> = ({ onPress, edit }) => {
  return (
    <View style={styles.stickyContainer}>
      <TouchableOpacity style={styles.fab} onPress={onPress}>
        <Icon name={edit ? "create" : "add"} size={RFValue(28)} color="white" />{" "}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 1000,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AddButton;
