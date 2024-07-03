import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Text, ViewBase, StyleProp, StyleSheet } from "react-native";
import DurationPicker from "@/components/DurationPicker";
import {
    PaperProvider,
    useTheme,
    Text as PaperText,
    Card,
    FAB,
    TextInput,
} from "react-native-paper";
import { DarkTheme } from "@/constants/Colors";
import { useState, useEffect } from "react";
import RatingSelector from "@/components/RatingSelector";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function Entry(props: {
    isExpanded: boolean;
    style?: StyleProp<View>;
    entryDate: boolean;
}) {
    const [editingActive, setEditingActive] = useState(false);

    const [entryTitle, setEntryTitle] = useState("Today's Entry");
    const [entryRating, setEntryRating] = useState(2);
    const [entryDesc, setEntryDesc] = useState("");

    const [durationFrom, setDurationFrom] = useState(new Date());
    const [durationTo, setDurationTo] = useState(new Date());
    const [entryDuration, setEntryDuration] = useState("0hrs 0m");

    useEffect(() => {
        const m = (durationTo.valueOf() - durationFrom.valueOf()) / 1000 / 60;
        const hr = Math.floor(m / 60);
        setEntryDuration(hr + "hrs " + (m - hr * 60) + "m");
        return () => {};
    }, [durationFrom, durationTo]);

    if (props.entryDate) {
        return (
            <PaperProvider theme={DarkTheme}>
                <Card style={styles.expandedCard}>
                    {(editingActive && (
                        <>
                            <TextInput
                                mode="outlined"
                                value={entryTitle}
                                onChangeText={(text) => {
                                    setEntryTitle(text);
                                }}
                                label={"Title"}
                            ></TextInput>
                            {/* <PaperText
                                variant="titleSmall"
                                style={{
                                    fontWeight: "thin",
                                    fontStyle: "italic",
                                    color: DarkTheme.colors
                                        .onSecondaryContainer,
                                }}
                            >
                                Difficulty
                            </PaperText> */}
                            <RatingSelector
                                ratingState={entryRating}
                                ratingHandler={(entryRating: number) => {
                                    setEntryRating(entryRating);
                                }}
                                starColor={DarkTheme.colors.secondary}
                            ></RatingSelector>
                            {/* <PaperText
                                variant="titleSmall"
                                style={{
                                    fontWeight: "thin",
                                    fontStyle: "italic",
                                    color: DarkTheme.colors
                                        .onSecondaryContainer,
                                }}
                            >
                                Duration
                            </PaperText> */}

                            <DurationPicker
                                fromValue={durationFrom}
                                fromHandler={(start: any) => {
                                    setDurationFrom(start);
                                }}
                                toValue={durationTo}
                                toHandler={(end: any) => {
                                    setDurationTo(end);
                                }}
                            ></DurationPicker>
                            <TextInput
                                mode="outlined"
                                value={entryDesc}
                                label={"Entry"}
                                onChangeText={(text) => {
                                    setEntryDesc(text);
                                }}
                                numberOfLines={100}
                                multiline={true}
                                contentStyle={{ height: 400 }}
                            ></TextInput>
                        </>
                    )) ||
                        (!editingActive && (
                            <>
                                <PaperText
                                    variant="titleLarge"
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    {entryTitle}
                                </PaperText>
                                <PaperText
                                    style={{
                                        fontWeight: "thin",
                                        fontStyle: "italic",
                                        fontSize: 16,
                                    }}
                                >
                                    {Array.from(
                                        { length: entryRating },
                                        (i, k) => k
                                    ).map((i, k) => "★")}
                                </PaperText>
                                <PaperText
                                    variant="titleSmall"
                                    style={{
                                        fontWeight: "thin",
                                        fontStyle: "italic",
                                    }}
                                >
                                    {entryDuration}
                                </PaperText>
                                <PaperText style={{ paddingVertical: 30 }}>
                                    {entryDesc}
                                </PaperText>
                            </>
                        ))}
                    <FAB
                        icon={editingActive ? "check" : "pencil"}
                        style={styles.fab}
                        onPress={() => {
                            setEditingActive(!editingActive);
                        }}
                    ></FAB>
                </Card>
            </PaperProvider>
        );
    } else {
        return (
            <PaperProvider theme={DarkTheme}>
                <Card style={styles.expandedCard}>
                    <PaperText>No entry for today.</PaperText>
                    <FAB
                        icon={"plus"}
                        style={styles.fab}
                        onPress={() => {
                            setEditingActive(true);
                        }}
                    ></FAB>
                </Card>
            </PaperProvider>
        );
    }
}

const styles = StyleSheet.create({
    expandedCard: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 34,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: -15,
        top: 600,
    },
});
