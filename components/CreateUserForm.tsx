import { useState } from "react";
import { View } from "react-native";
import { Modal, Text, TextInput, FAB } from "react-native-paper";

export default function CreateUserForm(props: { handler: Function }) {
    const [name, setName] = useState("");
    return (
        <>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{"Hi!"}</Text>
            <Text style={{ fontSize: 14 }}>{"Let's create your profile."}</Text>
            <TextInput
                onChangeText={(input) => {
                    setName(input);
                }}
                mode="outlined"
                label={"Name"}
            ></TextInput>
            <FAB
                icon={"check"}
                style={{ alignSelf: "flex-end", marginTop: 10 }}
                onPress={() => {
                    props.handler(name);
                }}
            ></FAB>
        </>
    );
}
