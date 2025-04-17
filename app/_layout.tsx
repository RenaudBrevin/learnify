import { Stack } from "expo-router";
import { NavBar } from "../components/NavBar";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 60, // à la place de marginBottom, pour éviter un "trou" sous la navbar
  },
});
