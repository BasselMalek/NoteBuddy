import {
    Text as PaperText,
    Card,
    PaperProvider,
    useTheme,
} from "react-native-paper";
import { ThemeableChart, lineDataItem } from "@/components/ThemeableChart";
import { View, StyleSheet } from "react-native";
import StreakCircle from "@/components/StreakCircle";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { unixIntToString } from "@/components/EntryCard";
import { useEntryCRUD } from "@/hooks/useCRUD";

const currentDay = new Date();
const sevenBack = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyBack = new Date(currentDay.getTime() - 30 * 24 * 60 * 60 * 1000);

const transformToChartData = (
    data: Array<{ date: string; duration?: number; rating?: number }>,
    type: "duration" | "difficulty"
): lineDataItem[] => {
    return data.map((item) => {
        if (type === "duration") {
            const duration = item.duration ?? 0;
            return {
                dataPointText: `${item.date}\n${
                    Number.isNaN(duration)
                        ? "0hrs 0m"
                        : unixIntToString(duration)
                }`,
                value: Math.floor(duration / 1000 / 60),
            };
        } else {
            const rating = item.rating ?? 0;
            return {
                dataPointText: `${item.date}\n★${rating}`,
                value: rating,
            };
        }
    });
};

export default function Account() {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    const [totalTimeInvested, setTotalTimeInvested] = useState("0hrs 0m");
    const [dataDiff, setDataDiff] = useState<lineDataItem[]>([]);
    const [dataDur, setDataDur] = useState<lineDataItem[]>([]);
    const [chartHeight, setChartHeight] = useState(0);
    const [chartWidth, setChartWidth] = useState(0);
    const [highlightedDiff, setHighlightedDiff] =
        useState("Press to highlight");
    const [highlightedDur, setHighlightedDur] = useState("Press to highlight");
    const [durationGraphScale, setDurationGraphScale] = useState("7D");
    const [difficultyGraphScale, setdifficultyGraphScale] = useState("7D");
    const { colors } = useTheme();

    const db = useSQLiteContext();
    const {
        aggregateDifficulty,
        aggregateDuration,
        getEntryByDate,
        countTotalDays,
        getAll,
    } = useEntryCRUD(db);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                // Get today's entry to extract current streak
                const todayEntry = await getEntryByDate(currentDay);
                setCurrentStreak(todayEntry?.streak ?? 0);

                // Calculate total days
                const daysCount = await countTotalDays();
                setTotalDays(daysCount.days);

                // Calculate longest streak and total time invested
                const allEntries = await getAll();
                if (allEntries.length > 0) {
                    // Find longest streak
                    const maxStreak = Math.max(
                        ...allEntries.map((entry) => entry.streak)
                    );
                    setLongestStreak(maxStreak);

                    // Calculate total time invested
                    const totalTime = allEntries.reduce(
                        (sum, entry) => sum + entry.duration,
                        0
                    );
                    setTotalTimeInvested(unixIntToString(totalTime));
                }

                // Fetch and transform duration data
                if (
                    durationGraphScale === "7D" ||
                    durationGraphScale === "30D"
                ) {
                    const aggDur = await aggregateDuration(
                        durationGraphScale === "7D" ? sevenBack : thirtyBack,
                        currentDay
                    );
                    setDataDur(transformToChartData(aggDur, "duration"));
                }

                // Fetch and transform difficulty data
                if (
                    difficultyGraphScale === "7D" ||
                    difficultyGraphScale === "30D"
                ) {
                    const aggDif = await aggregateDifficulty(
                        difficultyGraphScale === "7D" ? sevenBack : thirtyBack,
                        currentDay
                    );
                    setDataDiff(transformToChartData(aggDif, "difficulty"));
                }
            })();
        }, [
            aggregateDifficulty,
            aggregateDuration,
            getEntryByDate,
            durationGraphScale,
            difficultyGraphScale,
            countTotalDays,
            getAll,
        ])
    );

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                gap: 10,
            }}
        >
            <View style={{ flex: 4, flexDirection: "row", gap: 10 }}>
                <Card
                    style={{
                        ...styles.card,
                        flex: 6,
                    }}
                >
                    <Card.Title
                        title="Streak"
                        titleStyle={{ color: colors.onSecondaryContainer }}
                        style={{ paddingLeft: 8 }}
                    />
                    <Card.Content
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <StreakCircle
                            level={currentStreak}
                            filled={colors.secondary}
                            unfilled={colors.surfaceVariant}
                        />
                    </Card.Content>
                </Card>
                <Card
                    style={{
                        ...styles.card,
                        flex: 13,
                    }}
                >
                    <Card.Title
                        title="Stats"
                        titleStyle={{ color: colors.onSecondaryContainer }}
                        style={{ paddingLeft: 8 }}
                    />
                    <Card.Content
                        style={{
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={styles.statRow}>
                            <PaperText style={styles.statLabel}>
                                Total Days
                            </PaperText>
                            <PaperText style={styles.statValue}>
                                {totalDays}
                            </PaperText>
                        </View>
                        <View style={styles.statRow}>
                            <PaperText style={styles.statLabel}>
                                Total Time Invested
                            </PaperText>
                            <PaperText style={styles.statValue}>
                                {totalTimeInvested}
                            </PaperText>
                        </View>
                        <View style={styles.statRow}>
                            <PaperText style={styles.statLabel}>
                                Longest Streak
                            </PaperText>
                            <PaperText style={styles.statValue}>
                                {longestStreak}
                            </PaperText>
                        </View>
                    </Card.Content>
                </Card>
            </View>
            <Card
                style={{
                    ...styles.card,
                    flex: 7,
                }}
                onLayout={(e) => {
                    setChartHeight(e.nativeEvent.layout.height);
                    setChartWidth(e.nativeEvent.layout.width + 7);
                }}
            >
                <Card.Title
                    title="Duration"
                    titleStyle={{ color: colors.onSecondaryContainer }}
                    style={{ paddingLeft: 8 }}
                />
                <Card.Content
                    style={{ paddingVertical: 0, paddingHorizontal: 0 }}
                >
                    <View
                        style={[
                            styles.chartHighlight,
                            {
                                backgroundColor: colors.surfaceVariant,
                            },
                        ]}
                    >
                        <PaperText style={styles.chartHighlightText}>
                            {dataDur.length < 3
                                ? "Log more entries to access stats"
                                : highlightedDur}
                        </PaperText>
                    </View>
                    <ThemeableChart
                        hidden={dataDur.length < 3}
                        data={dataDur}
                        width={chartWidth}
                        highlightFunction={(item: any) => {
                            setHighlightedDur(item.dataPointText);
                        }}
                        height={chartHeight - 60}
                        lineColor={colors.secondary}
                        startColor={colors.secondary}
                        endColor={colors.secondary}
                    />
                </Card.Content>
            </Card>
            <Card
                style={{
                    ...styles.card,
                    flex: 7,
                }}
            >
                <Card.Title
                    title="Difficulty"
                    titleStyle={{ color: colors.onSecondaryContainer }}
                    style={{ paddingLeft: 8 }}
                />
                <Card.Content
                    style={{ paddingVertical: 0, paddingHorizontal: 0 }}
                >
                    <View
                        style={[
                            styles.chartHighlight,
                            {
                                backgroundColor: colors.surfaceVariant,
                            },
                        ]}
                    >
                        <PaperText style={styles.chartHighlightText}>
                            {dataDur.length < 3
                                ? "Log more entries to access stats"
                                : highlightedDiff}
                        </PaperText>
                    </View>
                    <ThemeableChart
                        hidden={dataDiff.length < 3}
                        data={dataDiff}
                        width={chartWidth}
                        highlightFunction={(item: any) => {
                            setHighlightedDiff(item.dataPointText);
                        }}
                        height={chartHeight - 60}
                        lineColor={colors.secondary}
                        startColor={colors.secondary}
                        endColor={colors.secondary}
                    />
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        overflow: "hidden",
    },
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    statLabel: {},
    statValue: {
        fontWeight: "bold",
    },
    item: {
        flex: 1,
        textAlign: "center",
    },
    chartHighlight: {
        borderRadius: 10,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 7,
        position: "absolute",
        top: 0,
        right: 0,
        margin: 8,
        alignSelf: "flex-end",
        zIndex: 1,
    },
    chartHighlightText: {
        textAlign: "center",
        lineHeight: 20,
    },
});
