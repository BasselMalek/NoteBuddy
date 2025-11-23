import * as SQL from "expo-sqlite";

export type EntryData = {
    date: Date;
    rating: number;
    duration: number;
    desc: string;
    title: string;
    streak: number;
};

export const useEntryCRUD = (db: SQL.SQLiteDatabase) => {
    const calculateStreak = async (datestamp: Date) => {
        try {
            const yesterday = new Date(datestamp.getTime() - 24 * 3600 * 1000);
            const yesterdayString = yesterday.toISOString().slice(0, 10);

            const result = await db.getFirstAsync<{ streak: number }>(
                "SELECT streak FROM entries WHERE date = ?;",
                [yesterdayString]
            );

            return result ? result.streak + 1 : 1;
        } catch (error) {
            console.error("Failed to calculate streak:", error);
            return 0;
        }
    };

    const addOrUpdateEntry = async (data: EntryData) => {
        try {
            const streak = await calculateStreak(data.date);
            const params = {
                $date: data.date.toISOString().slice(0, 10),
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
        } catch (error) {
            console.error("Failed to add or update entry:", error);
        }
    };

    const getEntryByDate = async (date: Date) => {
        try {
            const dateString = date.toISOString().slice(0, 10);
            const row = await db.getFirstAsync(
                "SELECT * FROM entries WHERE date = ?;",
                [dateString]
            );
            return mapResToEntry(row);
        } catch (error) {
            console.error("Failed to get entry by date:", error);
        }
    };

    const aggregateDifficulty = async (startDate: Date, endDate: Date) => {
        try {
            return await db.getAllAsync<{ date: string; rating: number }>(
                "SELECT date, rating FROM entries WHERE date BETWEEN ? AND ? ORDER BY date ASC",
                [
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10),
                ]
            );
        } catch (error) {
            console.error("Failed to aggregate difficulty:", error);
            return [];
        }
    };

    const aggregateDuration = async (startDate: Date, endDate: Date) => {
        try {
            return await db.getAllAsync<{ date: string; duration: number }>(
                "SELECT date, duration FROM entries WHERE date BETWEEN ? AND ? ORDER BY date ASC",
                [
                    startDate.toISOString().slice(0, 10),
                    endDate.toISOString().slice(0, 10),
                ]
            );
        } catch (error) {
            console.error("Failed to aggregate duration:", error);
            return [];
        }
    };

    const countTotalDays = async () => {
        try {
            const result = await db.getFirstAsync<{ days: number }>(
                "SELECT COUNT(*) AS days FROM entries;"
            );
            return result || { days: 0 };
        } catch (error) {
            console.error("Failed to count days:", error);
            return { days: 0 };
        }
    };

    const getAll = async (): Promise<EntryData[]> => {
        try {
            const rows = await db.getAllAsync("SELECT * FROM entries;");
            return rows.map((val) => mapResToEntry(val));
        } catch (error) {
            console.error("Failed to get entries:", error);
        }
        return [];
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
