import { EntryData } from "@/hooks/useCRUD";
import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

const unixIntToString = (unixMS: number) => {
    const m = Math.round(unixMS / 1000 / 60);
    const hr = Math.floor(m / 60);
    return hr + "hrs " + (m - hr * 60) + "m";
};

interface DisplayEntryProps {
    entryData: EntryData;
    selected?: boolean;
    onPress?: (date: Date) => void;
    style?: StyleProp<ViewStyle>;
}

export const DisplayEntry = ({
    entryData,
    style,
    onPress = () => {},
    selected = false,
}: DisplayEntryProps) => {
    const { colors } = useTheme();
    const { date, title, rating, duration, desc } = entryData;

    return (
        <Card
            onPress={() => {
                onPress(date);
            }}
            style={[
                {
                    backgroundColor: selected
                        ? colors.primaryContainer
                        : colors.elevation.level1,
                    flex: 1,
                    marginHorizontal: 2,
                },
                style,
            ]}
        >
            <Card.Content>
                <Text
                    style={{
                        fontSize: 16,
                        lineHeight: 24,
                        color: colors.onSurface,
                    }}
                >
                    {desc}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        marginTop: 5,
                    }}
                >
                    <Text
                        variant="labelLarge"
                        style={{
                            fontWeight: "bold",
                            color: colors.onSurface,
                            // textAlign: "left",
                            // textAlignVertical: "bottom",
                        }}
                    >
                        {title}
                    </Text>
                    <Text
                        variant="labelSmall"
                        style={{
                            fontStyle: "italic",
                            color: colors.secondary,
                            // textAlign: "left",
                            // textAlignVertical: "bottom",
                        }}
                    >
                        {date
                            .toLocaleDateString([], {
                                dateStyle: "medium",
                            })
                            .concat(" • ")}

                        {Array.from({ length: rating }, (v, k) => (
                            <Icon key={k} size={11} source={"star"} />
                        ))}
                        {rating > 0 && duration > 0 ? " • " : ""}
                        {duration > 0 ? unixIntToString(duration) : ""}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};
