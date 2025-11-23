import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme } from "@/constants/Colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

export default function RootLayout() {
    let paperTheme;
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const colorSettings = AsyncStorage.getItemSync("customColors");
    if (colorSettings === null || colorSettings === "false") {
        AsyncStorage.setItemAsync("customColors", "false");
        paperTheme =
            colorScheme === "dark"
                ? { ...MD3DarkTheme, colors: theme.dark }
                : { ...MD3LightTheme, colors: theme.light };
    } else {
        paperTheme =
            colorScheme === "dark"
                ? { ...MD3DarkTheme, colors: DarkTheme.colors }
                : { ...MD3LightTheme, colors: LightTheme.colors };
    }

    return (
        <SafeAreaProvider>
            <PaperProvider theme={paperTheme}>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
