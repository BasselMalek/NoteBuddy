import { View, StyleSheet } from "react-native";
import {
    Card,
    Text as PaperText,
    PaperProvider,
    Button,
    useTheme,
} from "react-native-paper";
import { Entry, EntryData } from "@/components/Entry";
import React, { useEffect, useState, Suspense } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mapResToEntry, useCRUDService } from "@/hooks/useCRUD";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const currentDay = new Date();

export default function Practice() {
    const safeInsets = useSafeAreaInsets();
    const activeTheme = useTheme();
    const LiveCRUD = useCRUDService();
    const [selectedDate, setSelectedDate] = useState(currentDay);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [active, setActive] = useState(false);
    const [loadedEntry, setLoadedEntry] = useState<EntryData>({
        date: currentDay,
        title: "",
        rating: 0,
        desc: "",
        durationFrom: new Date(),
        durationTo: new Date(),
        durationTime: 0,
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
                <View
                    style={{
                        margin: 20,
                        flexDirection: "row",
                        alignSelf: "center",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        gap: 10,
                    }}
                >
                    <Button
                        disabled={active}
                        compact
                        style={{
                            borderRadius: 12,
                            width: 50,
                        }}
                        mode="elevated"
                        onPress={() => {
                            setSelectedDate(
                                new Date(
                                    selectedDate.getTime() -
                                        1 * 24 * 3600 * 1000
                                )
                            );
                        }}
                    >
                        {"<"}
                    </Button>
                    {
                        //TODO: make pressable to open a date selector.
                    }
                    <View
                        style={{
                            backgroundColor:
                                activeTheme.colors.elevation.level1,
                            elevation: 5,
                            borderRadius: 12,
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <PaperText
                            style={{
                                textAlign: "center",
                            }}
                        >
                            {selectedDate.toDateString()}
                        </PaperText>
                    </View>
                    <Button
                        compact
                        disabled={
                            selectedDate.toDateString() ===
                                currentDay.toDateString() || active
                        }
                        style={{
                            borderRadius: 12,
                            width: 50,
                        }}
                        mode="elevated"
                        onPress={() => {
                            setSelectedDate(
                                new Date(
                                    selectedDate.getTime() +
                                        1 * 24 * 3600 * 1000
                                )
                            );
                        }}
                    >
                        {">"}
                    </Button>
                </View>
                <Card style={styles.expandedCard}>
                    <Card.Content>
                        <Entry
                            setEditing={(isEditing: boolean) => {
                                setActive(isEditing);
                            }}
                            entryData={loadedEntry!}
                            onEntryChangeHandler={(editedEntry: EntryData) => {
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
