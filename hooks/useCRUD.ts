import * as SQL from "expo-sqlite";
import { EntryData } from "@/components/Entry";
import { useEffect, useState } from "react";

class CRUDInterface {
    private db: SQL.SQLiteDatabase;
    private retrieveStatement: SQL.SQLiteStatement;
    private createStatement: SQL.SQLiteStatement;
    private updateStatement: SQL.SQLiteStatement;

    constructor(props: {
        db: SQL.SQLiteDatabase;
        retrieveStatement: SQL.SQLiteStatement;
        createStatement: SQL.SQLiteStatement;
        updateStatement: SQL.SQLiteStatement;
    }) {
        this.db = props.db;
        this.retrieveStatement = props.retrieveStatement;
        this.createStatement = props.createStatement;
        this.updateStatement = props.updateStatement;
    }

    async createTable() {
        try {
            this.db.execAsync(
                "CREATE TABLE IF NOT EXISTS entries (date DATE PRIMARY KEY, title TEXT,startTime TIME,endTime TIME,duration TEXT,rating INTEGER,description TEXT)"
            );
        } catch (error) {}
    }

    async queryRecord(startDate: string): Promise<any> {
        if (this != null) {
            try {
                const rows = await this.retrieveStatement.executeAsync({
                    $startDate: startDate,
                });
                return rows.getFirstAsync();
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new Error("Invalid CRUDService.");
        }
    }

    async mutateRecord(data: EntryData) {
        if (this != null) {
            try {
                const affectedData = await this.createStatement.executeAsync(
                    mapEntryToQuery(data)
                );
                return affectedData.getFirstAsync();
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new Error("Invalid CRUDService.");
        }
    }
}

type CRUDService = CRUDInterface | null;

const mapEntryToQuery = (entry: EntryData) => ({
    $date: entry.date.toISOString().slice(0, 10).replace("T", " "),
    $title: entry.title,
    $startTime: entry.durationFrom.toISOString().slice(12, 19),
    $endTime: entry.durationTo.toISOString().slice(12, 19),
    $duration: entry.durationTime,
    $rating: entry.rating,
    $description: entry.desc,
});

const mapResToEntry = (result: any | null, timestamp: Date): EntryData => {
    if (result === null) {
        return {
            date: timestamp,
            title: "",
            rating: 0,
            desc: "",
            durationFrom: timestamp,
            durationTo: timestamp,
            durationTime: "",
            submit: false,
            submitAction: "add",
        };
    } else {
        return {
            date: new Date(result.date),
            title: result.title,
            durationTime: result.duration,
            durationFrom: new Date(`${result.date}T${result.startTime}`),
            durationTo: new Date(`${result.date}T${result.endTime}`),
            rating: result.rating,
            desc: result.description,
            submitAction: "update",
            submit: false,
        };
    }
};

async function setupCRUDService(database: string): Promise<{
    db?: SQL.SQLiteDatabase;
    retrieveStatement?: SQL.SQLiteStatement;
    createStatement?: SQL.SQLiteStatement;
    updateStatement?: SQL.SQLiteStatement;
}> {
    try {
        const db = await SQL.openDatabaseAsync(database);
        return {
            db,
            retrieveStatement: await db.prepareAsync(
                "SELECT date, title, startTime, endTime, duration, rating, description FROM entries WHERE date = $startDate;"
            ),
            createStatement: await db.prepareAsync(
                "INSERT OR REPLACE INTO entries (date, title, startTime, endTime, duration, rating, description) VALUES ($date, $title, $startTime, $endTime, $duration, $rating, $description) RETURNING *"
            ),
            updateStatement: await db.prepareAsync(
                "UPDATE entries SET title = $title, startTime = $startTime, endTime = $endTime, duration = $duration, rating = $rating, description = $description WHERE date = $date RETURNING *"
            ),
        };
    } catch (error) {
        console.error(error);
        return {};
    }
}

function useCRUDService(database: string): CRUDService {
    const [crudService, setCrudService] = useState<CRUDService>(null);

    useEffect(() => {
        async function initialize() {
            const serviceSetup = await setupCRUDService(database);
            if (
                serviceSetup.db &&
                serviceSetup.retrieveStatement &&
                serviceSetup.createStatement &&
                serviceSetup.updateStatement
            ) {
                setCrudService(
                    new CRUDInterface({
                        db: serviceSetup.db,
                        retrieveStatement: serviceSetup.retrieveStatement,
                        createStatement: serviceSetup.createStatement,
                        updateStatement: serviceSetup.updateStatement,
                    })
                );
            }
        }
        initialize();
    }, [database]);

    return crudService;
}

export { useCRUDService, mapResToEntry };
