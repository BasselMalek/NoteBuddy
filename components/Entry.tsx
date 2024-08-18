import { useState, useEffect, useReducer, Reducer } from "react";
import { View, StyleProp, StyleSheet, ScrollView } from "react-native";
import {
    Text as PaperText,
    FAB,
    TextInput,
    Button as PaperButton,
    useTheme,
    Portal,
    Snackbar,
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

const entryReducer = (
    state: EntryData,
    action: { type: string; payload: any }
) => {
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

const errorReducer = (
    state: {
        title: boolean;
        duration: boolean;
        rating: boolean;
        submit: boolean;
    },
    action: { type: string; payload: any }
) => {
    switch (action.type) {
        case "ERR_ALL":
            return {
                title: action.payload,
                duration: action.payload,
                rating: action.payload,
                submit: action.payload,
            };
        case "ERR_TITLE":
            return { ...state, title: action.payload };
        case "ERR_DURATION":
            return { ...state, duration: action.payload };
        case "ERR_RATING":
            return { ...state, rating: action.payload };
        case "ERR_SUBMIT":
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
    setEditing: Function;
    style?: StyleProp<View>;
    entryData: EntryData;
    onEntryChangeHandler: Function;
}) {
    const activeTheme = useTheme();
    const [editingActive, setEditingActive] = useState(false);
    const [entryErrors, dispatchError] = useReducer(errorReducer, {
        title: false,
        duration: false,
        rating: false,
        submit: false,
    });
    const [entryState, entryDispatch] = useReducer(entryReducer, {}, (arg) => ({
        ...props.entryData,
    }));
    const [editState, editDispatch] = useReducer(entryReducer, {
        ...props.entryData,
        durationFrom: new Date(),
        durationTo: new Date(Date.now() + 900000),
    });

    useEffect(() => {
        entryDispatch({
            type: "UPDATE",
            payload: {
                ...props.entryData,
                durationFrom: new Date(),
                durationTo: new Date(Date.now() + 900000),
            },
        });
        editDispatch({
            type: "UPDATE",
            payload: {
                ...props.entryData,
                durationFrom: new Date(),
                durationTo: new Date(Date.now() + 900000),
            },
        });
        return () => {};
    }, [props]);

    useEffect(() => {
        const val =
            editState.durationTo.getTime() - editState.durationFrom.getTime();
        if (val <= 60000 || val > 86400000) {
            dispatchError({ type: "ERR_DURATION", payload: true });
        } else {
            dispatchError({ type: "ERR_DURATION", payload: false });
            editDispatch({
                type: "SET_DURATION_TIME",
                payload: val,
            });
        }
        return () => {
            dispatchError({ type: "ERR_DURATION", payload: false });
        };
    }, [editState.durationFrom, editState.durationTo]);
    if (editingActive) {
        return (
            <ScrollView>
                <TextInput
                    mode="outlined"
                    error={entryErrors.title}
                    onChangeText={(text) => {
                        if (text.length > 0) {
                            editDispatch({ type: "SET_TITLE", payload: text });
                            dispatchError({
                                type: "ERR_TITLE",
                                payload: false,
                            });
                        } else {
                            dispatchError({ type: "ERR_TITLE", payload: true });
                        }
                    }}
                    label={"Title"}
                ></TextInput>
                <RatingSelector
                    ratingState={
                        editState.rating === undefined ? 0 : editState.rating
                    }
                    ratingHandler={(entryRating: number) => {
                        dispatchError({ type: "ERR_RATING", payload: false });
                        editDispatch({
                            type: "SET_RATING",
                            payload: entryRating,
                        });
                    }}
                    error={entryErrors.rating}
                ></RatingSelector>
                <DurationPicker
                    error={entryErrors.duration}
                    fromValue={editState.durationFrom}
                    fromHandler={(start: any) => {
                        editDispatch({
                            type: "SET_DURATION_FROM",
                            payload: start,
                        });
                    }}
                    toValue={editState.durationTo}
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
                    style={{ marginTop: 10 }}
                    onPress={() => {
                        if (
                            editState.title.length > 0 &&
                            editState.rating > 0 &&
                            !entryErrors.duration
                        ) {
                            props.onEntryChangeHandler(editState);
                            setEditingActive(false);
                            props.setEditing(false);
                        } else {
                            dispatchError({
                                type: "ERR_SUBMIT",
                                payload: true,
                            });
                            dispatchError({
                                type: "ERR_RATING",
                                payload: editState.rating <= 0,
                            });
                            dispatchError({
                                type: "ERR_TITLE",
                                payload: editState.title.length <= 0,
                            });
                        }
                    }}
                >
                    Submit
                </PaperButton>
                <PaperButton
                    onPress={() => {
                        editDispatch({ type: "UPDATE", payload: entryState });
                        dispatchError({ type: "ERR_ALL", payload: false });
                        setEditingActive(false);
                        props.setEditing(false);
                    }}
                >
                    Cancel
                </PaperButton>
                <Portal theme={activeTheme}>
                    <Snackbar
                        style={{ marginBottom: 10 }}
                        duration={5000}
                        action={{
                            label: "Dismiss",
                            onPress: () => {
                                dispatchError({
                                    type: "ERR_SUBMIT",
                                    payload: false,
                                });
                            },
                        }}
                        onDismiss={() => {
                            dispatchError({
                                type: "ERR_SUBMIT",
                                payload: false,
                            });
                        }}
                        visible={entryErrors.submit}
                    >
                        {"Empty or invalid fields."}
                    </Snackbar>
                </Portal>
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
                            props.setEditing(true);
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
