import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { useState } from "react";
import { DarkTheme, LightTheme } from "@/constants/Colors";
export default function RootLayout() {
    const currentTheme = useColorScheme() ?? "light";
    const [activeTheme, setActiveTheme] = useState(
        currentTheme === "light" ? LightTheme : DarkTheme
    );
    return (
        <PaperProvider theme={activeTheme}>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        contentStyle: {
                            backgroundColor: "#000",
                        },
                        headerShown: false,
                    }}
                />
            </Stack>
        </PaperProvider>
    );
}
