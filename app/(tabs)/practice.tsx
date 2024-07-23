import { View, StyleSheet } from "react-native";
import {
    Card,
    Text as PaperText,
    PaperProvider,
    ActivityIndicator,
    FAB,
} from "react-native-paper";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Entry, EntryData } from "@/components/Entry";
import React, { useEffect, useState, Suspense } from "react";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { Theme as CalendarTheme } from "react-native-calendars/src/types";
import { StripCalendar } from "@/components/StripCalendar";
import { toDateId, Calendar } from "@marceloterreiro/flash-calendar";
import { ExpandableCalendar, CalendarProvider } from "react-native-calendars";
import {
    useQuery,
    useMutation,
    useQueryClient,
    usePrefetchInfiniteQuery,
} from "@tanstack/react-query";
import { mapResToEntry, useCRUDService } from "@/hooks/useCRUD";

const currentDay = new Date();
const fiveBack = new Date(currentDay.getTime() - 5 * 24 * 60 * 60 * 1000);

export default function Practice() {
    const LiveCRUD = useCRUDService("PracticeEntries.db");
    const [selectedDate, setSelectedDate] = useState(currentDay);
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
    usePrefetchInfiniteQuery({
        queryKey: ["entry"],
        queryFn: () => {
            LiveCRUD!.queryRecord(toDateId(fiveBack));
        },
        initialPageParam: fiveBack,
        getNextPageParam: (lastPage: any, pages: any) => {
            const next = new Date();
            next.setDate(lastPage.getDate() + 1);
            return next;
        },
        pages: 5,
    });
    // // useEffect(() => {
    // //     (async () => {
    // //         if (LiveCRUD != null) {
    // //             await queryClient.prefetchInfiniteQuery({});
    // //         }
    // //     })();
    // //     return () => {};
    // // }, []);

    useEffect(() => {
        if (LiveCRUD != null) {
            (async () => {
                const data = await queryClient.fetchQuery({
                    queryKey: ["entry", selectedDate],
                    queryFn: () =>
                        LiveCRUD!.queryRecord(toDateId(selectedDate)),
                });
                setLoadedEntry(mapResToEntry(data, selectedDate));
            })();
            console.log(loadedEntry);
        }
        return () => {};
    }, [selectedDate, LiveCRUD]);

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
            {/* //! Replace with custom component because this one's PERFORMANCE IS
            //! ABHORENT TOO! */}
            <CalendarProvider
                style={{ flex: 1, maxHeight: 120 }}
                theme={calTheme}
                date={selectedDate.toString()}
            >
                <ExpandableCalendar
                    theme={calTheme}
                    disableArrowLeft
                    disableArrowRight
                    maxDate={toDateId(currentDay)}
                    hideArrows
                    disablePan
                    hideKnob
                    onDayPress={(day) => {
                        console.log(day);
                        setSelectedDate(new Date(day.dateString.slice(0, 10)));
                    }}
                    disableAllTouchEventsForDisabledDays
                    disableIntervalMomentum
                    disableAllTouchEventsForInactiveDays
                ></ExpandableCalendar>
            </CalendarProvider>

            <View style={styles.rootContainer}>
                {/* <Card style={styles.calendarCard}>
                    <Card.Content style={{ height: 200, paddingTop: 0 }}>
                        <StripCalendar
                            calendarMonthId={toDateId(selectedDate)}
                            onCalendarDayPress={(day) => {
                                setSelectedDate(new Date(day));
                            }}
                        ></StripCalendar>
                    </Card.Content>
                </Card> */}
                <Card style={styles.expandedCard}>
                    <Card.Content>
                        {/* //TODO: The loading indicator here doesn't work because
                        // loading isn't communicated to app state. Fix that. */}
                        <Entry
                            entryData={loadedEntry!}
                            onEntryChangeHandler={(editedEntry: EntryData) => {
                                entryMutator.mutate(editedEntry, {
                                    onSuccess: async (data) => {
                                        setLoadedEntry(
                                            mapResToEntry(data, selectedDate)
                                        );
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
