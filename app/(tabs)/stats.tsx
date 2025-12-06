import { Text, Card, useTheme, Switch } from "react-native-paper";
import { ThemeableChart, lineDataItem } from "@/components/ThemeableChart";
import { View, StyleSheet } from "react-native";
import StreakCircle from "@/components/StreakCircle";
import { useCallback, useState, useEffect, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { unixIntToString } from "@/components/EntryCard";
import { useEntryCRUD } from "@/hooks/useCRUD";

const currentDay = new Date();
const sevenBack = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyBack = new Date(currentDay.getTime() - 30 * 24 * 60 * 60 * 1000);

const transformToChartData = (
    data: { date: string; duration?: number; rating?: number }[],
    type: "duration" | "difficulty"
): lineDataItem[] => {
    return data.map((item) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        if (type === "duration") {
            const duration = item.duration ?? 0;
            return {
                dataPointText: `${formattedDate}\n${
                    Number.isNaN(duration)
                        ? "0hrs 0m"
                        : unixIntToString(duration)
                }`,
                value: Math.floor(duration / 1000 / 60),
            };
        } else {
            const rating = item.rating ?? 0;
            return {
                dataPointText: `${formattedDate}\n★${rating}`,
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
    const [graphScale, setGraphScale] = useState("7D");
    const { colors } = useTheme();

    const highlightTimeoutDur = useRef<number | null>(null);
    const highlightTimeoutDiff = useRef<number | null>(null);

    const db = useSQLiteContext();
    const { aggregateDifficulty, aggregateDuration, countTotalDays, getAll } =
        useEntryCRUD(db);

    useEffect(() => {
        (async () => {
            const startDate = graphScale === "7D" ? sevenBack : thirtyBack;
            const aggDur = await aggregateDuration(startDate, currentDay);
            setDataDur(transformToChartData(aggDur, "duration"));
            const aggDif = await aggregateDifficulty(startDate, currentDay);
            setDataDiff(transformToChartData(aggDif, "difficulty"));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphScale]);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const daysCount = await countTotalDays();
                setTotalDays(daysCount.days);
                const allEntries = await getAll();
                if (allEntries.length > 0) {
                    const maxStreak = Math.max(
                        ...allEntries.map((entry) => entry.streak)
                    );
                    setLongestStreak(maxStreak);
                    const todayString = currentDay.toISOString().slice(0, 10);
                    const yesterday = new Date(currentDay.getTime());
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayString = yesterday
                        .toISOString()
                        .slice(0, 10);
                    const todayEntry = allEntries.find(
                        (entry) =>
                            entry.date.toISOString().slice(0, 10) ===
                            todayString
                    );
                    const yesterdayEntry = allEntries.find(
                        (entry) =>
                            entry.date.toISOString().slice(0, 10) ===
                            yesterdayString
                    );
                    if (todayEntry) {
                        setCurrentStreak(todayEntry.streak);
                    } else if (yesterdayEntry) {
                        setCurrentStreak(yesterdayEntry.streak);
                    } else {
                        setCurrentStreak(0);
                    }
                    const totalTime = allEntries.reduce(
                        (sum, entry) => sum + entry.duration,
                        0
                    );
                    setTotalTimeInvested(unixIntToString(totalTime));
                }
            })();
        }, [countTotalDays, getAll])
    );

    // FIX 4: Auto-reset highlight after 30s
    const handleHighlightDur = (item: any) => {
        setHighlightedDur(item.dataPointText);
        if (highlightTimeoutDur.current) {
            clearTimeout(highlightTimeoutDur.current);
        }
        highlightTimeoutDur.current = setTimeout(() => {
            setHighlightedDur("Press to highlight");
        }, 30000);
    };

    const handleHighlightDiff = (item: any) => {
        setHighlightedDiff(item.dataPointText);
        if (highlightTimeoutDiff.current) {
            clearTimeout(highlightTimeoutDiff.current);
        }
        highlightTimeoutDiff.current = setTimeout(() => {
            setHighlightedDiff("Press to highlight");
        }, 30000);
    };

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
                            <Text style={styles.statLabel}>Total Days</Text>
                            <Text style={styles.statValue}>{totalDays}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>
                                Total Time Invested
                            </Text>
                            <Text style={styles.statValue}>
                                {totalTimeInvested}
                            </Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Longest Streak</Text>
                            <Text style={styles.statValue}>
                                {longestStreak}
                            </Text>
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
                    setChartWidth(e.nativeEvent.layout.width);
                }}
            >
                <Card.Title
                    title="Duration"
                    titleStyle={{ color: colors.onSecondaryContainer }}
                    style={{ paddingLeft: 8 }}
                    right={(props) => (
                        <Text style={styles.chartHighlightText}>
                            {dataDur.length < 3
                                ? "Log more entries"
                                : highlightedDur}
                        </Text>
                    )}
                />
                <Card.Content
                    style={{
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                        paddingLeft: 8,
                        justifyContent: "center",
                    }}
                >
                    <ThemeableChart
                        hidden={dataDur.length < 3}
                        data={dataDur}
                        height={chartHeight}
                        width={chartWidth}
                        highlightFunction={handleHighlightDur}
                        lineColor={colors.secondary}
                        startColor={colors.secondary}
                        endColor={colors.secondary}
                    />
                </Card.Content>
            </Card>
            <Card
                style={{
                    flex: 1,
                    gap: 0,
                }}
            >
                <Card.Content
                    style={{
                        height: "100%",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 16,
                        paddingVertical: 4,
                    }}
                >
                    <Text>{"7 Days"}</Text>
                    <Switch
                        value={graphScale === "30D"}
                        onValueChange={(value) =>
                            setGraphScale(value ? "30D" : "7D")
                        }
                    />
                    <Text>{"30 Days"}</Text>
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
                    right={(props) => (
                        <Text style={styles.chartHighlightText}>
                            {dataDur.length < 3
                                ? "Log more entries"
                                : highlightedDiff}
                        </Text>
                    )}
                />
                <Card.Content
                    style={{
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                        paddingLeft: 8,
                    }}
                >
                    <ThemeableChart
                        hidden={dataDiff.length < 3}
                        data={dataDiff}
                        width={chartWidth}
                        highlightFunction={handleHighlightDiff}
                        height={chartHeight}
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
        // overflow: "hidden",
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
    chartHighlightText: {
        textAlign: "center",
        lineHeight: 20,
        fontSize: 12,
        paddingRight: 16,
    },
    switchContainer: {
        flex: 1,
        padding: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
});
