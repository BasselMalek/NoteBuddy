import { View, StyleSheet } from "react-native";
import {
    Card,
    Text,
    useTheme,
    IconButton,
    FAB,
    Button,
} from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { DisplayEntry } from "@/components/EntryCard";
import { dummyEntries } from "@/constants/Dummy";
import React, { useState } from "react";

const currentDay = new Date();

export default function Practice() {
    const { colors } = useTheme();
    const [selected, setSelected] = useState<Date | null>(null);

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column-reverse",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    // paddingBottom: 0,
                }}
            >
                <Button
                    icon={"calendar"}
                    mode="elevated"
                    elevation={5}
                    style={{
                        borderRadius: 24,
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {currentDay.toDateString()}
                </Button>
                <FAB
                    color={colors.primary}
                    customSize={48}
                    icon={selected ? "trash-can" : "plus"}
                    style={{
                        borderRadius: 240,
                        backgroundColor: colors.elevation.level1,
                    }}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    // paddingBottom: 5,
                }}
            >
                <FlashList
                    fadingEdgeLength={{ start: 40, end: 3 }}
                    maintainVisibleContentPosition={{
                        animateAutoScrollToBottom: true,
                        startRenderingFromBottom: true,
                        autoscrollToBottomThreshold: 10,
                    }}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 10 }} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    renderItem={({ item }) => (
                        <DisplayEntry
                            entryData={item}
                            onPress={(date) => {
                                setSelected(date === selected ? null : date);
                            }}
                            selected={selected === item.date}
                        />
                    )}
                    data={dummyEntries}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    expandedCard: {
        display: "flex",
        flex: 3,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 34,
    },
});
