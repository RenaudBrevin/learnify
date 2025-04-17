import LogoutButton from "@/components/LogoutButton";
import { View, Text } from "react-native";

const Settings = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings Screen</Text>
            <LogoutButton />
        </View>
    );
};

export default Settings;