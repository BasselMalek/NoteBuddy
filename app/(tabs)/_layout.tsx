import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation, Portal, Modal, useTheme } from "react-native-paper";
import { useState, useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
    CRUDService,
    firstTimeSetup,
    initializeCRUDService,
    storeUser,
} from "@/hooks/useCRUD";
import CRUDProvider from "@/components/CRUDProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateUserForm from "@/components/CreateUserForm";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 10000 } },
});
export default function RootLayout() {
    const activeTheme = useTheme();
    const insets = useSafeAreaInsets();
    const [activeCrud, setActiveCrud] = useState<CRUDService>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        (async () => {
            registerTranslation("en-GB", enGB);
            await firstTimeSetup("PracticeEntries.db");
            const crud = await initializeCRUDService("PracticeEntries.db");
            setActiveCrud(crud);
            const prof = await AsyncStorage.getItem("MainUser");
            setIsModalVisible(prof === null ? true : false);
        })();
    }, []);

    return (
        <CRUDProvider value={activeCrud!}>
            <QueryClientProvider client={queryClient}>
                <StatusBar translucent />
                <Portal>
                    <Modal
                        visible={isModalVisible}
                        contentContainerStyle={{
                            backgroundColor: activeTheme.colors.background,
                            padding: 20,
                            margin: 20,
                            borderRadius: 15,
                            flexDirection: "column",
                        }}
                    >
                        <CreateUserForm
                            handler={(nameInput: string) => {
                                storeUser({
                                    name: nameInput,
                                    points: 0,
                                    currentStreak: 0,
                                    ownedEquipmentIds: [],
                                });
                                setIsModalVisible(false);
                            }}
                        />
                    </Modal>
                </Portal>
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
            </QueryClientProvider>
        </CRUDProvider>
    );
}
