import { Slot } from "expo-router";
import { NavBar } from "../components/NavBar";
import { StyleSheet, View } from "react-native";
import { supabase } from "../utils/supabase";
import { useEffect } from "react";

export default function RootLayout() {
  let isLogin = false;

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      isLogin = true;
    }
  }

  return (
    <View style={styles.container}>
      <Slot />
      {isLogin && (
        <NavBar />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 60,
  },
});
