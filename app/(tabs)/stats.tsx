import {
    Text as PaperText,
    Card,
    PaperProvider,
    useTheme,
} from "react-native-paper";
import { ThemeableChart, lineDataItem } from "@/components/ThemeableChart";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StreakCircle from "@/components/StreakCircle";
import { useCRUDService, readUser, MusicianUser } from "@/hooks/useCRUD";
import { unixIntToString } from "@/components/Entry";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";

const currentDay = new Date();
const sevenBack = new Date(currentDay.getTime() - 6 * 24 * 60 * 60 * 1000);
const thirtyBack = new Date(currentDay.getTime() - 29 * 24 * 60 * 60 * 1000);

export default function Account() {
    const [activeUser, setActiveUser] = useState<MusicianUser>({
        name: "",
        longestStreak: 0,
        currentStreak: 0,
        points: 0,
        ownedEquipmentIds: [],
    });
    const [totalDays, setTotalDays] = useState(0);
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
    const LiveCRUD = useCRUDService();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const count = await LiveCRUD!.countDays();
                setTotalDays(count!.days);
                const act = await readUser();
                setActiveUser(act!);
                let durSet = [];
                if (
                    durationGraphScale === "7D" ||
                    durationGraphScale === "30D"
                ) {
                    const aggDur = await LiveCRUD!.aggregateDur(
                        durationGraphScale === "7D" ? sevenBack : thirtyBack,
                        currentDay
                    );
                    for (const dur of aggDur) {
                        durSet.push({
                            dataPointText: `${dur.date}\n${
                                Number.isNaN(dur.duration)
                                    ? "0hrs 0m"
                                    : unixIntToString(dur.duration)
                            }`,
                            value: Math.floor(dur.duration / 1000 / 60),
                        });
                    }
                    setDataDur(durSet);
                    let diffSet = [];
                    if (
                        difficultyGraphScale === "7D" ||
                        difficultyGraphScale === "30D"
                    ) {
                        const aggDif = await LiveCRUD!.aggregateDiff(
                            difficultyGraphScale === "7D"
                                ? sevenBack
                                : thirtyBack,
                            currentDay
                        );
                        for (const diff of aggDif) {
                            diffSet.push({
                                dataPointText: `${diff.date}\n★${diff.rating}`,
                                value: diff.rating,
                            });
                        }
                        setDataDiff(diffSet);
                    }
                }
            })();
        }, [LiveCRUD])
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
                            level={totalDays}
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
                    <Card.Content>
                        <View style={styles.statRow}>
                            <PaperText style={styles.statLabel}>
                                Current Streak
                            </PaperText>
                            <PaperText style={styles.statValue}>
                                {activeUser?.currentStreak ?? 0}
                            </PaperText>
                        </View>
                        <View style={styles.statRow}>
                            <PaperText style={styles.statLabel}>
                                Longest Streak
                            </PaperText>
                            <PaperText style={styles.statValue}>
                                {activeUser?.longestStreak ?? 0}
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
                            {dataDur.length! < 3
                                ? "Log more entires to acccess stats"
                                : highlightedDur}
                        </PaperText>
                    </View>
                    <ThemeableChart
                        hidden={dataDur.length < 3}
                        data={dataDur!}
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
                            {dataDur.length! < 3
                                ? "Log more entires to acccess stats"
                                : highlightedDiff}
                        </PaperText>
                    </View>
                    <ThemeableChart
                        hidden={dataDiff.length < 3}
                        data={dataDiff!}
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
    },
    statLabel: {
        fontSize: 16,
    },
    statValue: {
        fontSize: 20,
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
