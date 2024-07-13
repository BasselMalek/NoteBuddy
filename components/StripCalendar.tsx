import {
    Calendar,
    toDateId,
    CalendarTheme,
} from "@marceloterreiro/flash-calendar";
import { useState } from "react";
import { Text, View } from "react-native";

//TODO: [] Style it properly

export function StripCalendar(props: {
    initialDate: Date;
    OnDatePressHandler: Function;
}) {
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
            onCalendarDayPress={(day) => {
                props.OnDatePressHandler(new Date(day));
            }}
        />
    );
}
