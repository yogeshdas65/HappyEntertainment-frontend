import React, { FC, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Button,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import Header from "@components/ui/Header";
import CustomInput from "@components/ui/CustomInput";
import { useRoute, RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import useUpdateProductMutation from "./hooks/useUpdateProductMutation";

interface Product {
  _id: number;
  brand: string;
  name: string;
  coreWeight: string;
  grossWeight: string;
  length: string;
  packagingType: string;
  photo: string;
  price: number;
  productId: number
}

type RootStackParamList = {
  IndividualDetail: { item: Product };
};

const EditProductDetail: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "IndividualDetail">>();
  const { item } = route.params || {};

  const [productDetails, setProductDetails] = useState<Product>({
    _id: item?._id || 0,
    brand: item?.brand || "",
    name: item?.name || "",
    coreWeight: item?.coreWeight || "",
    grossWeight: item?.grossWeight || "",
    length: item?.length || "",
    packagingType: item?.packagingType || "",
    photo: item?.photo || "",
    price: item?.price || 0,
    productId: item ?.productId || 0
  });
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof Product, value: string | number) => {
    setProductDetails((prev) => ({
      ...prev,
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
        setSelectedImage(response.assets[0]);
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
const updateProductMutation = useUpdateProductMutation(successHandler, errorHandler);
  const handleSave = async () => {
    const {
      brand,
      name,
      coreWeight,
      grossWeight,
      length,
      packagingType,
      price,
      productId
    } = productDetails;

    if (
      !brand ||
      !name ||
      !coreWeight ||
      !grossWeight ||
      !length ||
      !packagingType ||
      !price
    ) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const form = new FormData();
    form.append("_id", productDetails._id.toString());
    form.append("brand", brand);
    form.append("name", name);
    form.append("coreWeight", coreWeight);
    form.append("grossWeight", grossWeight);
    form.append("length", length);
    form.append("packagingType", packagingType);
    form.append("price", price.toString());

    if (selectedImage) {
      form.append("file", {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName,
      });
    }

    setLoading(true);

    updateProductMutation.reset()
    updateProductMutation.mutateAsync({ productId, form })
  };

  return (
    <CustomSafeAreaView>
      <Header title={productDetails.name || "Edit Product"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Product Image */}
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleImagePick}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} style={styles.image} />
            ) : (
              <Image
                source={{ uri: productDetails.photo }}
                style={styles.image}
              />
            )}
          </TouchableOpacity>

          {/* Product Details */}
          {[
            { label: "Brand", field: "brand" },
            { label: "Name", field: "name" },
            { label: "Core Weight", field: "coreWeight" },
            { label: "Gross Weight", field: "grossWeight" },
            { label: "Length", field: "length" },
            { label: "Packaging Type", field: "packagingType" },
          ].map(({ label, field }) => (
            <View key={field} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <CustomInput
                placeholder={label}
                value={productDetails[field as keyof Product].toString()}
                onChangeText={(text) =>
                  handleChange(field as keyof Product, text)
                }
                left={undefined}
              />
            </View>
          ))}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price</Text>
            <CustomInput
              placeholder="Price"
              value={productDetails.price.toString()}
              onChangeText={(text) => handleChange("price", parseFloat(text) || 0)}
              keyboardType="numeric" left={undefined}            />
          </View>

          <Button
            title={loading ? "Saving..." : "Save"}
            onPress={handleSave}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  imagePicker: {
    height: 200,
    width: 200,
    marginBottom: 16,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
});

export default EditProductDetail;
