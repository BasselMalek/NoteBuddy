import { LineChart, lineDataItem } from "react-native-gifted-charts";

function ThemeableChart(props: {
    data: lineDataItem[];
    width: number;
    height: number;
    lineColor: string;
    startColor?: string;
    endColor?: string;
}) {
    return (
        <LineChart
            data={props.data}
            height={props.height}
            areaChart
            width={props.width}
            initialSpacing={0}
            startFillColor={props.startColor}
            startOpacity={0.6}
            endOpacity={0.2}
            endFillColor={props.endColor}
            endSpacing={0}
            adjustToWidth
            disableScroll
            curved
            focusEnabled
            showDataPointOnFocus
            onFocus={() => {
                console.log("focused");
            }}
            color={props.lineColor}
            hideRules
            yAxisThickness={-8}
            xAxisThickness={0}
            hideYAxisText={true}
            hideOrigin
            yAxisLabelWidth={0}
            xAxisLabelsHeight={0}
            xAxisLabelTextStyle={{ textAlign: "right", color: "red" }}
            isAnimated
            animateOnDataChange
        />
    );
}

export { ThemeableChart };
