import * as SQL from "expo-sqlite";
import { EntryData } from "@/components/Entry";
import React, {
    Context,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    async calcStreak(datestamp: Date) {
        if (this != null) {
            try {
                const check = new Date(datestamp.getTime() - 24 * 3600 * 1000);
                const row: { streak: number } | null =
                    await this.db.getFirstAsync(
                        "SELECT streak FROM entries where date = $date;",
                        check.toISOString().slice(0, 10)
                    );
                return row === null ? 0 : row!.streak + 1;
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new Error("Invalid CRUDService.");
        }
    }

    async countDays() {
        if (this != null) {
            try {
                const row: { days: number } | null =
                    await this.db.getFirstAsync(
                        "SELECT COUNT(*) AS days FROM entries;"
                    );
                return row;
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
                const str = await this.calcStreak(data.date);
                const affectedData = await this.createStatement.executeAsync(
                    mapEntryToQuery(data, str!)
                );
                return affectedData.changes;
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new Error("Invalid CRUDService.");
        }
    }
    async DEBUG_QUERY_ALL() {
        if (this != null) {
            try {
                return this.db.getAllAsync("SELECT * FROM entries;");
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new Error("Invalid CRUDService.");
        }
    }
    async endService() {
        this.db.closeAsync();
    }
}

type CRUDService = CRUDInterface | null;

const firstTimeSetup = async (database: string) => {
    try {
        const flag = await AsyncStorage.getItem("firstLaunch");
        if (flag != "true") {
            const db = await SQL.openDatabaseAsync("PracticeEntries.db");
            db.execAsync(
                "CREATE TABLE IF NOT EXISTS entries (date DATE PRIMARY KEY UNIQUE, title TEXT,startTime TIME,endTime TIME,duration TEXT,rating INTEGER,description TEXT, streak INTEGER)"
            );
            db.execAsync("PRAGMA journal_mode=WAL;");
            await AsyncStorage.setItem("firstLaunch", "true");
            console.log("first");
        }
    } catch (e) {
        console.error(e);
    }
};

const mapEntryToQuery = (entry: EntryData, streak: number) => ({
    $date: entry.date.toISOString().slice(0, 10),
    $title: entry.title,
    $startTime: entry.durationFrom.toISOString().slice(12, 19),
    $endTime: entry.durationTo.toISOString().slice(12, 19),
    $duration: entry.durationTime,
    $rating: entry.rating,
    $description: entry.desc,
    $streak: streak,
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
                "INSERT OR REPLACE INTO entries (date, title, startTime, endTime, duration, rating, description, streak) VALUES ($date, $title, $startTime, $endTime, $duration, $rating, $description, $streak)"
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
//TODO: Create an actual Context component for it to be an actually useful hook.

async function initializeCRUDService(database: string): Promise<CRUDService> {
    const serviceSetup = await setupCRUDService(database);
    if (
        serviceSetup.db &&
        serviceSetup.retrieveStatement &&
        serviceSetup.createStatement &&
        serviceSetup.updateStatement
    ) {
        return new CRUDInterface({
            db: serviceSetup.db,
            retrieveStatement: serviceSetup.retrieveStatement,
            createStatement: serviceSetup.createStatement,
            updateStatement: serviceSetup.updateStatement,
        });
    } else {
        return null;
    }
}

const ActiveCRUD = createContext<CRUDService>(null);

function useCRUDService(): CRUDService {
    return useContext(ActiveCRUD);
}

export {
    useCRUDService,
    CRUDService,
    initializeCRUDService,
    ActiveCRUD,
    mapResToEntry,
    firstTimeSetup,
};
