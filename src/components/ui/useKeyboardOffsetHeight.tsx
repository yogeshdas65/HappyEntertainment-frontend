import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export default function useKeyboardOffsetHeight() {
  const [keyboardOffsetHeight, setKeyboardOffsetHeight] = useState(0);

  useEffect(() => {
    const keyboardWillAndroidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardOffsetHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillAndroidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOffsetHeight(0);
      }
    );
    const keyboardWillshowListner = Keyboard.addListener(
      "keyboardWillHide",
      (e) => {
        setKeyboardOffsetHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHideListner = Keyboard.addListener(
      "keyboardWillHide",
      (e) => {
        setKeyboardOffsetHeight(e.endCoordinates.height);
      }
    );
    return () => {
      keyboardWillAndroidShowListener.remove();
      keyboardWillAndroidHideListener.remove();
      keyboardWillshowListner.remove();
      keyboardWillHideListner.remove();
    };
  }, []);

  return keyboardOffsetHeight;
}
