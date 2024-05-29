import { View, Text, Button, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function index() {
    return (
        <View>
            <StatusBar style={"dark"}></StatusBar>
            <Text>HI!</Text>
        </View>
    );
}
