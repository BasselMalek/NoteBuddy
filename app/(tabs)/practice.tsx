import { View, StyleSheet } from "react-native";
import {
    Card,
    Text as PaperText,
    PaperProvider,
    Button,
} from "react-native-paper";
import { Entry, EntryData } from "@/components/Entry";
import React, { useEffect, useState, Suspense } from "react";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mapResToEntry, useCRUDService } from "@/hooks/useCRUD";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const currentDay = new Date();

export default function Practice() {
    const safeInsets = useSafeAreaInsets();
    const LiveCRUD = useCRUDService("PracticeEntries.db");
    const [selectedDate, setSelectedDate] = useState(currentDay);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [loadedEntry, setLoadedEntry] = useState<EntryData>({
        date: currentDay,
        title: "",
        rating: 0,
        desc: "",
        durationFrom: new Date(),
        durationTo: new Date(),
        durationTime: "",
        submit: false,
        submitAction: "add",
    });

    const queryClient = useQueryClient();
    const entryMutator = useMutation(
        {
            mutationFn: (entry: EntryData) => LiveCRUD!.mutateRecord(entry),
        },
        queryClient
    );

    useEffect(() => {
        if (LiveCRUD != null) {
            (async () => {
                const data = await queryClient.fetchQuery({
                    queryKey: ["entry", selectedDate],
                    queryFn: () =>
                        LiveCRUD!.queryRecord(
                            selectedDate.toISOString().slice(0, 10)
                        ),
                });
                setLoadedEntry(mapResToEntry(data, selectedDate));
                setReloadFlag(false);
            })();
        }
        return () => {};
    }, [selectedDate, LiveCRUD, reloadFlag]);

    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
            <View
                style={{
                    flex: 1,
                    paddingTop: safeInsets.top + 5,
                    paddingBottom: safeInsets.bottom,
                    paddingRight: safeInsets.right,
                    paddingLeft: safeInsets.left,
                }}
            >
                <View style={styles.rootContainer}>
                    <Button
                        onPress={() => {
                            setSelectedDate(
                                new Date(
                                    selectedDate.getTime() +
                                        1 * 24 * 3600 * 1000
                                )
                            );
                        }}
                    >
                        {"+1"}
                    </Button>
                    <PaperText style={{ textAlign: "center" }}>
                        {selectedDate.toDateString()}
                    </PaperText>
                    <Button
                        onPress={() => {
                            setSelectedDate(
                                new Date(
                                    selectedDate.getTime() -
                                        1 * 24 * 3600 * 1000
                                )
                            );
                            console.log(selectedDate);
                        }}
                    >
                        {"-1"}
                    </Button>
                    {/* <Button
                    onPress={async () => {
                        const rows = await LiveCRUD!.DEBUG_QUERY_ALL();
                        for (const row of rows) {
                            console.log(row);
                            }
                            }}
                            >
                            {"DEBUGSHOWALLROWS"}
                            </Button> */}
                    <Card style={styles.expandedCard}>
                        <Card.Content>
                            {/* //TODO: The loading indicator here doesn't work because
                        // loading isn't communicated to app state. Fix that. */}
                            <Entry
                                entryData={loadedEntry!}
                                onEntryChangeHandler={(
                                    editedEntry: EntryData
                                ) => {
                                    entryMutator.mutate(editedEntry, {
                                        onSuccess: async (data) => {
                                            if (data === 1) {
                                                setReloadFlag(true);
                                            }
                                        },
                                        onError: (error) => {
                                            console.error(error);
                                        },
                                    });
                                }}
                            />
                        </Card.Content>
                    </Card>
                </View>
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
    calendarCard: {
        display: "flex",
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1,
        marginBottom: 5,
    },
    expandedCard: {
        display: "flex",
        flex: 3,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 34,
    },
});
