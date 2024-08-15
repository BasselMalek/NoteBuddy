import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    View,
    Image,
    TouchableOpacity,
    ImageSourcePropType,
} from "react-native";
import { Text as PaperText } from "react-native-paper";
import { Shadow } from "react-native-shadow-2";

export default function EquipmentPiece(props: {
    resource: ImageSourcePropType | undefined;
    price: number;
}) {
    return (
        <View
            style={{
                flex: 1,
                height: 355,
                width: 100,
                flexDirection: "column",
                marginHorizontal: 20,
            }}
        >
            <Image
                source={props.resource}
                resizeMode="contain"
                style={{
                    height: 300,
                    width: 100,
                    marginBottom: 5,
                }}
            />
            <PaperText
                style={{ textAlign: "center" }}
            >{`${props.price} pts`}</PaperText>
            <TouchableOpacity
                onPress={() => {
                    console.log("test");
                }}
            >
                <MaterialCommunityIcons
                    style={{ alignSelf: "center" }}
                    name="information-outline"
                    size={18}
                    color={"white"}
                />
            </TouchableOpacity>
        </View>
    );
}
