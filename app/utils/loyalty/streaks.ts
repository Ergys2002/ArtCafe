/**
 * User streak management
 * For tracking consecutive purchase days and awarding bonus points
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculatePoints } from "./points";

// Keys for AsyncStorage for streak tracking
const USER_STREAK_KEY = "@CoffeeApp:userStreak";
const LAST_PURCHASE_DATE_KEY = "@CoffeeApp:lastPurchaseDate";

// Streak thresholds and multipliers
export const STREAK_LEVELS = [
    { days: 1, multiplier: 1.0, name: "Regular" }, // Base level
    { days: 3, multiplier: 1.2, name: "Bronze" }, // 3-day streak: 20% bonus
    { days: 5, multiplier: 1.5, name: "Silver" }, // 5-day streak: 50% bonus
    { days: 7, multiplier: 2.0, name: "Gold" }, // 7-day streak: 100% bonus
    { days: 14, multiplier: 2.5, name: "Platinum" }, // 14-day streak: 150% bonus
];

/**
 * Get current user streak data
 * @returns Promise with the current user streak
 */
export const getUserStreak = async (): Promise<{
    days: number;
    lastPurchaseDate: string | null;
}> => {
    try {
        const streakDaysStr = await AsyncStorage.getItem(USER_STREAK_KEY);
        const lastPurchaseDate = await AsyncStorage.getItem(
            LAST_PURCHASE_DATE_KEY
        );

        const streakDays = streakDaysStr ? parseInt(streakDaysStr, 10) : 0;

        return {
            days: streakDays,
            lastPurchaseDate,
        };
    } catch (error) {
        console.error("Error getting user streak:", error);
        return { days: 0, lastPurchaseDate: null };
    }
};

/**
 * Update user streak based on current purchase
 * @returns Promise with the updated streak data
 */
export const updateUserStreak = async (): Promise<{
    days: number;
    multiplier: number;
    levelName: string;
    isNewLevel: boolean;
}> => {
    try {
        // Get current streak info
        const { days: currentStreak, lastPurchaseDate } = await getUserStreak();

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison

        const todayStr = today.toISOString();

        // Check if last purchase was yesterday
        let newStreak = 1; // Default to 1 if no streak or streak broken
        let isNewLevel = false;

        if (lastPurchaseDate) {
            const lastPurchaseDay = new Date(lastPurchaseDate);
            lastPurchaseDay.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // If last purchase was yesterday, increase streak
            if (lastPurchaseDay.getTime() === yesterday.getTime()) {
                newStreak = currentStreak + 1;

                // Check if user reached a new streak level
                for (const level of STREAK_LEVELS) {
                    if (newStreak === level.days) {
                        isNewLevel = true;
                        break;
                    }
                }
            }
            // If purchase was today already, keep current streak
            else if (lastPurchaseDay.getTime() === today.getTime()) {
                newStreak = currentStreak;
            }
        }

        // Save updated streak
        await AsyncStorage.setItem(USER_STREAK_KEY, newStreak.toString());
        await AsyncStorage.setItem(LAST_PURCHASE_DATE_KEY, todayStr);

        // Find current streak level
        const currentLevel = STREAK_LEVELS.reduce((highest, level) => {
            if (newStreak >= level.days && level.days >= highest.days) {
                return level;
            }
            return highest;
        }, STREAK_LEVELS[0]);

        return {
            days: newStreak,
            multiplier: currentLevel.multiplier,
            levelName: currentLevel.name,
            isNewLevel,
        };
    } catch (error) {
        console.error("Error updating user streak:", error);
        return {
            days: 1,
            multiplier: STREAK_LEVELS[0].multiplier,
            levelName: STREAK_LEVELS[0].name,
            isNewLevel: false,
        };
    }
};

/**
 * Calculate points with streak multiplier
 * @param price - Purchase price
 * @returns Promise with earned points including streak bonus
 */
export const calculateStreakPoints = async (
    price: number
): Promise<{
    basePoints: number;
    streakMultiplier: number;
    totalPoints: number;
    streakDays: number;
    streakLevel: string;
    isNewLevel: boolean;
}> => {
    // Calculate base points
    const basePoints = calculatePoints(price);

    // Get streak info and multiplier
    const { days, multiplier, levelName, isNewLevel } =
        await updateUserStreak();

    // Calculate total points with streak bonus
    const totalPoints = Math.round(basePoints * multiplier);

    return {
        basePoints,
        streakMultiplier: multiplier,
        totalPoints,
        streakDays: days,
        streakLevel: levelName,
        isNewLevel,
    };
};
