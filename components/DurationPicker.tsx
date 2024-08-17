import { View } from "react-native";
import { Chip, PaperProvider, Text } from "react-native-paper";
import { useState } from "react";
import { Platform } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";

//TODO(3): add input validation {from<to}.
export default function DurationPicker(props: {
    fromValue: Date;
    fromHandler: Function;
    toValue: Date;
    toHandler: Function;
}) {
    const [fromModalVisible, setFromModalVisible] = useState(false);
    const [toModalVisible, setToModalVisible] = useState(false);

    return (
        <View style={{ flexDirection: "row", gap: 15, marginBottom: 10 }}>
            <Chip
                onPress={() => {
                    setFromModalVisible(true);
                }}
            >
                {props.fromValue.toLocaleTimeString([], {
                    timeStyle: "short",
                })}
            </Chip>
            <TimePickerModal
                visible={fromModalVisible}
                onConfirm={({ hours, minutes }) => {
                    const date = new Date();
                    date.setHours(hours, minutes);
                    props.fromHandler(date);
                    setFromModalVisible(false);
                }}
                onDismiss={() => {
                    setFromModalVisible(false);
                }}
            />
            <Text style={{ textAlignVertical: "center", fontSize: 24 }}>
                {"->"}
            </Text>
            <Chip
                onPress={() => {
                    setToModalVisible(true);
                }}
            >
                {props.toValue.toLocaleTimeString([], {
                    timeStyle: "short",
                })}
            </Chip>
            <TimePickerModal
                visible={toModalVisible}
                onConfirm={({ hours, minutes }) => {
                    const date = new Date();
                    date.setHours(hours, minutes);
                    props.toHandler(date);
                    setToModalVisible(false);
                }}
                onDismiss={() => {
                    setToModalVisible(false);
                }}
            />
        </View>
    );
}
