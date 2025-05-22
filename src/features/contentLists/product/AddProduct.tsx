import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import CustomInput from "@components/ui/CustomInput";
import { Colors, Fonts } from "@utils/Constants";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import useAddProductMutation from "./hooks/useAddProductMutation";
import Toast from "react-native-toast-message";

interface FormData {
  brand: string;
  name: string;
  coreWeight: string;
  grossWeight: string;
  length: string;
  packagingType: string;
  price: string;
  file: Asset | null;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    name: "",
    coreWeight: "",
    grossWeight: "",
    length: "",
    packagingType: "",
    price: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (response.didCancel) {
        Alert.alert("Cancelled", "Image selection was cancelled.");
        return;
      }
      if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setFormData((prevData) => ({
          ...prevData,
          file: selectedImage,
        }));
      }
    });
  };

  const successHandler = () => {
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Product Added Successfully!",
      visibilityTime: 3000,
    });
    setFormData({
      brand: "",
      name: "",
      coreWeight: "",
      grossWeight: "",
      length: "",
      packagingType: "",
      price: "",
      file: null,
    });
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: "error",
      text1: "Failed to Add Product",
      text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
    setLoading(false);
  };

  const addProductMutation = useAddProductMutation(successHandler, errorHandler);

  const handleSubmit = async () => {
    const { brand, name, coreWeight, grossWeight, length, packagingType, price, file } = formData;

    if (!brand || !name || !coreWeight || !grossWeight || !length || !packagingType || !price || !file) {
      Alert.alert("Validation Error", "All fields are required, including a photo.");
      return;
    }

    const form = new FormData();
    form.append("brand", brand);
    form.append("name", name);
    form.append("coreWeight", coreWeight);
    form.append("grossWeight", grossWeight);
    form.append("length", length);
    form.append("packagingType", packagingType);
    form.append("price", price);
    form.append("file", {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    });

    setLoading(true);
    addProductMutation.reset()
    addProductMutation.mutateAsync(form);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Product</Text>

      <CustomInput
        left={<Text style={styles.label}>Brand:</Text>}
        placeholder="Enter brand"
        value={formData.brand}
        onChangeText={(value) => handleInputChange("brand", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Name:</Text>}
        placeholder="Enter product name"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Core Weight:</Text>}
        placeholder="Enter core weight"
        value={formData.coreWeight}
        onChangeText={(value) => handleInputChange("coreWeight", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Gross Weight:</Text>}
        placeholder="Enter gross weight"
        value={formData.grossWeight}
        onChangeText={(value) => handleInputChange("grossWeight", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Length:</Text>}
        placeholder="Enter length"
        value={formData.length}
        onChangeText={(value) => handleInputChange("length", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Packaging:</Text>}
        placeholder="Enter packaging type"
        value={formData.packagingType}
        onChangeText={(value) => handleInputChange("packagingType", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Price:</Text>}
        placeholder="Enter price"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(value) => handleInputChange("price", value)}
        style={styles.input}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {formData.file ? (
          <Image source={{ uri: formData.file.uri }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Upload Photo</Text>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Adding Product..." : "Add Product"}
          onPress={handleSubmit}
          color={Colors.primary}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 30,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.Bold,
    marginBottom: 20,
    color: Colors.text,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.Medium,
    color: Colors.text,
    marginRight: 10,
  },
  input: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary,
    width: "100%",
    backgroundColor: Colors.background,
  },
  imagePicker: {
    marginTop: 10,
    height: 150,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageText: {
    color: Colors.primary,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
});

export default AddProduct;
