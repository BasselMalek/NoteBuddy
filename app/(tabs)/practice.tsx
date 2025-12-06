import { KeyboardAvoidingView, View } from "react-native";
import { Text, useTheme, FAB, Button, TextInput } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { DisplayEntry } from "@/components/EntryCard";
import React, { useEffect, useState } from "react";
import { EntryData, useEntryCRUD } from "@/hooks/useCRUD";
import { useSQLiteContext } from "expo-sqlite";
import Modal from "react-native-modal";
import RatingSelector from "@/components/RatingSelector";
import DurationPicker from "@/components/DurationPicker";

const generateDummyEntries = async (
    addOrUpdateEntry: (data: EntryData) => Promise<number>
) => {
    const titles = [
        "Morning Workout",
        "Yoga Session",
        "Running",
        "Strength Training",
        "Swimming",
        "Cycling",
        "Hiking",
        "HIIT Workout",
        "Pilates",
        "Dance Class",
        "Boxing",
        "Rock Climbing",
        "Tennis",
        "Basketball",
        "Soccer Practice",
    ];

    const descriptions = [
        "Felt great today, good energy throughout",
        "Challenging but rewarding session",
        "Struggled a bit but pushed through",
        "New personal best!",
        "Easy recovery day",
        "Tough workout but completed it",
        "Weather was perfect for this",
        "Need to work on form",
        "Excellent progress today",
        "Feeling stronger each day",
    ];

    const today = new Date();
    const results = [];

    // Start from oldest (today-31) and go to newest (today-1)
    // This ensures streaks are calculated correctly in chronological order
    for (let i = 31; i >= 1; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const entry = {
            date: date,
            title: date.toLocaleDateString(),
            rating: Math.floor(Math.random() * 5) + 1, // 1-5
            duration: (Math.floor(Math.random() * 90) + 30) * 60 * 1000, // 30-120 minutes
            desc: descriptions[Math.floor(Math.random() * descriptions.length)],
            streak: 0, // Will be calculated by the function
        };

        try {
            const result = await addOrUpdateEntry(entry);
            results.push({ date: entry.date, success: result !== null });
            console.log(`Added entry for ${entry.date.toDateString()}`);
        } catch (error) {
            console.error(
                `Failed to add entry for ${entry.date.toDateString()}:`,
                error
            );
            results.push({ date: entry.date, success: false });
        }
    }

    console.log(
        `Generated ${results.filter((r) => r.success).length} out of 30 entries`
    );
    return results;
};

const currentDay = new Date();

export default function Practice() {
    const { colors } = useTheme();
    const [entries, setEntries] = useState<EntryData[]>([]);
    const [canAdd, setCanAdd] = useState(false);
    const [vis, setVis] = useState(false);
    const db = useSQLiteContext();
    const { getAll, addOrUpdateEntry } = useEntryCRUD(db);
    useEffect(() => {
        (async () => {
            const rows = await getAll();
            setEntries(rows);
        })();
    }, [getAll]);

    useEffect(() => {
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        setCanAdd(
            entries.flatMap((v) => v.date.getTime()).includes(today.getTime())
        );
    }, [entries]);

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column-reverse",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                }}
            >
                <Button
                    icon={"calendar"}
                    mode="elevated"
                    compact
                    elevation={5}
                    contentStyle={{
                        // elevation: 5,
                        borderRadius: 24,
                        height: 50,
                        paddingHorizontal: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {currentDay.toDateString()}
                </Button>
                <AddModal
                    setVis={setVis}
                    modalVisible={vis}
                    handleSave={(data) => {
                        setEntries([...entries, data]);
                        addOrUpdateEntry(data);
                    }}
                />
                <FAB
                    color={colors.primary}
                    customSize={48}
                    icon={"plus"}
                    disabled={canAdd}
                    style={{
                        borderRadius: 240,
                        backgroundColor: colors.elevation.level1,
                    }}
                    onPress={() => {
                        setVis(true);
                    }}
                    onLongPress={() => generateDummyEntries(addOrUpdateEntry)}
                />
            </View>
            <View
                style={{
                    flex: 1,
                }}
            >
                <FlashList
                    fadingEdgeLength={{ start: 40, end: 3 }}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 10 }} />
                    )}
                    maintainVisibleContentPosition={{ disabled: true }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    initialScrollIndex={entries.length - 1}
                    data={entries}
                    // (a, b) => b.date.getTime() - a.date.getTime()}
                    renderItem={({ item }) => <DisplayEntry entryData={item} />}
                />
            </View>
        </View>
    );
}

