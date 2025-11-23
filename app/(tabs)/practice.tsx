import { View } from "react-native";
import { Text, useTheme, FAB, Button, TextInput } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { DisplayEntry } from "@/components/EntryCard";
import React, { useEffect, useState } from "react";
import { EntryData, useEntryCRUD } from "@/hooks/useCRUD";
import { useSQLiteContext } from "expo-sqlite";
import Modal from "react-native-modal";
import RatingSelector from "@/components/RatingSelector";
import DurationPicker from "@/components/DurationPicker";

const currentDay = new Date();

export default function Practice() {
    const { colors } = useTheme();
    const [entries, setEntries] = useState<EntryData[]>([]);
    // const [selected, setSelected] = useState<Date | null>(null);
    const [vis, setVis] = useState(false);
    const db = useSQLiteContext();
    const { getAll, addOrUpdateEntry } = useEntryCRUD(db);
    useEffect(() => {
        (async () => {
            const rows = await getAll();
            rows.reverse();
            setEntries(rows);
        })();
    }, []);

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
                    elevation={5}
                    style={{
                        borderRadius: 24,
                        height: 50,
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
                    // icon={selected ? "trash-can" : "plus"}
                    icon={"plus"}
                    style={{
                        borderRadius: 240,
                        backgroundColor: colors.elevation.level1,
                    }}
                    onPress={() => {
                        setVis(true);
                    }}
                />
            </View>
            <View
                style={{
                    flex: 1,
                }}
            >
                <FlashList
                    fadingEdgeLength={{ start: 40, end: 3 }}
                    maintainVisibleContentPosition={{
                        animateAutoScrollToBottom: true,
                        startRenderingFromBottom: true,
                        autoscrollToBottomThreshold: 10,
                    }}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 10 }} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    data={entries.reverse()}
                    renderItem={({ item }) => (
                        <DisplayEntry
                            entryData={item}
                            // onPress={(date) => {
                            //     setSelected(date === selected ? null : date);
                            // }}
                            // selected={selected === item.date}
                        />
                    )}
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
    const [canSave, setCanSave] = useState(
        title.trim() !== "" && rating > 0 && duration > 59000
    );

    useEffect(() => {
        setCanSave(title.trim() !== "" && rating > 0 && duration > 59000);
    }, [title, duration, rating]);

    const handleSavePress = () => {
        const isTitleValid = title.trim() !== "";
        const isRatingValid = rating > 0;
        const isDurationValid = duration > 0;

        setTitleError(!isTitleValid);
        setRatingError(!isRatingValid);
        setDurationError(!isDurationValid);

        if (isTitleValid && isRatingValid && isDurationValid) {
            const entryData: EntryData = {
                date: new Date(),
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
                justifyContent: "flex-end",
                marginHorizontal: 0,
                marginBottom: 0,
            }}
        >
            <View
                style={{
                    flex: 1,
                    maxHeight: "60%",
                    backgroundColor: colors.background,
                    borderTopLeftRadius: roundness + 10,
                    borderTopRightRadius: roundness + 10,
                    padding: 20,
                    gap: 10,
                }}
            >
                <View
                    style={{
                        width: 40,
                        height: 4,
                        backgroundColor: colors.outline,
                        borderRadius: 2,
                        alignSelf: "center",
                        marginBottom: 10,
                    }}
                />
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
                    style={{ flex: 1 }}
                />
                <Button
                    mode="contained"
                    onPress={handleSavePress}
                    // disabled={!canSave}59000                    style={{ marginTop: 10 }}
                >
                    {"Save"}
                </Button>
            </View>
        </Modal>
    );
};
