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
    }, []);

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
