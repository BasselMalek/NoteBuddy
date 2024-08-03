import { ActiveCRUD, CRUDService } from "@/hooks/useCRUD";
import { Context } from "react";

export default function CRUDProvider(props: {
    children: React.ReactNode;
    value: CRUDService;
}) {
    return (
        <ActiveCRUD.Provider value={props.value}>
            {props.children}
        </ActiveCRUD.Provider>
    );
}
