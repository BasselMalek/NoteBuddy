import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, ViewBase, StyleProp, StyleSheet } from "react-native";
import {
    PaperProvider,
    useTheme,
    Text as PaperText,
    Card,
    FAB,
    TextInput,
} from "react-native-paper";
import { DarkTheme } from "@/constants/Colors";
import { useState } from "react";
import RatingSelector from "@/components/RatingSelector";

export default function Entry(props: {
    isExpanded: boolean;
    style?: StyleProp<View>;
    entryDate: boolean;
}) {
    const [editingActive, setEditingActive] = useState(false);
    const [rating, setRating] = useState(2);
    if (props.entryDate) {
        if (editingActive) {
            return (
                <PaperProvider theme={DarkTheme}>
                    <Card style={styles.expandedCard}>
                        <TextInput mode="outlined" label={"Title"}></TextInput>
                        <RatingSelector
                            ratingState={5}
                            starColor={DarkTheme.colors.secondary}
                        ></RatingSelector>
                        <PaperText
                            variant="titleSmall"
                            style={{
                                fontWeight: "thin",
                                fontStyle: "italic",
                            }}
                        >
                            2hrs 5m
                        </PaperText>
                        <TextInput
                            mode="outlined"
                            label={"Entry"}
                            numberOfLines={100}
                            multiline={true}
                            contentStyle={{ height: 400 }}
                        ></TextInput>
                        <FAB icon={"pencil"} style={styles.fab}></FAB>
                    </Card>
                </PaperProvider>
            );
        } else {
            return (
                <PaperProvider theme={DarkTheme}>
                    <Card style={styles.expandedCard}>
                        <PaperText
                            variant="titleLarge"
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            Today's Entry
                        </PaperText>
                        <PaperText
                            style={{
                                fontWeight: "thin",
                                fontStyle: "italic",
                            }}
                        >
                            ⭐⭐⭐⭐⭐
                        </PaperText>
                        <PaperText
                            variant="titleSmall"
                            style={{
                                fontWeight: "thin",
                                fontStyle: "italic",
                            }}
                        >
                            2hrs 5m
                        </PaperText>
                        <PaperText style={{ paddingVertical: 30 }}>
                            Mollit mollit consequat aliqua aliquip officia nisi
                            aute. Nostrud sint amet nisi veniam veniam enim et
                            proident consectetur cillum do. Occaecat non laboris
                            irure dolore dolor velit laboris qui ea nisi
                            incididunt.
                        </PaperText>
                        <FAB
                            icon={"pencil"}
                            style={styles.fab}
                            onPress={() => {
                                setEditingActive(true);
                            }}
                        ></FAB>
                    </Card>
                </PaperProvider>
            );
        }
    } else {
        return (
            <PaperProvider theme={DarkTheme}>
                <Card style={styles.expandedCard}>
                    <PaperText>No entry for today.</PaperText>
                    <FAB
                        icon={"plus"}
                        style={styles.fab}
                        onPress={() => {
                            setEditingActive(false);
                        }}
                    ></FAB>
                </Card>
            </PaperProvider>
        );
    }
}

const styles = StyleSheet.create({
    expandedCard: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 34,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: -15,
        top: 600,
    },
});
