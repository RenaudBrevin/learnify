import { Slot } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavBar } from "../components/NavBar";
import { supabase } from "../utils/supabase";

export default function RootLayout() {
  const [isLogin, setIsLogin] = useState(false);

  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    setIsLogin(session?.user ? true : false);
  });

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
