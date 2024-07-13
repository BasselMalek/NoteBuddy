import { View, StyleSheet } from "react-native";
import {
    Card,
    Text as PaperText,
    PaperProvider,
    ActivityIndicator,
    FAB,
} from "react-native-paper";
import { Entry, EntryData } from "@/components/Entry";
import { useEffect, useState, Suspense } from "react";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { Theme as CalendarTheme } from "react-native-calendars/src/types";
import * as SQL from "expo-sqlite";
import { StripCalendar } from "@/components/StripCalendar";

//! PERFORMANCE ON THIS IS ABHORENT. IN NEED OF PRELOADING/CACHING.
//? Try React Queries

interface CRUDInterface {
    db?: SQL.SQLiteDatabase;
    retrieveStatement?: SQL.SQLiteStatement;
    createStatement?: SQL.SQLiteStatement;
    updateStatement?: SQL.SQLiteStatement;
}

let CRUD: CRUDInterface | null = null;

(async () => {
    try {
        const db = await SQL.openDatabaseAsync("PracticeEntries.db");
        CRUD = {
            db,
            retrieveStatement: await db.prepareAsync(
                "SELECT date, title, startTime, endTime, duration, rating, description FROM entries where date= $date"
            ),
            createStatement: await db.prepareAsync(
                "INSERT INTO entries (date, title, startTime, endTime, duration, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)"
            ),
            updateStatement: await db.prepareAsync(
                "UPDATE entries SET title = ?, startTime = ?, endTime = ?, duration = ?, rating = ?, description = ? WHERE date = ?"
            ),
        };
        console.log("connected");
    } catch (error) {
        console.error("Error during database initialization:", error);
    }
})();

export default function Practice() {
    const [selectedDate, setSelectedDate] = useState(new Date());
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
        if (CRUD != null) {
            try {
                (async () => {
                    const rows = await CRUD!.retrieveStatement!.executeAsync({
                        $date: selectedDate.toISOString().slice(0, 10),
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
    }, [selectedDate, CRUD]);

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
            <View style={styles.rootContainer}>
                <Card style={styles.card}>
                    <Card.Content style={{ height: 200 }}>
                        <StripCalendar
                            initialDate={selectedDate}
                            OnDatePressHandler={(day: Date) => {
                                setSelectedDate(day);
                            }}
                        ></StripCalendar>
                    </Card.Content>
                </Card>
                <Card style={styles.expandedCard}>
                    <Card.Content>
                        <>
                            {(loadedEntry === null && (
                                <>
                                    <PaperText>
                                        No entry for today. Add one?
                                    </PaperText>
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
                                            console.log(CRUD?.db);
                                        }}
                                    ></FAB>
                                </>
                            )) ||
                                (loadedEntry != null && (
                                    <Suspense
                                        fallback={
                                            <ActivityIndicator></ActivityIndicator>
                                        }
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
                                                            await CRUD!.createStatement?.executeAsync<{
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
                                                                    .slice(
                                                                        0,
                                                                        19
                                                                    )
                                                                    .replace(
                                                                        "T",
                                                                        " "
                                                                    ),
                                                                loadedEntry.title!,
                                                                loadedEntry
                                                                    .durationFrom!.toISOString()
                                                                    .slice(
                                                                        0,
                                                                        19
                                                                    )
                                                                    .replace(
                                                                        "T",
                                                                        " "
                                                                    ),
                                                                loadedEntry
                                                                    .durationTo!.toISOString()
                                                                    .slice(
                                                                        0,
                                                                        19
                                                                    )
                                                                    .replace(
                                                                        "T",
                                                                        " "
                                                                    ),
                                                                loadedEntry.durationTime!,
                                                                loadedEntry.rating!,
                                                                loadedEntry.desc!
                                                            );
                                                        const res =
                                                            await rows?.getFirstAsync();
                                                        mapResToEntry(res);
                                                    } catch (error) {}
                                                } else if (
                                                    newEntry.toEdit === true
                                                ) {
                                                    try {
                                                        const rows =
                                                            await CRUD!.updateStatement?.executeAsync<{
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
                                                                    .slice(
                                                                        0,
                                                                        19
                                                                    )
                                                                    .replace(
                                                                        "T",
                                                                        " "
                                                                    ),
                                                                loadedEntry
                                                                    .durationTo!.toISOString()
                                                                    .slice(
                                                                        0,
                                                                        19
                                                                    )
                                                                    .replace(
                                                                        "T",
                                                                        " "
                                                                    ),
                                                                loadedEntry.durationTime!,
                                                                loadedEntry.rating!,
                                                                loadedEntry.desc!,
                                                                loadedEntry.date
                                                                    .toISOString()
                                                                    .slice(
                                                                        0,
                                                                        19
                                                                    )
                                                                    .replace(
                                                                        "T",
                                                                        " "
                                                                    )
                                                            );
                                                        const res =
                                                            await rows?.getFirstAsync();
                                                        mapResToEntry(res);
                                                    } catch (error) {}
                                                }
                                            }}
                                            isExpanded={true}
                                        />
                                    </Suspense>
                                ))}
                        </>
                    </Card.Content>
                </Card>
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
        display: "flex",
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
    expandedCard: {
        display: "flex",
        flex: 3,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 34,
    },
});
