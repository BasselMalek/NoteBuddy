import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
function getAdaptaiveTheme() {
    return useColorScheme() === "dark" ? DarkTheme : LightTheme;
}

const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
        primary: "rgb(187, 195, 255)",
        onPrimary: "rgb(23, 38, 122)",
        primaryContainer: "rgb(49, 63, 146)",
        onPrimaryContainer: "rgb(222, 224, 255)",
        secondary: "rgb(184, 195, 255)",
        onSecondary: "rgb(17, 40, 120)",
        secondaryContainer: "rgb(44, 64, 144)",
        onSecondaryContainer: "rgb(221, 225, 255)",
        tertiary: "rgb(185, 195, 255)",
        onTertiary: "rgb(0, 34, 137)",
        tertiaryContainer: "rgb(4, 52, 190)",
        onTertiaryContainer: "rgb(221, 225, 255)",
        error: "rgb(255, 180, 171)",
        onError: "rgb(105, 0, 5)",
        errorContainer: "rgb(147, 0, 10)",
        onErrorContainer: "rgb(255, 180, 171)",
        background: "rgb(27, 27, 31)",
        onBackground: "rgb(228, 225, 230)",
        surface: "rgb(27, 27, 31)",
        onSurface: "rgb(228, 225, 230)",
        surfaceVariant: "rgb(70, 70, 79)",
        onSurfaceVariant: "rgb(199, 197, 208)",
        outline: "rgb(144, 144, 154)",
        outlineVariant: "rgb(70, 70, 79)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(228, 225, 230)",
        inverseOnSurface: "rgb(48, 48, 52)",
        inversePrimary: "rgb(73, 87, 171)",
        elevation: {
            level0: "transparent",
            level1: "rgb(35, 35, 42)",
            level2: "rgb(40, 40, 49)",
            level3: "rgb(45, 46, 56)",
            level4: "rgb(46, 47, 58)",
            level5: "rgb(49, 51, 62)",
        },
        surfaceDisabled: "rgba(228, 225, 230, 0.12)",
        onSurfaceDisabled: "rgba(228, 225, 230, 0.38)",
        backdrop: "rgba(47, 48, 56, 0.4)",
    },
};

const LightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: "rgb(73, 87, 171)",
        onPrimary: "rgb(255, 255, 255)",
        primaryContainer: "rgb(222, 224, 255)",
        onPrimaryContainer: "rgb(0, 15, 93)",
        secondary: "rgb(70, 89, 169)",
        onSecondary: "rgb(255, 255, 255)",
        secondaryContainer: "rgb(221, 225, 255)",
        onSecondaryContainer: "rgb(0, 19, 85)",
        tertiary: "rgb(48, 80, 214)",
        onTertiary: "rgb(255, 255, 255)",
        tertiaryContainer: "rgb(221, 225, 255)",
        onTertiaryContainer: "rgb(0, 18, 87)",
        error: "rgb(186, 26, 26)",
        onError: "rgb(255, 255, 255)",
        errorContainer: "rgb(255, 218, 214)",
        onErrorContainer: "rgb(65, 0, 2)",
        background: "rgb(255, 251, 255)",
        onBackground: "rgb(27, 27, 31)",
        surface: "rgb(255, 251, 255)",
        onSurface: "rgb(27, 27, 31)",
        surfaceVariant: "rgb(227, 225, 236)",
        onSurfaceVariant: "rgb(70, 70, 79)",
        outline: "rgb(118, 118, 128)",
        outlineVariant: "rgb(199, 197, 208)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(48, 48, 52)",
        inverseOnSurface: "rgb(243, 240, 244)",
        inversePrimary: "rgb(187, 195, 255)",
        elevation: {
            level0: "transparent",
            level1: "rgb(246, 243, 251)",
            level2: "rgb(240, 238, 248)",
            level3: "rgb(235, 233, 246)",
            level4: "rgb(233, 231, 245)",
            level5: "rgb(230, 228, 243)",
        },
        surfaceDisabled: "rgba(27, 27, 31, 0.12)",
        onSurfaceDisabled: "rgba(27, 27, 31, 0.38)",
        backdrop: "rgba(47, 48, 56, 0.4)",
    },
};

export { LightTheme, DarkTheme, getAdaptaiveTheme };
