import { View } from "react-native";
import { Chip, PaperProvider, Text, useTheme } from "react-native-paper";
import { useState } from "react";
import { Platform } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";

//TODO(3): add input validation {from<to}.
export default function DurationPicker(props: {
    fromValue: Date;
    fromHandler: Function;
    toValue: Date;
    toHandler: Function;
    error?: boolean;
}) {
    const [fromModalVisible, setFromModalVisible] = useState(false);
    const [toModalVisible, setToModalVisible] = useState(false);
    const activeTheme = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 15,
                marginBottom: 10,
            }}
        >
            <Chip
                mode="outlined"
                onPress={() => {
                    setFromModalVisible(true);
                }}
                style={{
                    borderColor:
                        props.error ?? false
                            ? activeTheme.colors.error
                            : activeTheme.colors.outline,
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
                mode="outlined"
                style={{
                    borderColor:
                        props.error ?? false
                            ? activeTheme.colors.error
                            : activeTheme.colors.outline,
                }}
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
