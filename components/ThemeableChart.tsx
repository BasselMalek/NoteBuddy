import { Circle } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, Area, Line, Scatter } from "victory-native";
import type { ChartPressState } from "victory-native";
import { useDerivedValue } from "react-native-reanimated";
import { useTheme } from "react-native-paper";

type lineDataItem = {
    dataPointText: string;
    value: number;
};

function ThemeableChart(props: {
    hidden: boolean;
    data: lineDataItem[];
    chartPressState: ChartPressState<{ x: number; y: { y: number } }>;
}) {
    const activeDotOpacity = useDerivedValue(() => {
        return props.chartPressState.isActive.value ? 1 : 0;
    });
    const { colors } = useTheme();

    if (props.hidden) {
        return null;
    }

    const chartData = props.data.map((item, index) => ({
        x: index,
        y: item.value,
        label: item.dataPointText,
    }));

    return (
        <View style={{ flex: 1 }}>
            <CartesianChart
                data={chartData}
                xKey="x"
                yKeys={["y"]}
                chartPressState={props.chartPressState}
                domainPadding={{
                    top: 20,
                    bottom: 20,
                    // right: 10,
                    // left: 10,
                }}
                axisOptions={{
                    font: undefined,
                    lineColor: "transparent",
                    tickCount: 0,
                }}
            >
                {({ points, chartBounds }) => (
                    <>
                        <Area
                            points={points.y}
                            y0={chartBounds.bottom}
                            color={colors.secondary}
                            opacity={0.3}
                            curveType="natural"
                            animate={{ type: "timing", duration: 300 }}
                        />
                        <Line
                            points={points.y}
                            color={colors.secondary}
                            strokeWidth={2}
                            curveType="natural"
                            animate={{ type: "timing", duration: 300 }}
                        />
                        <Scatter
                            points={points.y}
                            radius={4}
                            color={colors.secondary}
                            opacity={0.8}
                            animate={{ type: "timing", duration: 300 }}
                        />
                        <Circle
                            cx={props.chartPressState.x.position}
                            cy={props.chartPressState.y.y.position}
                            r={8}
                            color={colors.primary}
                            opacity={activeDotOpacity}
                        />
                    </>
                )}
            </CartesianChart>
        </View>
    );
}

export { ThemeableChart, lineDataItem };
