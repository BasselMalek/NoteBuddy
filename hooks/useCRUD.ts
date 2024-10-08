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
import { usePoints } from "@/hooks/usePracticePoints";

interface MusicianUser {
    name: string;
    points: number;
    currentStreak: number;
    longestStreak: number;
    ownedEquipmentIds: string[];
}

async function storeUser(updatedInfo: {
    name?: string;
    points: number;
    currentStreak: number;
    ownedEquipmentIds?: string[];
}): Promise<boolean> {
    try {
        const unedited = await readUser();
        const serialized = JSON.stringify({
            name: updatedInfo.name || unedited?.name,
            points: (unedited?.points || 0) + updatedInfo.points,
            currentStreak: updatedInfo.currentStreak,
            longestStreak: Math.max(
                unedited?.longestStreak || 0,
                updatedInfo.currentStreak
            ),
        });
        await AsyncStorage.setItem("MainUser", serialized);
        return true;
    } catch (error) {
        return false;
    }
}
async function readUser(): Promise<MusicianUser | null> {
    try {
        const unparsed = await AsyncStorage.getItem("MainUser");
        return JSON.parse(unparsed!);
    } catch (error) {
        return null;
    }
}

class CRUDInterface {
    private db: SQL.SQLiteDatabase;
    private retrieveStatement: SQL.SQLiteStatement;
    private createStatement: SQL.SQLiteStatement;
    private aggergateDiffStatement: SQL.SQLiteStatement;
    private aggergateDurStatement: SQL.SQLiteStatement;

    constructor(props: {
        db: SQL.SQLiteDatabase;
        retrieveStatement: SQL.SQLiteStatement;
        createStatement: SQL.SQLiteStatement;
        aggergateDiffStatement: SQL.SQLiteStatement;
        aggergateDurStatement: SQL.SQLiteStatement;
    }) {
        this.db = props.db;
        this.retrieveStatement = props.retrieveStatement;
        this.createStatement = props.createStatement;
        this.aggergateDiffStatement = props.aggergateDiffStatement;
        this.aggergateDurStatement = props.aggergateDurStatement;
    }

    async createTable() {
        try {
            this.db.execAsync(
                "CREATE TABLE IF NOT EXISTS entries (date DATE PRIMARY KEY, title TEXT,startTime TIME,endTime TIME,duration INTEGER,rating INTEGER,description TEXT)"
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
    async aggregateDiff(startDate?: Date, endDate?: Date): Promise<any> {
        if (this != null) {
            try {
                const rows = await this.aggergateDiffStatement.executeAsync({
                    $startdate:
                        startDate != undefined
                            ? startDate.toISOString().slice(0, 10)
                            : "1970-01-01",
                    $enddate:
                        endDate != undefined
                            ? endDate.toISOString().slice(0, 10)
                            : "2038-01-18",
                });
                return rows.getAllAsync();
            } catch (error) {
                console.error(error);
            }
        } else {
            throw new Error("Invalid CRUDService.");
        }
    }
    async aggregateDur(startDate?: Date, endDate?: Date): Promise<any> {
        if (this != null) {
            try {
                const rows = await this.aggergateDurStatement.executeAsync({
                    $startdate:
                        startDate != undefined
                            ? startDate.toISOString().slice(0, 10)
                            : "1970-01-01",
                    $enddate:
                        endDate != undefined
                            ? endDate.toISOString().slice(0, 10)
                            : "2038-01-18",
                });
                return rows.getAllAsync();
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
                await storeUser({
                    points: usePoints(data.durationTime, data.rating, str!),
                    currentStreak: str!,
                });
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

const firstTimeSetup = async (database: string): Promise<boolean> => {
    try {
        const flag = await AsyncStorage.getItem("firstLaunch");
        if (flag != "true") {
            const db = await SQL.openDatabaseAsync("PracticeEntries.db");
            db.execAsync(
                "CREATE TABLE IF NOT EXISTS entries (date DATE PRIMARY KEY UNIQUE, title TEXT,startTime TIME,endTime TIME,duration INTEGER,rating INTEGER,description TEXT, streak INTEGER)"
            );
            db.execAsync("PRAGMA journal_mode=WAL;");
            await AsyncStorage.setItem("firstLaunch", "true");
            return true;
        }
        return false;
    } catch (e) {
        return false;
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
            durationTime: 0,
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
    aggergateDiffStatement?: SQL.SQLiteStatement;
    aggergateDurStatement?: SQL.SQLiteStatement;
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
            aggergateDiffStatement: await db.prepareAsync(
                "SELECT date, rating from entries WHERE date BETWEEN $startdate AND $enddate"
            ),
            aggergateDurStatement: await db.prepareAsync(
                "SELECT date, duration from entries WHERE date BETWEEN $startdate AND $enddate"
            ),
        };
    } catch (error) {
        console.error(error);
        return {};
    }
}

async function initializeCRUDService(database: string): Promise<CRUDService> {
    const serviceSetup = await setupCRUDService(database);
    if (
        serviceSetup.db &&
        serviceSetup.retrieveStatement &&
        serviceSetup.createStatement &&
        serviceSetup.aggergateDiffStatement &&
        serviceSetup.aggergateDurStatement
    ) {
        return new CRUDInterface({
            db: serviceSetup.db,
            retrieveStatement: serviceSetup.retrieveStatement,
            createStatement: serviceSetup.createStatement,
            aggergateDiffStatement: serviceSetup.aggergateDiffStatement,
            aggergateDurStatement: serviceSetup.aggergateDurStatement,
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
    readUser,
    storeUser,
    MusicianUser,
};
