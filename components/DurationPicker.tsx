import { View } from "react-native";
import { Chip, PaperProvider, Text } from "react-native-paper";
import { useState } from "react";
import { Platform } from "react-native";
import RNDateTimePicker, {
    DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
//TODO(3): add input validation {from<to}.
export default function DurationPicker(props: {
    fromValue: Date;
    fromHandler: Function;
    toValue: Date;
    toHandler: Function;
}) {
    const [showFrom, setShowFrom] = useState(false);
    const [showTo, setShowTo] = useState(false);
    const onFromChange = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate;
        props.fromHandler(currentDate);
    };
    const onToChange = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate;
        props.toHandler(currentDate);
    };
    if (Platform.OS === "android") {
        return (
            <View style={{ flexDirection: "row", gap: 15 }}>
                <Chip
                    onPress={() => {
                        DateTimePickerAndroid.open({
                            value: props.fromValue,
                            mode: "time",
                            onChange: onFromChange,
                        });
                    }}
                >
                    {props.fromValue.toLocaleTimeString([], {
                        timeStyle: "short",
                    })}
                </Chip>
                <Text style={{ textAlignVertical: "center", fontSize: 24 }}>
                    {"->"}
                </Text>
                <Chip
                    onPress={() => {
                        DateTimePickerAndroid.open({
                            value: props.toValue,
                            mode: "time",
                            onChange: onToChange,
                        });
                    }}
                >
                    {props.toValue.toLocaleTimeString([], {
                        timeStyle: "short",
                    })}
                </Chip>
            </View>
        );
    } else {
        return (
            <View style={{ flexDirection: "row", gap: 15 }}>
                <Chip
                    onPress={() => {
                        setShowFrom(true);
                    }}
                >
                    {props.fromValue.toLocaleTimeString([], {
                        timeStyle: "short",
                    })}
                </Chip>
                {showFrom && (
                    <RNDateTimePicker
                        mode="time"
                        onChange={onFromChange}
                        value={props.fromValue}
                    ></RNDateTimePicker>
                )}
                <Text style={{ textAlignVertical: "center", fontSize: 24 }}>
                    {"->"}
                </Text>
                <Chip
                    onPress={() => {
                        setShowTo(true);
                    }}
                >
                    {props.toValue.toLocaleTimeString([], {
                        timeStyle: "short",
                    })}
                </Chip>
                {showTo && (
                    <RNDateTimePicker
                        mode="time"
                        onChange={onToChange}
                        value={props.toValue}
                    ></RNDateTimePicker>
                )}
            </View>
        );
    }
}
