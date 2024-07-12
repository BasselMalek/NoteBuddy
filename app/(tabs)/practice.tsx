import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import {
    Card,
    Text as PaperText,
    PaperProvider,
    ActivityIndicator,
} from "react-native-paper";
import { Entry, EntryData } from "@/components/Entry";
import { useEffect, useState, Suspense } from "react";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { Theme as CalendarTheme } from "react-native-calendars/src/types";
import * as SQL from "expo-sqlite";

export default function Practice() {
    // const createStatement = await db.prepareAsync(
    //     "INSERT INTO entries (date, title, startTime, endTime, duration, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)"
    // );
    // const updateStatement = await db.prepareAsync(
    //     "UPDATE entries SET title = ?, startTime = ?, endTime = ?, duration = ?, rating = ?, description = ? WHERE date = ?"
    // );
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loadedEntry, setLoadedEntry] = useState<EntryData>(null);
    useEffect(() => {
        try {
            (async () => {
                const db = await SQL.openDatabaseAsync("PracticeEntries.db");
                const retrieveStatment = await db.prepareAsync(
                    "SELECT * FROM entries where date= $date"
                );
                const res = await retrieveStatment.executeAsync({
                    $date: selectedDate
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),
                });
                const spreadRes = await res.getFirstAsync();
                console.log(spreadRes);
                res.resetAsync();

                // if (spreadRes) {
                //     setLoadedEntry({ ...spreadRes });
                // } else {
                //     setLoadedEntry(null);
                // }
            })();
        } catch (e) {}
        return () => {};
    }, [selectedDate]);

    const calTheme: CalendarTheme = {
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
        dotColor: getAdaptaiveTheme().colors.tertiary,
    };

    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
            {/* <Card style={styles.card}> */}
            <CalendarProvider
                style={{ flex: 1, maxHeight: 122 }}
                theme={calTheme}
                date={selectedDate}
            >
                <ExpandableCalendar
                    theme={calTheme}
                    markedDates={{ "2024-07-11": { marked: true } }}
                    disableArrowLeft
                    disableArrowRight
                    maxDate={new Date().toString()}
                    hideArrows
                    disablePan
                    hideKnob
                    onDayPress={(day) => {
                        console.log(day.dateString.slice(0, 10));
                    }}
                ></ExpandableCalendar>
            </CalendarProvider>
            <View style={styles.rootContainer}>
                {/* </Card> */}
                <Suspense fallback={<ActivityIndicator></ActivityIndicator>}>
                    <Entry entryData={loadedEntry} isExpanded={true}></Entry>
                </Suspense>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 7,
    },
    card: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1,
        marginBottom: 5,
    },
});
