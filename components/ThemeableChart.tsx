import { LineChart, lineDataItem } from "react-native-gifted-charts";
function ThemeableChart(props: {
    hidden: boolean;
    data: lineDataItem[];
    highlightFunction: Function;
    width: number;
    height: number;
    lineColor: string;
    startColor?: string;
    endColor?: string;
}) {
    if (!props.hidden) {
        return (
            <LineChart
                data={props.data}
                height={props.height}
                areaChart
                width={props.width}
                initialSpacing={0}
                endSpacing={0}
                startFillColor={props.startColor}
                startOpacity={0.6}
                endOpacity={0.2}
                endFillColor={props.endColor}
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
                verticalLinesColor={`rgba(${props.lineColor.slice(5, -1)},0.1)`}
                // focusedDataPointColor={"rgba(124, 45, 18,1)"}
                unFocusOnPressOut
                dataPointsColor={`rgba(${props.lineColor.slice(5, -1)},0.7)`}
                yAxisThickness={-8}
                xAxisThickness={0}
                hideYAxisText={true}
                hideOrigin
                yAxisLabelWidth={0}
                xAxisLabelsHeight={0}
                textColor={"rgba(106, 219, 167,0)"}
                // isAnimated
                // animateOnDataChange
            />
        );
    }
}

export { ThemeableChart, lineDataItem };
