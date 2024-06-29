import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Card, Text as PaperText, PaperProvider } from "react-native-paper";
import Entry from "@/components/Entry";
import {
    Calendar,
    CalendarProvider,
    ExpandableCalendar,
} from "react-native-calendars";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DarkTheme } from "@/constants/Colors";

export default function Practice() {
    const [selectedDate, setSelectedDate] = useState<string>(() =>
        new Date().toString()
    );

    const calTheme = {
        backgroundColor: DarkTheme.colors.surface, // Maps to 'surface' from theme data
        calendarBackground: DarkTheme.colors.background, // Maps to 'background' from theme data
        textSectionTitleColor: DarkTheme.colors.outlineVariant, // Maps to 'outlineVariant' from theme data
        selectedDayBackgroundColor: DarkTheme.colors.primary, // Maps to 'primary' from theme data
        selectedDayTextColor: DarkTheme.colors.onPrimary, // Maps to 'onPrimary' from theme data
        todayTextColor: DarkTheme.colors.primary, // Maps to 'primary' from theme data
        dayTextColor: DarkTheme.colors.onBackground, // Maps to 'onBackground' from theme data
        textDisabledColor: DarkTheme.colors.onSurfaceDisabled, // Maps to 'onSurfaceDisabled' from theme data
    };

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
});
