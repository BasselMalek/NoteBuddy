import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Card, Text as PaperText, PaperProvider } from "react-native-paper";
import Entry from "@/components/Entry";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAdaptaiveTheme } from "@/constants/Colors";
import {
    Calendar,
    CalendarProps,
    CalendarProvider,
    CalendarUtils,
    ExpandableCalendar,
} from "react-native-calendars";
import { Theme } from "react-native-calendars/src/types";

export default function Practice() {
    const [selectedDate, setSelectedDate] = useState<string>(() =>
        new Date().toString()
    );
    const calTheme: Theme = {
        backgroundColor: getAdaptaiveTheme().colors.surface, // Maps to 'surface' from theme data
        calendarBackground: getAdaptaiveTheme().colors.surfaceVariant, // Maps to 'background' from theme data
        textSectionTitleColor: getAdaptaiveTheme().colors.onSurfaceVariant, // Maps to 'outlineVariant' from theme data
        selectedDayBackgroundColor: getAdaptaiveTheme().colors.secondary, // Maps to 'primary' from theme data
        // : getAdaptaiveTheme().colors.onSurfaceVariant,
        monthTextColor: getAdaptaiveTheme().colors.onSurfaceVariant,
        selectedDayTextColor: getAdaptaiveTheme().colors.onSecondary, // Maps to 'onPrimary' from theme data
        todayTextColor: getAdaptaiveTheme().colors.primary, // Maps to 'primary' from theme data
        dayTextColor: getAdaptaiveTheme().colors.onSurfaceVariant, // Maps to 'onBackground' from theme data
        textDisabledColor: getAdaptaiveTheme().colors.onSurfaceDisabled, // Maps to 'onSurfaceDisabled' from theme data
    };

    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
            {/* <Card style={styles.card}> */}
            <CalendarProvider
                style={{ flex: 1, maxHeight: 130 }}
                theme={calTheme}
                date={new Date().toString()}
            >
                <ExpandableCalendar
                    theme={calTheme}
                    disableArrowLeft
                    disableArrowRight
                    hideArrows
                    disablePan
                    hideKnob
                ></ExpandableCalendar>
            </CalendarProvider>
            <View style={styles.rootContainer}>
                {/* </Card> */}
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
