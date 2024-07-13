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
import { StripCalendar } from "@/components/StripCalendar";

export default function Practice() {
    const [dbLoaded, setDbLoaded] = useState(false);
    const CRUD = useRef<{
        db: SQL.SQLiteDatabase;
        retrieveStatement: SQL.SQLiteStatement;
        createStatement: SQL.SQLiteStatement;
        updateStatement: SQL.SQLiteStatement;
    } | null>(null);
    (async () => {
        if (!dbLoaded) {
            try {
                const dbObj = await SQL.openDatabaseAsync("PracticeEntries.db");
                const rtObj = await dbObj.prepareAsync(
                    "SELECT date, title, startTime, endTime, duration, rating, description FROM entries where date= $date"
                );
                // console.log("connected2");
                const ctObj = await dbObj.prepareAsync(
                    "INSERT INTO entries (date, title, startTime, endTime, duration, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)"
                );
                const utObj = await dbObj.prepareAsync(
                    "UPDATE entries SET title = ?, startTime = ?, endTime = ?, duration = ?, rating = ?, description = ? WHERE date = ?"
                );
                CRUD.current = {
                    db: dbObj,
                    retrieveStatement: rtObj,
                    createStatement: ctObj,
                    updateStatement: utObj,
                };
                setDbLoaded(true);
                console.log("connected");
            } catch (error) {
                console.log("tf");
            }
        }
    })();

    const [selectedDate, setSelectedDate] = useState(new Date("2024-07-13"));
    const [loadedEntry, setLoadedEntry] = useState<EntryData | null>(null);

    const mapResToEntry = (
        // res: SQL.SQLiteExecuteAsyncResult<EntryData>
        res: any
    ) => {
        setLoadedEntry({
            date: new Date(res.date),
            title: res.title,
            durationTime: res.duration,
            durationFrom: new Date(`${res.date}T${res.startTime}`),
            durationTo: new Date(`${res.date}T${res.endTime}`),
            rating: res.rating,
            desc: res.description,
            toAdd: false,
        });
    };

    useEffect(() => {
        if (CRUD.current != null) {
            try {
                (async () => {
                    const rows =
                        await CRUD.current!.retrieveStatement.executeAsync({
                            $date: selectedDate
                                .toISOString()
                                .slice(0, 10)
                                .replace("T", " "),
                        });
                    console.log("tried");

                    const res = await rows.getFirstAsync();
                    if (res) {
                        mapResToEntry(res);
                    } else {
                        setLoadedEntry(null);
                    }
                    rows.resetAsync();
                })();
            } catch (e) {
            } finally {
            }
        }
        return () => {};
    }, [selectedDate, CRUD.current]);

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
            {/* <CalendarProvider
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
            </CalendarProvider> */}
            <StripCalendar></StripCalendar>
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
                        <FAB
                            icon={"star"}
                            // style={styles.fab}
                            onPress={() => {
                                console.log(CRUD.current?.db);
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
                                        try {
                                            const rows =
                                                await CRUD.current!.createStatement.executeAsync<{
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
                                                    loadedEntry.title!,
                                                    loadedEntry
                                                        .durationFrom!.toISOString()
                                                        .slice(0, 19)
                                                        .replace("T", " "),
                                                    loadedEntry
                                                        .durationTo!.toISOString()
                                                        .slice(0, 19)
                                                        .replace("T", " "),
                                                    loadedEntry.durationTime!,
                                                    loadedEntry.rating!,
                                                    loadedEntry.desc!
                                                );
                                            const res =
                                                await rows.getFirstAsync();
                                            mapResToEntry(res);
                                        } catch (error) {
                                        } finally {
                                            CRUD.current!.createStatement.finalizeAsync();
                                        }
                                    } else if (newEntry.toEdit === true) {
                                        try {
                                            const rows =
                                                await CRUD.current!.updateStatement.executeAsync<{
                                                    title: string;
                                                    startTime: string;
                                                    endTime: Date;
                                                    duration: Date;
                                                    rating: number;
                                                    description: string;
                                                    date: Date;
                                                }>(
                                                    loadedEntry.title!,
                                                    loadedEntry
                                                        .durationFrom!.toISOString()
                                                        .slice(0, 19)
                                                        .replace("T", " "),
                                                    loadedEntry
                                                        .durationTo!.toISOString()
                                                        .slice(0, 19)
                                                        .replace("T", " "),
                                                    loadedEntry.durationTime!,
                                                    loadedEntry.rating!,
                                                    loadedEntry.desc!,
                                                    loadedEntry.date
                                                        .toISOString()
                                                        .slice(0, 19)
                                                        .replace("T", " ")
                                                );
                                            const res =
                                                await rows.getFirstAsync();
                                            mapResToEntry(res);
                                        } catch (error) {
                                        } finally {
                                            CRUD.current!.updateStatement.finalizeAsync();
                                        }
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