const AddModal = (props: {
    setVis: (bool: boolean) => void;
    modalVisible: boolean;
    handleSave: (data: EntryData) => void;
}) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [rating, setRating] = useState(0);
    const [duration, setDuration] = useState(0);
    const [titleError, setTitleError] = useState(false);
    const [ratingError, setRatingError] = useState(false);
    const [durationError, setDurationError] = useState(false);
    const { colors, roundness } = useTheme();
    const { setVis, modalVisible, handleSave } = props;

    const handleSavePress = () => {
        const isTitleValid = title.trim() !== "";
        const isRatingValid = rating > 0;
        const isDurationValid = duration > 0;
        setTitleError(!isTitleValid);
        setRatingError(!isRatingValid);
        setDurationError(!isDurationValid);
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        if (isTitleValid && isRatingValid && isDurationValid) {
            const entryData: EntryData = {
                date: today,
                title: title.trim(),
                desc: desc.trim(),
                rating,
                duration,
                streak: 0,
            };
            handleSave(entryData);
            setTitle("");
            setDesc("");
            setRating(0);
            setDuration(0);
            setTitleError(false);
            setRatingError(false);
            setDurationError(false);
            setVis(false);
        }
    };

    return (
        <Modal
            useNativeDriver={false}
            useNativeDriverForBackdrop={false}
            onBackdropPress={() => setVis(false)}
            onBackButtonPress={() => setVis(false)}
            isVisible={modalVisible}
            style={{
                flex: 1,
                // justifyContent: "flex-end",
                // marginHorizontal: 0,
                // marginBottom: 0,
            }}
        >
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={75}
                style={{
                    backgroundColor: colors.background,
                    borderRadius: roundness + 10,
                    padding: 20,
                    paddingBottom: 0,
                    gap: 10,
                }}
            >
                {/* <View
                    style={{
                        width: 40,
                        height: 4,
                        backgroundColor: colors.outline,
                        borderRadius: 2,
                        alignSelf: "center",
                        marginBottom: 10,
                    }}
                /> */}
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={(text) => {
                        setTitle(text);
                        if (titleError) setTitleError(false);
                    }}
                    error={titleError}
                    mode="outlined"
                />
                <View>
                    <Text variant="labelLarge">{"Rating"}</Text>
                    <RatingSelector
                        ratingState={rating}
                        ratingHandler={(rating) => {
                            setRatingError(false);
                            setRating(rating);
                        }}
                        error={ratingError}
                    />
                </View>
                <View>
                    <Text variant="labelLarge" style={{ marginBottom: 10 }}>
                        {"Duration"}
                    </Text>
                    <DurationPicker
                        from={new Date()}
                        setDuration={(ms: number) => {
                            setDuration(ms);
                            if (durationError) setDurationError(false);
                        }}
                        error={durationError}
                    />
                </View>
                <TextInput
                    label="Description"
                    value={desc}
                    onChangeText={setDesc}
                    mode="outlined"
                    multiline
                    numberOfLines={5}
                    style={{ minHeight: "20%" }}
                />
                <Button
                    mode="contained"
                    onPress={handleSavePress}
                    style={{ marginBottom: 20 }}
                >
                    {"Save"}
                </Button>
            </KeyboardAvoidingView>
        </Modal>
    );
};
