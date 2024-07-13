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
import { useState, useEffect } from "react";
import RatingSelector from "@/components/RatingSelector";

interface EntryData {
    date: Date;
    title?: string;
    durationTime?: string;
    durationFrom?: Date;
    durationTo?: Date;
    rating?: number;
    desc?: string;
    toAdd: boolean;
    toEdit?: boolean;
}

function Entry(props: {
    isExpanded: boolean;
    style?: StyleProp<View>;
    entryData: EntryData;
    onEntryChangeHandler: Function;
}) {
    const [editingActive, setEditingActive] = useState(props.entryData.toAdd);
    const [editingExistent, setEditingExistent] = useState(
        !(props.entryData.title === undefined)
    );

    const [activeEntryData, setActiveEntryData] = useState({
        title: props.entryData?.title,
        rating: props.entryData?.rating,
        desc: props.entryData?.desc,
        durationFrom: props.entryData.durationFrom,
        durationTo: props.entryData.durationTo,
        durationTime: props.entryData.durationTime,
    });

    const setEntryTitle = (title: string) => {
        setActiveEntryData((prevState) => ({
            ...prevState,
            title,
        }));
    };

    const setEntryRating = (rating: number) => {
        setActiveEntryData((prevState) => ({
            ...prevState,
            rating,
        }));
    };

    const setEntryDesc = (desc: string) => {
        setActiveEntryData((prevState) => ({
            ...prevState,
            desc,
        }));
    };

    const setDurationFrom = (durationFrom: Date) => {
        setActiveEntryData((prevState) => ({
            ...prevState,
            durationFrom,
        }));
    };

    const setDurationTo = (durationTo: Date) => {
        setActiveEntryData((prevState) => ({
            ...prevState,
            durationTo,
        }));
    };

    const setEntryDuration = (durationTime: string) => {
        setActiveEntryData((prevState) => ({
            ...prevState,
            durationTime,
        }));
    };

    useEffect(() => {
        const m =
            (activeEntryData.durationTo === undefined
                ? new Date().valueOf()
                : activeEntryData.durationTo.valueOf() -
                  (activeEntryData.durationFrom === undefined
                      ? new Date().valueOf()
                      : activeEntryData.durationFrom.valueOf())) /
            1000 /
            60;
        const hr = Math.floor(m / 60);
        setEntryDuration(hr + "hrs " + (m - hr * 60) + "m");
        return () => {};
    }, [activeEntryData.durationFrom, activeEntryData.durationTo]);

    return (
        <>
            {(editingActive && (
                <>
                    <TextInput
                        mode="outlined"
                        value={activeEntryData.title}
                        onChangeText={(text) => {
                            setEntryTitle(text);
                        }}
                        label={"Title"}
                    ></TextInput>
                    <RatingSelector
                        ratingState={
                            activeEntryData.rating === undefined
                                ? 0
                                : activeEntryData.rating
                        }
                        ratingHandler={(entryRating: number) => {
                            setEntryRating(entryRating);
                        }}
                        starColor={getAdaptaiveTheme().colors.secondary}
                    ></RatingSelector>
                    <DurationPicker
                        fromValue={
                            activeEntryData.durationFrom === undefined
                                ? new Date()
                                : activeEntryData.durationFrom
                        }
                        fromHandler={(start: any) => {
                            setDurationFrom(start);
                        }}
                        toValue={
                            activeEntryData.durationTo === undefined
                                ? new Date()
                                : activeEntryData.durationTo
                        }
                        toHandler={(end: any) => {
                            setDurationTo(end);
                        }}
                    ></DurationPicker>
                    <TextInput
                        mode="outlined"
                        value={activeEntryData.desc}
                        label={"Entry"}
                        onChangeText={(text) => {
                            setEntryDesc(text);
                        }}
                        numberOfLines={100}
                        multiline={true}
                        contentStyle={{ height: 400 }}
                    ></TextInput>
                    <FAB
                        icon={"check"}
                        onPress={() => {
                            if (editingExistent) {
                                props.onEntryChangeHandler({
                                    ...activeEntryData,
                                    toAdd: false,
                                    toEdit: true,
                                });
                            } else {
                                props.onEntryChangeHandler({
                                    ...activeEntryData,
                                    toAdd: true,
                                });
                            }
                            setEditingActive(false);
                        }}
                    ></FAB>
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
                            {activeEntryData.title}
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
                                        activeEntryData.rating === undefined
                                            ? 0
                                            : activeEntryData.rating,
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
                            {activeEntryData.durationTime}
                        </PaperText>
                        <PaperText style={{ paddingVertical: 30 }}>
                            {activeEntryData.desc}
                        </PaperText>
                    </>
                ))}
        </>
    );
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
