import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import React, { FC } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../utils/Constants";

const SearchBar: FC<{
  value: string;
  onChangeText: (text: string) => void;
  onFilter: () => void;
}> = ({ value, onChangeText, onFilter }) => {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.inputContainer}>
        <Icon name="search" size={20} color={Colors.text} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={Colors.grey}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        activeOpacity={0.7}
        onPress={onFilter}
      >
        <Icon name="filter" size={20} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F7",
    borderRadius: 10,
    borderWidth: 0.6,
    borderColor: Colors.border,
    marginTop: 15,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    backgroundColor: Colors.primary, // Replace Colors.primary with your desired color
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
});

export default SearchBar;
