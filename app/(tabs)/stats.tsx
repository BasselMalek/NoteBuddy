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
import { getAdaptaiveTheme } from "@/constants/Colors";

export default function Account() {
    return (
        <PaperProvider theme={getAdaptaiveTheme()}>
            <View style={{ padding: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        marginBottom: 8,
                        paddingBottom: 0,
                        // // borderWidth: 1,
                        // // borderColor: "red",
                        alignItems: "flex-end",
                    }}
                >
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/profile-1605956841755-ce69927f3ccaimage",
                        }}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: "red",
                            marginRight: 15,
                        }}
                    />
                    <PaperText
                        style={{
                            fontFamily: "arial",
                            fontSize: 32,
                            // // borderWidth: 1,
                            // // borderColor: "red",
                            paddingBottom: 0,
                            // // marginBottom: -10,
                            lineHeight: 32,
                            textAlign: "left",
                        }}
                    >
                        Hi Bassel!
                    </PaperText>
                </View>
                <Card style={styles.card}>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <StreakFlame
                            level={0}
                            unfilled={getAdaptaiveTheme().colors.surfaceVariant}
                            filled={getAdaptaiveTheme().colors.tertiary}
                        ></StreakFlame>
                    </View>
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
                <Card style={{ ...styles.card, height: 200 }}>
                    <PaperText>GRAPH GOES HERE</PaperText>
                </Card>
                <Card style={styles.card}>
                    <ImageBackground
                        style={{
                            borderWidth: 7,
                        }}
                        source={require("../../assets/images/Melamine-wood-003.png")}
                    >
                        <ScrollView
                            horizontal
                            bounces={false}
                            style={{
                                flexDirection: "row",
                                height: 250,
                                padding: 10,
                            }}
                        >
                            <Image
                                source={require("../../assets/images/icon.png")}
                                style={{
                                    height: 220,
                                    width: 90,
                                    borderWidth: 10,
                                }}
                            />
                            <Image
                                source={require("../../assets/images/icon.png")}
                                style={{
                                    height: 220,
                                    width: 90,
                                    borderWidth: 10,
                                }}
                            />
                            <Image
                                source={require("../../assets/images/icon.png")}
                                style={{
                                    height: 220,
                                    width: 90,
                                    borderWidth: 10,
                                }}
                            />
                            <Image
                                source={require("../../assets/images/icon.png")}
                                style={{
                                    height: 220,
                                    width: 90,
                                    borderWidth: 10,
                                }}
                            />
                            <Image
                                source={require("../../assets/images/icon.png")}
                                style={{
                                    height: 220,
                                    width: 90,
                                    borderWidth: 10,
                                }}
                            />
                        </ScrollView>
                    </ImageBackground>
                </Card>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    card: {
        // // flex: 1,
        marginBottom: 8,
        padding: 8,
    },
    row: {
        flexDirection: "row",
        // // justifyContent: "space-between",
        gap: 75,
        marginBottom: 8,
    },
    item: {
        marginHorizontal: 8,
        marginBottom: 8,
    },
});
