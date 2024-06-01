import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function IconButton({ onPress, icon }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <MaterialCommunityIcons
                size={40}
                name={icon}
            ></MaterialCommunityIcons>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#FFDDAA",
        borderRadius: 100,
        padding: 7,
    },
});
