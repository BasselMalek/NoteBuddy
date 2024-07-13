import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import {
    Card,
    Text as PaperText,
    PaperProvider,
    ActivityIndicator,
    FAB,
} from "react-native-paper";
import { Entry, EntryData } from "@/components/Entry";
import { useEffect, useState, Suspense, useRef } from "react";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { Theme as CalendarTheme } from "react-native-calendars/src/types";
import * as SQL from "expo-sqlite";

export default function Practice() {
    const db = useRef<SQL.SQLiteDatabase | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loadedEntry, setLoadedEntry] = useState<EntryData | null>(null);
    useEffect(() => {
        try {
            (async () => {
                const conn = await SQL.openDatabaseAsync("PracticeEntries.db");
                db.current = conn;
                const retrieveStatment = await db.current.prepareAsync(
                    "SELECT date, title, startTime, endTime, duration, rating, description FROM entries where date= $date"
                );
                const res = await retrieveStatment.executeAsync({
                    $date: selectedDate
                        .toISOString()
                        .slice(0, 10)
                        .replace("T", " "),
                });
                const spreadRes = await res.getFirstAsync();

                console.log(spreadRes);
                if (spreadRes) {
                    setLoadedEntry({
                        date: new Date(spreadRes.date),
                        title: spreadRes.title,
                        durationTime: spreadRes.duration,
                        durationFrom: new Date(
                            `${spreadRes.date}T${spreadRes.startTime}`
                        ),
                        durationTo: new Date(
                            `${spreadRes.date}T${spreadRes.endTime}`
                        ),
                        rating: spreadRes.rating,
                        desc: spreadRes.description,
                        toAdd: false,
                    });
                } else {
                    setLoadedEntry(null);
                }
                console.log("this is " + loadedEntry?.desc);

                res.resetAsync();
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
                date={selectedDate.toString()}
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
                        setSelectedDate(new Date(day.dateString.slice(0, 10)));
                    }}
                ></ExpandableCalendar>
            </CalendarProvider>
            <View style={styles.rootContainer}>
                {(loadedEntry === null && (
                    <>
                        <PaperText>No entry for today. Add one?</PaperText>
                        <FAB
                            icon={"plus"}
                            // style={styles.fab}
                            onPress={() => {
                                setLoadedEntry({
                                    date: selectedDate,
                                    toAdd: true,
                                });
                            }}
                        ></FAB>
                    </>
                )) ||
                    (loadedEntry != null && (
                        <Suspense
                            fallback={<ActivityIndicator></ActivityIndicator>}
                        >
                            <Entry
                                entryData={loadedEntry}
                                onEntryChangeHandler={async (
                                    newEntry: EntryData
                                ) => {
                                    setLoadedEntry(newEntry);
                                    if (newEntry.toAdd) {
                                        const createStatement =
                                            await db.current.prepareAsync(
                                                "INSERT INTO entries (date, title, startTime, endTime, duration, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)"
                                            );
                                        const rows =
                                            await createStatement.executeAsync<{
                                                date: Date;
                                                title: string;
                                                startTime: string;
                                                endTime: Date;
                                                duration: Date;
                                                rating: number;
                                                description: string;
                                            }>(
                                                loadedEntry.date
                                                    .toISOString()
                                                    .slice(0, 19)
                                                    .replace("T", " "),
                                                loadedEntry.title,
                                                loadedEntry.durationFrom
                                                    .toISOString()
                                                    .slice(0, 19)
                                                    .replace("T", " "),
                                                loadedEntry.durationTo
                                                    .toISOString()
                                                    .slice(0, 19)
                                                    .replace("T", " "),
                                                loadedEntry.durationTime,
                                                loadedEntry.rating,
                                                loadedEntry.desc
                                            );
                                        const res = await rows.getFirstAsync();
                                        setLoadedEntry({
                                            ...res,
                                            toAdd: false,
                                        });
                                    } else if (newEntry.toEdit === true) {
                                        const updateStatement =
                                            await db.current.prepareAsync(
                                                "UPDATE entries SET title = ?, startTime = ?, endTime = ?, duration = ?, rating = ?, description = ? WHERE date = ?"
                                            );
                                        const rows =
                                            await updateStatement.executeAsync<{
                                                title: string;
                                                startTime: string;
                                                endTime: Date;
                                                duration: Date;
                                                rating: number;
                                                description: string;
                                                date: Date;
                                            }>(
                                                loadedEntry.title,
                                                loadedEntry.durationFrom
                                                    .toISOString()
                                                    .slice(0, 19)
                                                    .replace("T", " "),
                                                loadedEntry.durationTo
                                                    .toISOString()
                                                    .slice(0, 19)
                                                    .replace("T", " "),
                                                loadedEntry.durationTime,
                                                loadedEntry.rating,
                                                loadedEntry.desc,
                                                loadedEntry.date
                                                    .toISOString()
                                                    .slice(0, 19)
                                                    .replace("T", " ")
                                            );
                                        const res = await rows.getFirstAsync();
                                        setLoadedEntry({
                                            ...res,
                                            toAdd: false,
                                        });
                                    }
                                }}
                                isExpanded={true}
                            ></Entry>
                        </Suspense>
                    ))}
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
    fab: {
        position: "absolute",
        margin: 16,
        right: -15,
    },
});
