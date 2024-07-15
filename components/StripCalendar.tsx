import {
    Calendar,
    toDateId,
    CalendarTheme,
    useCalendar,
    CalendarProps,
} from "@marceloterreiro/flash-calendar";
import { useState } from "react";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

//TODO: [] Style it properly
interface StripProps extends CalendarProps {
    // initialDate: Date;
    // OnDatePressHandler: Function;
}
export function StripCalendar(props: StripProps) {
    const Cal: CalendarTheme = {
        itemDay: {
            base: () => ({
                container: {
                    padding: 0,
                    borderRadius: 0,
                },
            }),
            today: () => ({
                container: {
                    borderWidth: 2,
                    borderColor: "red",
                },
            }),
            idle: ({ isDifferentMonth }) => ({
                content: isDifferentMonth
                    ? {
                          color: "red",
                      }
                    : undefined,
            }),
            active: () => ({
                container: {
                    backgroundColor: "red",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                },
                content: {
                    color: "red",
                },
            }),
        },
    };
    const { calendarRowMonth, weekDaysList, weeksList } = useCalendar(props);
    const today = toDateId(new Date());
    const calTheme: CalendarTheme = {
        rowMonth: {
            content: {
                fontWeight: "bold",
                color: "red",
            },
        },
    };
    return (
        <Calendar.List
            calendarInitialMonthId={today}
            theme={calTheme}
            calendarRowVerticalSpacing={1}
            calendarRowHorizontalSpacing={1}
            onCalendarDayPress={(day) => {
                props.OnDatePressHandler(new Date(day));
            }}
        />
        // //     {weeksList.map((week, i) => (
        // //         <Calendar.Row.Week>
        // //             {week.map((day) => (
        // //                 <Calendar.Item.Day.Container
        // //                     dayHeight={40}
        // //                     daySpacing={1}
        // //                     isStartOfWeek={day.isStartOfWeek}
        // //                     key={day.id}
        // //                 >
        // //                     <Calendar.Item.Day
        // //                         height={60}
        // //                         metadata={day}
        // //                         onPress={props.onCalendarDayPress}
        // //                         theme={Cal.itemDay}
        // //                     >
        // //                         {day.displayLabel}
        // //                     </Calendar.Item.Day>
        // //                 </Calendar.Item.Day.Container>
        // //             ))}
        // //         </Calendar.Row.Week>
        // //     ))}
        // // </Calendar.HStack>

        // // <FlashList
        // //     data={weeksList}
        // //     keyExtractor={(item, i) => ` ${calendarRowMonth}${i}`}
        // //         estimatedItemSize={200}
        // //     renderItem={(week) => (
        // //         <Calendar.Row.Week spacing={20} key={week.index}>
        // //             {week.item.map((day, i) => (
        // //                 <Calendar.Item.Day
        // //                     height={60}
        // //                     key={i}
        // //                     metadata={day}
        // //                     onPress={props.onCalendarDayPress}
        // //                     theme={Cal.itemDay}
        // //                 >
        // //                     {day.displayLabel}
        // //                 </Calendar.Item.Day>
        // //             ))}
        // //         </Calendar.Row.Week>
        // //     )}
        // // />
    );
}
