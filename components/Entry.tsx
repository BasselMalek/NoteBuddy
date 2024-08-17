import { useState, useEffect, useReducer } from "react";
import { View, StyleProp, StyleSheet, ScrollView } from "react-native";
import {
    Text as PaperText,
    FAB,
    TextInput,
    Button as PaperButton,
    useTheme,
} from "react-native-paper";
import DurationPicker from "@/components/DurationPicker";
import RatingSelector from "@/components/RatingSelector";

interface EntryData {
    date: Date;
    title: string;
    durationTime: number;
    durationFrom: Date;
    durationTo: Date;
    rating: number;
    desc: string;
    submit?: boolean;
    submitAction?: "add" | "update";
}

const entryReducer = (state: any, action: { type: any; payload: any }) => {
    switch (action.type) {
        case "UPDATE":
            return { ...action.payload };
        case "SET_TITLE":
            return { ...state, title: action.payload };
        case "SET_RATING":
            return { ...state, rating: action.payload };
        case "SET_DESC":
            return { ...state, desc: action.payload };
        case "SET_DURATION_FROM":
            return { ...state, durationFrom: action.payload };
        case "SET_DURATION_TO":
            return { ...state, durationTo: action.payload };
        case "SET_DURATION_TIME":
            return { ...state, durationTime: action.payload };
        case "SET_SUBMIT":
            return { ...state, submit: action.payload };
        default:
            return state;
    }
};

const unixIntToString = (unixMS: number) => {
    const m = Math.round(unixMS / 1000 / 60);
    const hr = Math.floor(m / 60);
    return hr + "hrs " + (m - hr * 60) + "m";
};

function Entry(props: {
    style?: StyleProp<View>;
    entryData: EntryData;
    onEntryChangeHandler: Function;
}) {
    const activeTheme = useTheme();
    const [editingActive, setEditingActive] = useState(false);
    const [entryState, entryDispatch] = useReducer(entryReducer, {}, (arg) => ({
        ...props.entryData,
    }));
    const [editState, editDispatch] = useReducer(entryReducer, {}, (arg) => ({
        ...props.entryData,
    }));

    useEffect(() => {
        entryDispatch({ type: "UPDATE", payload: props.entryData });
        editDispatch({ type: "UPDATE", payload: props.entryData });
        return () => {};
    }, [props]);

    useEffect(() => {
        const val =
            editState.durationTo.valueOf() - editState.durationFrom.valueOf();
        editDispatch({
            type: "SET_DURATION_TIME",
            payload: val < 0 ? 24 * 60 * 60 * 1000 + val : val,
        });
        return () => {};
    }, [editState.durationFrom, editState.durationTo]);

    if (editingActive) {
        return (
            <ScrollView>
                <TextInput
                    mode="outlined"
                    value={editState.title}
                    onChangeText={(text) => {
                        editDispatch({ type: "SET_TITLE", payload: text });
                    }}
                    label={"Title"}
                ></TextInput>
                <RatingSelector
                    ratingState={
                        editState.rating === undefined ? 0 : editState.rating
                    }
                    ratingHandler={(entryRating: number) => {
                        editDispatch({
                            type: "SET_RATING",
                            payload: entryRating,
                        });
                    }}
                    starColor={activeTheme.colors.secondary}
                ></RatingSelector>
                <DurationPicker
                    fromValue={
                        editState.durationFrom === undefined
                            ? new Date(editState.date)
                            : editState.durationFrom
                    }
                    fromHandler={(start: any) => {
                        editDispatch({
                            type: "SET_DURATION_FROM",
                            payload: start,
                        });
                    }}
                    toValue={
                        editState.durationTo === undefined
                            ? new Date(editState.date)
                            : editState.durationTo
                    }
                    toHandler={(end: any) => {
                        editDispatch({
                            type: "SET_DURATION_TO",
                            payload: end,
                        });
                    }}
                ></DurationPicker>
                <TextInput
                    mode="outlined"
                    value={editState.desc}
                    label={"Entry"}
                    onChangeText={(text) => {
                        editDispatch({
                            type: "SET_DESC",
                            payload: text,
                        });
                    }}
                    numberOfLines={100}
                    multiline={true}
                    contentStyle={{ height: 350 }}
                ></TextInput>
                <PaperButton
                    // icon={"check"}
                    style={{ marginTop: 10 }}
                    onPress={() => {
                        props.onEntryChangeHandler(editState);
                        setEditingActive(false);
                    }}
                >
                    Submit
                </PaperButton>
                <PaperButton
                    onPress={() => {
                        editDispatch({ type: "UPDATE", payload: entryState });
                        setEditingActive(false);
                    }}
                >
                    Cancel
                </PaperButton>
            </ScrollView>
        );
    } else {
        if (props.entryData.submitAction != "add") {
            return (
                <View style={{ height: "100%" }}>
                    <PaperText
                        variant="titleLarge"
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        {entryState.title}
                    </PaperText>
                    <PaperText
                        style={{
                            fontWeight: "thin",
                            fontStyle: "italic",
                            fontSize: 16,
                        }}
                    >
                        {Array.from(
                            {
                                length: entryState.rating,
                            },
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
                        {unixIntToString(entryState.durationTime)}
                    </PaperText>
                    <PaperText style={{ paddingVertical: 30 }}>
                        {entryState.desc}
                    </PaperText>
                </View>
            );
        } else {
            return (
                <View style={{ height: "100%" }}>
                    <PaperText style={{ textAlign: "center" }}>
                        No entry for today.
                    </PaperText>
                    <FAB
                        disabled={
                            !(
                                props.entryData.date.toDateString() ===
                                new Date().toDateString()
                            )
                        }
                        style={styles.fab}
                        icon={"plus"}
                        onPress={() => {
                            editDispatch({ type: "SET_SUBMIT", payload: true });
                            setEditingActive(true);
                        }}
                    ></FAB>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: -10,
        right: -15,
    },
});

export { Entry, EntryData, unixIntToString };
