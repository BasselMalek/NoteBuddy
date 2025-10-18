import { View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { useState } from "react";
import { TimePickerModal } from "react-native-paper-dates";

export default function DurationPicker(props: {
    from: Date;
    setDuration: (time: number) => void;
    error?: boolean;
}) {
    const [fromModalVisible, setFromModalVisible] = useState(false);
    const [toModalVisible, setToModalVisible] = useState(false);
    const [fromTime, setFromTime] = useState(props.from);
    const [toTime, setToTime] = useState(new Date(props.from.getTime()));
    const activeTheme = useTheme();

    const borderColor = props.error
        ? activeTheme.colors.error
        : activeTheme.colors.outline;

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
                    borderColor: borderColor,
                }}
                textStyle={{
                    color: props.error ? activeTheme.colors.error : undefined,
                }}
            >
                {fromTime.toLocaleTimeString([], {
                    timeStyle: "short",
                })}
            </Chip>

            <TimePickerModal
                visible={fromModalVisible}
                onConfirm={({ hours, minutes }) => {
                    const newFrom = new Date(fromTime);
                    newFrom.setHours(hours, minutes);
                    setFromTime(newFrom);

                    const newDuration = toTime.getTime() - newFrom.getTime();
                    props.setDuration(newDuration);

                    setFromModalVisible(false);
                }}
                onDismiss={() => {
                    setFromModalVisible(false);
                }}
            />

            <Text style={{ textAlignVertical: "center" }}>{":"}</Text>

            <Chip
                mode="outlined"
                style={{
                    borderColor: borderColor,
                }}
                textStyle={{
                    color: props.error ? activeTheme.colors.error : undefined,
                }}
                onPress={() => {
                    setToModalVisible(true);
                }}
            >
                {toTime.toLocaleTimeString([], {
                    timeStyle: "short",
                })}
            </Chip>

            <TimePickerModal
                visible={toModalVisible}
                onConfirm={({ hours, minutes }) => {
                    const newTo = new Date(toTime);
                    newTo.setHours(hours, minutes);
                    setToTime(newTo);

                    const newDuration = newTo.getTime() - fromTime.getTime();
                    props.setDuration(newDuration);

                    setToModalVisible(false);
                }}
                onDismiss={() => {
                    setToModalVisible(false);
                }}
            />
        </View>
    );
}
