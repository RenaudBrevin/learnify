import { Platform } from "react-native";

if (Platform.OS !== "web") {
    require("react-native-url-polyfill/auto");
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pgebtdaqdtnopgjxtxwh.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZWJ0ZGFxZHRub3Bnanh0eHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTYxOTYsImV4cCI6MjA2MDM3MjE5Nn0.CwkY7Hw6S9m6ufuxLvULghdhUMMIZwdc84EkOXdrVM4";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is not defined in environment variables.");
}

const isWeb = Platform.OS === "web";

const customStorage = {
    getItem: async (key: string) => {
        if (isWeb) {
            try {
                const value = global.localStorage?.getItem(key);
                return value;
            } catch (error) {
                return AsyncStorage.getItem(key);
            }
        }
        return AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        if (isWeb) {
            try {
                global.localStorage?.setItem(key, value);
                return;
            } catch (error) {
                return AsyncStorage.setItem(key, value);
            }
        }
        return AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        if (isWeb) {
            try {
                global.localStorage?.removeItem(key);
                return;
            } catch (error) {
                return AsyncStorage.removeItem(key);
            }
        }
        return AsyncStorage.removeItem(key);
    }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: customStorage,
        autoRefreshToken: !isWeb ? true : undefined,
        persistSession: true,
        detectSessionInUrl: isWeb ? true : false,
    },
});