import { Colors, Fonts } from "../../utils/Constants";
import { StyleSheet, Text, TextStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface Props {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "h7"
    | "h8"
    | "h9"
    | "body";
  fontFamily?: Fonts;
  fontSize?: number;
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: object) => void;
}

const CustomText: React.FC<Props> = ({
  variant = "body",
  fontFamily = Fonts.Regular,
  fontSize,
  style,
  children,
  numberOfLines,
  onLayout,
  ...props
}) => {
  let computedFontsize: number;
  switch (variant) {
    case "h1":
      computedFontsize = RFValue(fontSize || 22);
      break;
    case "h2":
      computedFontsize = RFValue(fontSize || 20);
      break;
    case "h3":
      computedFontsize = RFValue(fontSize || 18);
      break;
    case "h4":
      computedFontsize = RFValue(fontSize || 16);
      break;
    case "h5":
      computedFontsize = RFValue(fontSize || 14);
      break;
    case "h6":
      computedFontsize = RFValue(fontSize || 12);
      break;
    case "h7":
      computedFontsize = RFValue(fontSize || 12);
      break;
    case "h8":
      computedFontsize = RFValue(fontSize || 10);
      break;
    case "h9":
      computedFontsize = RFValue(fontSize || 9);
      break;
    case "body":
      computedFontsize = RFValue(fontSize || 12);
      break;
  }
  const fontFamilyStyle = {
    fontFamily,
  };
  return (
    <Text
      onLayout={onLayout}
      style={[
        styles.text,
        { color: Colors.text, fontSize: computedFontsize },
        fontFamilyStyle,
        style,
      ]}
      numberOfLines={numberOfLines !== undefined ? numberOfLines : undefined}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "left",
  },
});
export default CustomText;
