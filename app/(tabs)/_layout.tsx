import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation, useTheme } from "react-native-paper";
import { useEffect } from "react";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SQLite from "expo-sqlite";

export default function RootLayout() {
    const activeTheme = useTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        let connection: SQLite.SQLiteDatabase;
        async function setupDatabase() {
            registerTranslation("en-GB", enGB);
            connection = await SQLite.openDatabaseAsync("PracticeEntries.db");
            await connection.execAsync(
                `CREATE TABLE IF NOT EXISTS entries (
                    date TEXT PRIMARY KEY NOT NULL,
                    title TEXT,
                    duration INTEGER,
                    rating INTEGER,
                    description TEXT,
                    streak INTEGER
                );`
            );
        }
        setupDatabase();
        return () => {
            connection?.closeAsync();
        };
    }, []);

    return (
        <SQLite.SQLiteProvider databaseName={"PracticeEntries.db"}>
            <StatusBar translucent />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    sceneStyle: {
                        flex: 1,
                        backgroundColor: activeTheme.colors.background,
                        paddingTop: insets.top + 10,
                        paddingRight: insets.right + 10,
                        paddingLeft: insets.left + 10,
                        paddingBottom: 10,
                    },
                }}
                tabBar={({ navigation, state, descriptors, insets }) => (
                    <BottomNavigation.Bar
                        theme={activeTheme}
                        navigationState={state}
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
                            const label = options.title;
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
                <Tabs.Screen
                    name="stats"
                    options={{
                        title: "Statistics",
                        tabBarIcon: () => (
                            <MaterialCommunityIcons
                                name="chart-bar"
                                size={24}
                                color={activeTheme.colors.primary}
                            />
                        ),
                    }}
                />
            </Tabs>
        </SQLite.SQLiteProvider>
    );
}
