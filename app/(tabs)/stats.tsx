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
import StreakFlame from "@/components/StreakFlame";
import EquipmentWall from "@/components/EquipmentWall";
import { getAdaptaiveTheme } from "@/constants/Colors";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
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
                    <Card style={{ ...styles.card, flex: 2 }}>
                        <StreakFlame
                            level={1}
                            unfilled={getAdaptaiveTheme().colors.surfaceVariant}
                            filled={getAdaptaiveTheme().colors.tertiary}
                        ></StreakFlame>
                        <View style={styles.row}>
                            <View>
                                <PaperText style={styles.item}>
                                    Total practice days: 1
                                </PaperText>
                                <PaperText style={styles.item}>
                                    Avg. duration: 2.6hrs
                                </PaperText>
                            </View>
                            <View>
                                <PaperText style={styles.item}>
                                    Longest Streak: 10
                                </PaperText>
                                <PaperText style={styles.item}>
                                    Avg. Diff: 4.3/5
                                </PaperText>
                            </View>
                        </View>
                    </Card>
                    <Card style={{ ...styles.card, flex: 3 }}>
                        <PaperText>GRAPH GOES HERE</PaperText>
                    </Card>
                    <Card style={{ ...styles.card, flex: 6 }}>
                        <EquipmentWall
                            resource={require("../../assets/images/Melamine-wood-003.png")}
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
        gap: 80,
        marginBottom: 8,
    },
    item: {
        marginHorizontal: 5,
        marginBottom: 5,
    },
});
