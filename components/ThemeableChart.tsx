import { LineChart, lineDataItem } from "react-native-gifted-charts";

function ThemeableChart(props: {
    data: lineDataItem[];
    highlightFunction: Function;
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
            initialSpacing={2}
            startFillColor={props.startColor}
            startOpacity={0.6}
            endOpacity={0.2}
            endFillColor={props.endColor}
            endSpacing={0}
            adjustToWidth
            disableScroll
            curved
            focusEnabled
            // showDataPointOnFocus
            onFocus={(item: lineDataItem) => {
                props.highlightFunction(item);
            }}
            color={props.lineColor}
            hideRules
            showVerticalLines
            verticalLinesColor={"rgba(106, 219, 167,0.1)"}
            focusedDataPointColor={"rgba(124, 45, 18,1)"}
            unFocusOnPressOut
            dataPointsColor={"rgba(106, 219, 167,0.7)"}
            yAxisThickness={-8}
            xAxisThickness={0}
            hideYAxisText={true}
            hideOrigin
            yAxisLabelWidth={0}
            xAxisLabelsHeight={0}
            textColor={"rgba(106, 219, 167,0)"}
            isAnimated
            animateOnDataChange
        />
    );
}

export { ThemeableChart };
