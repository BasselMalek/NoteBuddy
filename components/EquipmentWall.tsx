import { ScrollView, Image, ImageBackground } from "react-native";
import EquipmentPiece from "@/components/EquipmentPiece";
export default function EquipmentWall(props: { resource: any }) {
    return (
        <ImageBackground
            style={{
                borderTopWidth: 5,
                borderBottomWidth: 5,
            }}
            source={props.resource}
        >
            <ScrollView
                horizontal
                bounces={false}
                style={{
                    // // flexDirection: "row",
                    height: 375,
                    padding: 10,
                }}
            >
                <EquipmentPiece
                    resource={require("../assets/images/dev/8bit_allblack_tele.png")}
                    price={1}
                />
                <EquipmentPiece
                    resource={require("../assets/images/dev/8bit_butterscotch_tele.png")}
                    price={1}
                />
                <EquipmentPiece
                    resource={require("../assets/images/dev/8bit_sg.png")}
                    price={1}
                />
                <EquipmentPiece
                    resource={require("../assets/images/dev/8bit_sonicblue_strat.png")}
                    price={1}
                />
                <EquipmentPiece
                    resource={require("../assets/images/dev/8bit_sunburst_jag.png")}
                    price={1}
                />
            </ScrollView>
        </ImageBackground>
    );
}
