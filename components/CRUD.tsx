import * as SQL from "expo-sqlite";

interface CRUDInterface {
    db: SQL.SQLiteDatabase;
    retrieveStatement: SQL.SQLiteStatement;
    createStatement: SQL.SQLiteStatement;
    updateStatement: SQL.SQLiteStatement;
}

type CRUDService = CRUDInterface | null;

async function setupCRUDService(): Promise<CRUDService> {
    try {
        const db = await SQL.openDatabaseAsync("PracticeEntries.db");
        return {
            db,
            retrieveStatement: await db.prepareAsync(
                "SELECT date, title, startTime, endTime, duration, rating, description FROM entries WHERE date = $startDate"
            ),
            createStatement: await db.prepareAsync(
                "INSERT INTO entries (date, title, startTime, endTime, duration, rating, description) VALUES (?, ?, ?, ?, ?, ?, ?)"
            ),
            updateStatement: await db.prepareAsync(
                "UPDATE entries SET title = ?, startTime = ?, endTime = ?, duration = ?, rating = ?, description = ? WHERE date = ?"
            ),
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function retrieve(CRUD: CRUDService, startDate: string): Promise<any> {
    if (CRUD != null) {
        try {
            const rows = await CRUD!.retrieveStatement.executeAsync({
                $startDate: startDate,
            });
            return await rows.getFirstAsync();
        } catch (error) {
            console.error(error);
        }
    } else {
        throw new Error("Invalid CRUDService.");
    }
}

export { CRUDService, setupCRUDService, retrieve };
