import * as SQL from "expo-sqlite";
import { EntryData } from "./Entry";

interface CRUDInterface {
    db: SQL.SQLiteDatabase;
    retrieveStatement: SQL.SQLiteStatement;
    createStatement: SQL.SQLiteStatement;
    updateStatement: SQL.SQLiteStatement;
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

async function createTable(CRUD: CRUDService) {
    try {
        CRUD!.db.execAsync(
            "CREATE TABLE IF NOT EXISTS entries (date DATE PRIMARY KEY, title TEXT,startTime TIME,endTime TIME,duration TEXT,rating INTEGER,description TEXT)"
        );
    } catch (error) {}
}

async function setupCRUDService(): Promise<CRUDService> {
    try {
        const db = await SQL.openDatabaseAsync("PracticeEntries.db");
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
        return null;
    }
}

async function queryRecord(CRUD: CRUDService, startDate: string): Promise<any> {
    if (CRUD != null) {
        try {
            const rows = await CRUD!.retrieveStatement.executeAsync({
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

async function mutateRecord(CRUD: CRUDService, data: EntryData) {
    if (CRUD != null) {
        // // if (data.submitAction === "add") {
        try {
            const affectedData = await CRUD!.createStatement.executeAsync(
                mapEntryToQuery(data)
            );
            return affectedData.getFirstAsync();
        } catch (error) {
            console.error(error);
        }
        // // } else {
        // //     try {
        // //         const affectedData = await CRUD!.updateStatement.executeAsync(
        // //             mapEntryToQuery(data)
        // //         );
        // //         return affectedData.getFirstAsync();
        // //     } catch (error) {
        // //         console.error(error);
        // //     }
        // // }
    } else {
        throw new Error("Invalid CRUDService.");
    }
}

async function DEBUG_SHOW_ALL(CRUD: CRUDService) {
    if (CRUD != null) {
        try {
            return await CRUD.db!.getAllAsync("SELECT * FROM entries;");
        } catch (error) {
            console.error(error);
        }
    } else {
        throw new Error("Invalid CRUDService.");
    }
}

export {
    CRUDService,
    setupCRUDService,
    queryRecord,
    mutateRecord,
    DEBUG_SHOW_ALL,
    createTable,
};
