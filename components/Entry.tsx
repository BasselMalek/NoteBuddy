import { View, StyleProp, StyleSheet } from "react-native";
import DurationPicker from "@/components/DurationPicker";
import {
    PaperProvider,
    Text as PaperText,
    Card,
    FAB,
    TextInput,
} from "react-native-paper";
import { getAdaptaiveTheme } from "@/constants/Colors";
import { useState, useEffect, useReducer } from "react";
import RatingSelector from "@/components/RatingSelector";

interface EntryData {
    date: Date;
    title: string;
    durationTime: string;
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

function Entry(props: {
    style?: StyleProp<View>;
    entryData: EntryData;
    onEntryChangeHandler: Function;
}) {
    const [editingActive, setEditingActive] = useState(false);
    const [entryState, entryDispatch] = useReducer(entryReducer, {}, (arg) => ({
        ...props.entryData,
    }));

    useEffect(() => {
        entryDispatch({ type: "UPDATE", payload: props.entryData });
        return () => {};
    }, [props]);

    useEffect(() => {
        const m =
            (entryState.durationTo === undefined
                ? new Date().valueOf()
                : entryState.durationTo.valueOf() -
                  (entryState.durationFrom === undefined
                      ? new Date().valueOf()
                      : entryState.durationFrom.valueOf())) /
            1000 /
            60;
        const hr = Math.floor(m / 60);
        entryDispatch({
            type: "SET_DURATION_TIME",
            payload: hr + "hrs " + (m - hr * 60) + "m",
        });
        return () => {};
    }, [entryState.durationFrom, entryState.durationTo]);

    if (editingActive) {
        return (
            <>
                <TextInput
                    mode="outlined"
                    value={entryState.title}
                    onChangeText={(text) => {
                        entryDispatch({ type: "SET_TITLE", payload: text });
                    }}
                    label={"Title"}
                ></TextInput>
                <RatingSelector
                    ratingState={
                        entryState.rating === undefined ? 0 : entryState.rating
                    }
                    ratingHandler={(entryRating: number) => {
                        entryDispatch({
                            type: "SET_RATING",
                            payload: entryRating,
                        });
                    }}
                    starColor={getAdaptaiveTheme().colors.secondary}
                ></RatingSelector>
                <DurationPicker
                    fromValue={
                        entryState.durationFrom === undefined
                            ? new Date()
                            : entryState.durationFrom
                    }
                    fromHandler={(start: any) => {
                        entryDispatch({
                            type: "SET_DURATION_FROM",
                            payload: start,
                        });
                    }}
                    toValue={
                        entryState.durationTo === undefined
                            ? new Date()
                            : entryState.durationTo
                    }
                    toHandler={(end: any) => {
                        entryDispatch({
                            type: "SET_DURATION_TO",
                            payload: end,
                        });
                    }}
                ></DurationPicker>
                <TextInput
                    mode="outlined"
                    value={entryState.desc}
                    label={"Entry"}
                    onChangeText={(text) => {
                        entryDispatch({
                            type: "SET_DESC",
                            payload: text,
                        });
                    }}
                    numberOfLines={100}
                    multiline={true}
                    contentStyle={{ height: 400 }}
                ></TextInput>
                <FAB
                    icon={"check"}
                    onPress={() => {
                        setEditingActive(false);
                        entryDispatch({ type: "SET_SUBMIT", payload: true });
                    }}
                ></FAB>
            </>
        );
    } else {
        console.log(entryState);

        if (props.entryData.submitAction != "add") {
            return (
                <>
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
                                length:
                                    entryState.rating === undefined
                                        ? 0
                                        : entryState.rating,
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
                        {entryState.durationTime}
                    </PaperText>
                    <PaperText style={{ paddingVertical: 30 }}>
                        {entryState.desc}
                    </PaperText>
                    <FAB
                        icon={"check"}
                        onPress={() => {
                            setEditingActive(true);
                        }}
                    ></FAB>
                </>
            );
        } else {
            return (
                <>
                    <PaperText style={{ textAlign: "center" }}>
                        No entry for today. Add one?
                    </PaperText>
                    <FAB
                        style={{
                            position: "absolute",
                            top: 425,
                            right: 0,
                        }}
                        icon={"plus"}
                        onPress={() => {
                            setEditingActive(true);
                        }}
                    ></FAB>
                </>
            );
        }
    }
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        margin: 16,
        right: -15,
        top: 600,
    },
});

export { Entry, EntryData };
