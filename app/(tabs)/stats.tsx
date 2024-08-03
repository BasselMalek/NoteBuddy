import {
    Text as PaperText,
    Card,
    Avatar,
    PaperProvider,
} from "react-native-paper";
import {
    View,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Text,
    Image,
} from "react-native";
import EquipmentWall from "@/components/EquipmentWall";
import { getAdaptaiveTheme } from "@/constants/Colors";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import StreakCircle from "@/components/StreakCircle";
export default function Account() {
    const safeInsets = useSafeAreaInsets();
    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
            <View
                style={{
                    flex: 1,
                    paddingTop: safeInsets.top + 5,
                    paddingBottom: safeInsets.bottom,
                    paddingRight: safeInsets.right,
                    paddingLeft: safeInsets.left,
                }}
            >
                <View style={styles.rootContainer}>
                    <Card
                        style={{
                            ...styles.card,
                            flex: 2,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    flex: 2,
                                    alignItems: "flex-start",
                                }}
                            >
                                <PaperText
                                    style={{
                                        ...styles.item,
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    {"Days Practiced"}
                                </PaperText>
                                <PaperText
                                    style={{
                                        ...styles.item,
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    {"Avg. duration"}
                                </PaperText>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                }}
                            >
                                <StreakCircle
                                    level={1}
                                    filled={getAdaptaiveTheme().colors.tertiary}
                                    unfilled={
                                        getAdaptaiveTheme().colors
                                            .surfaceVariant
                                    }
                                ></StreakCircle>
                            </View>
                            <View
                                style={{
                                    flex: 2,
                                    alignItems: "flex-end",
                                    // // alignItems: "center",
                                }}
                            >
                                <PaperText
                                    style={{
                                        ...styles.item,
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    {"Longest Streak"}
                                </PaperText>
                                <PaperText
                                    style={{
                                        ...styles.item,
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    Avg. Difficulty
                                </PaperText>
                            </View>
                        </View>
                    </Card>
                    <Card style={{ ...styles.card, flex: 3 }}>
                        <PaperText>GRAPH GOES HERE</PaperText>
                    </Card>
                    <Card style={{ ...styles.card, flex: 6 }}>
                        <EquipmentWall
                            resource={require("../../assets/images/Melamine-wood-004.png")}
                        ></EquipmentWall>
                    </Card>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 5,
        rowGap: 5,
    },
    card: {
        padding: 5,
    },
    row: {
        flexDirection: "row",
        marginBottom: 8,
        justifyContent: "center",
    },
    item: {
        marginHorizontal: 5,
        marginBottom: 5,
    },
});
