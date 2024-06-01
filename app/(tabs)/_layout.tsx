import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Tuner",
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons
                            name="music-note"
                            size={size}
                            color="black"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="metronome"
                options={{
                    title: "Metronome",
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons
                            name="metronome"
                            size={size}
                            color="black"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="practice"
                options={{
                    title: "Practice",
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons
                            name="calendar-month"
                            size={24}
                            color="black"
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
