import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Card, Text as PaperText, PaperProvider } from "react-native-paper";
import Entry from "@/components/Entry";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAdaptaiveTheme } from "@/constants/Colors";

export default function Practice() {
    const [selectedDate, setSelectedDate] = useState<string>(() =>
        new Date().toString()
    );

    return (
        <PaperProvider>
            <View style={styles.rootContainer}>
                <Entry entryDate={true} isExpanded={true}></Entry>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 5,
    },
    card: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1,
        marginBottom: 5,
    },
});
