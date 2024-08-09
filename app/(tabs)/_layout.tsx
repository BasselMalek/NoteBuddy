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
    Portal,
    Modal,
} from "react-native-paper";
import { LightTheme, DarkTheme, getAdaptaiveTheme } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useState } from "react";
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

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 10000 } },
});
//! WILL ALWAYS FAIL ON FIRST LAUNCH. ADD DELAY TO CRUD INIT TO PREVENT ERROR
let activeCrud: CRUDService = null;
let profileExists = false;

(async () => {
    await firstTimeSetup("PracticeEntries.db");
    activeCrud = await initializeCRUDService("PracticeEntries.db");
    const prof = await AsyncStorage.getItem("MainUser");
    profileExists = prof === null ? false : true;
})();
export default function RootLayout() {
    const currentTheme = useColorScheme() ?? "light";
    const [activeTheme, setActiveTheme] = useState(
        currentTheme === "light" ? LightTheme : DarkTheme
    );
    const [isModalVisible, setIsModalVisible] = useState(!profileExists);

    return (
        <CRUDProvider value={activeCrud}>
            <QueryClientProvider client={queryClient}>
                <PaperProvider theme={activeTheme}>
                    <Portal>
                        <Modal
                            visible={isModalVisible}
                            contentContainerStyle={{
                                backgroundColor:
                                    getAdaptaiveTheme().colors.background,
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
                        sceneContainerStyle={{
                            backgroundColor: activeTheme.colors.background,
                        }}
                        screenOptions={{
                            headerShown: false,
                            headerStyle: {
                                backgroundColor:
                                    activeTheme.colors.surfaceVariant,
                                shadowColor: "transparent",
                            },
                            headerTitleStyle: {
                                // // display: "none",
                                color: activeTheme.colors.onSurface,
                            },
                        }}
                        tabBar={({
                            navigation,
                            state,
                            descriptors,
                            insets,
                        }) => (
                            <BottomNavigation.Bar
                                theme={activeTheme}
                                navigationState={state}
                                style={{
                                    backgroundColor:
                                        activeTheme.colors.surfaceVariant,
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
                </PaperProvider>
            </QueryClientProvider>
        </CRUDProvider>
    );
}
