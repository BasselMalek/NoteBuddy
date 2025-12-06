import { SQLiteDatabase } from "expo-sqlite";

export type EntryData = {
    date: Date;
    rating: number;
    duration: number;
    desc: string;
    title: string;
    streak: number;
};

export type AggregateResult = {
    date: string;
    rating?: number;
    duration?: number;
};

export const useEntryCRUD = (db: SQLiteDatabase) => {
    const calculateStreak = async (datestamp: Date): Promise<number> => {
        const yesterday = new Date(datestamp.getTime() - 24 * 3600 * 1000);
        const yesterdayString = yesterday.toISOString();
        const result = await db.getFirstAsync<{ streak: number }>(
            "SELECT streak FROM entries WHERE date = ?;",
            [yesterdayString]
        );
        return result ? result.streak + 1 : 1;
    };

    const addOrUpdateEntry = async (data: EntryData): Promise<number> => {
        const streak = await calculateStreak(data.date);
        const params = {
            $date: data.date.toISOString(),
            $title: data.title,
            $duration: data.duration,
            $rating: data.rating,
            $description: data.desc,
            $streak: streak,
        };
        const result = await db.runAsync(
            `INSERT OR REPLACE INTO entries (date, title, duration, rating, description, streak)
             VALUES ($date, $title, $duration, $rating, $description, $streak)`,
            params
        );
        return result.changes;
    };

    const getEntryByDate = async (date: Date): Promise<EntryData | null> => {
        const dateString = date.toISOString();
        const row = await db.getFirstAsync(
            "SELECT * FROM entries WHERE date = ?;",
            [dateString]
        );
        return row ? mapResToEntry(row) : null;
    };

    const aggregateDifficulty = async (
        startDate: Date,
        endDate: Date
    ): Promise<AggregateResult[]> => {
        const results = await db.getAllAsync<{ date: string; rating: number }>(
            "SELECT date, rating FROM entries WHERE date BETWEEN ? AND ? ORDER BY date ASC",
            [startDate.toISOString(), endDate.toISOString()]
        );
        return results;
    };

    const aggregateDuration = async (
        startDate: Date,
        endDate: Date
    ): Promise<AggregateResult[]> => {
        const results = await db.getAllAsync<{
            date: string;
            duration: number;
        }>(
            "SELECT date, duration FROM entries WHERE date BETWEEN ? AND ? ORDER BY date ASC",
            [startDate.toISOString(), endDate.toISOString()]
        );
        return results;
    };

    const countTotalDays = async (): Promise<{ days: number }> => {
        const result = await db.getFirstAsync<{ days: number }>(
            "SELECT COUNT(*) AS days FROM entries;"
        );
        return result || { days: 0 };
    };

    const getAll = async (): Promise<EntryData[]> => {
        const rows = await db.getAllAsync("SELECT * FROM entries;");
        return rows.map((val) => mapResToEntry(val));
    };

    return {
        getAll,
        addOrUpdateEntry,
        getEntryByDate,
        aggregateDifficulty,
        aggregateDuration,
        countTotalDays,
    };
};

export const mapResToEntry = (result: any): EntryData => ({
    date: new Date(result.date),
    title: result.title,
    duration: result.duration,
    rating: result.rating,
    desc: result.description,
    streak: result.streak,
});
