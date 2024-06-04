import { Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import {
    BottomNavigation,
    adaptNavigationTheme,
    MD3DarkTheme as DefaultDark,
    PaperProvider,
    MD3LightTheme,
    MD3DarkTheme,
} from "react-native-paper";
import { LightTheme, DarkTheme } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useState } from "react";

export default function RootLayout() {
    const currentTheme = useColorScheme() ?? "light";
    const [activeTheme, setActiveTheme] = useState(
        currentTheme === "light" ? LightTheme : DarkTheme
    );
    return (
        <PaperProvider theme={activeTheme}>
            <Tabs
                sceneContainerStyle={{
                    backgroundColor: activeTheme.colors.background,
                }}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: activeTheme.colors.surfaceVariant,
                        shadowColor: "transparent",
                    },
                    headerTitleStyle: {
                        color: activeTheme.colors.onSurface,
                    },
                }}
                tabBar={({ navigation, state, descriptors, insets }) => (
                    <BottomNavigation.Bar
                        theme={activeTheme}
                        navigationState={state}
                        style={{
                            backgroundColor: activeTheme.colors.surfaceVariant,
                        }}
                        safeAreaInsets={insets}
                        onTabPress={({ route, preventDefault }) => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (event.defaultPrevented) {
                                preventDefault();
                            } else {
                                navigation.dispatch({
                                    ...CommonActions.navigate(
                                        route.name,
                                        route.params
                                    ),
                                    target: state.key,
                                });
                            }
                        }}
                        renderIcon={({ route, focused, color }) => {
                            const { options } = descriptors[route.key];
                            if (options.tabBarIcon) {
                                return options.tabBarIcon({
                                    focused,
                                    color,
                                    size: 24,
                                });
                            }

                            return null;
                        }}
                        getLabelText={({ route }) => {
                            const { options } = descriptors[route.key];
                            const label =
                                options.tabBarLabel !== undefined
                                    ? options.tabBarLabel
                                    : options.title;

                            return label;
                        }}
                    />
                )}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Tuner",
                        tabBarIcon: () => (
                            <MaterialCommunityIcons
                                name="music-note"
                                size={24}
                                color={activeTheme.colors.primary}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="metronome"
                    options={{
                        title: "Metronome",
                        tabBarIcon: () => (
                            <MaterialCommunityIcons
                                name="metronome"
                                size={24}
                                color={activeTheme.colors.primary}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="practice"
                    options={{
                        title: "Practice",
                        tabBarIcon: () => (
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={24}
                                color={activeTheme.colors.primary}
                            />
                        ),
                    }}
                />
            </Tabs>
        </PaperProvider>
    );
}
