/**
 * User points management
 * Centralized functions for tracking, adding, and redeeming user loyalty points
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculatePoints } from "./points";
import { calculateStreakPoints, getUserStreak, STREAK_LEVELS } from "./streaks";

// Keys for AsyncStorage
const POINTS_STORAGE_KEY = "@CoffeeApp:userPoints";
const POINTS_HISTORY_KEY = "@CoffeeApp:pointsHistory";

// Default starting points
const DEFAULT_POINTS = 0;

/**
 * PointsTransaction - represents a points transaction (earning or redeeming)
 */
export interface PointsTransaction {
    id: string;
    date: string;
    amount: number; // positive for earned, negative for redeemed
    description: string;
    productId?: string;
    productName?: string;
    streakBonus?: number; // Additional streak bonus points
    streakMultiplier?: number; // Multiplier applied due to streak
    streakLevel?: string; // Current streak level name
}

/**
 * Get current user points
 * @returns Promise with the current user points
 */
export const getUserPoints = async (): Promise<number> => {
    try {
        const pointsString = await AsyncStorage.getItem(POINTS_STORAGE_KEY);
        return pointsString ? parseInt(pointsString, 10) : DEFAULT_POINTS;
    } catch (error) {
        console.error("Error getting user points:", error);
        return DEFAULT_POINTS;
    }
};

/**
 * Add points to user's account
 * @param points - Points to add
 * @param description - Description of why points were added
 * @param productDetails - Optional details about the product purchased
 * @param streakDetails - Optional details about streak bonus
 * @returns Promise with the updated points total
 */
export const addPoints = async (
    points: number,
    description: string,
    productDetails?: { id: string; name: string },
    streakDetails?: {
        streakBonus: number;
        streakMultiplier: number;
        streakLevel: string;
    }
): Promise<number> => {
    try {
        // Get current points
        const currentPoints = await getUserPoints();
        const newTotal = currentPoints + points;

        // Save updated points
        await AsyncStorage.setItem(POINTS_STORAGE_KEY, newTotal.toString());

        // Add to history
        await addToPointsHistory({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            amount: points,
            description,
            productId: productDetails?.id,
            productName: productDetails?.name,
            streakBonus: streakDetails?.streakBonus,
            streakMultiplier: streakDetails?.streakMultiplier,
            streakLevel: streakDetails?.streakLevel,
        });

        return newTotal;
    } catch (error) {
        console.error("Error adding points:", error);
        return await getUserPoints();
    }
};

/**
 * Redeem points from user's account
 * @param points - Points to redeem
 * @param description - Description of redemption
 * @returns Promise with the updated points total, or null if insufficient points
 */
export const redeemPoints = async (
    points: number,
    description: string
): Promise<number | null> => {
    try {
        // Get current points
        const currentPoints = await getUserPoints();

        // Check if user has enough points
        if (currentPoints < points) {
            return null;
        }

        const newTotal = currentPoints - points;

        // Save updated points
        await AsyncStorage.setItem(POINTS_STORAGE_KEY, newTotal.toString());

        // Add to history
        await addToPointsHistory({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            amount: -points, // Negative for redemption
            description,
        });

        return newTotal;
    } catch (error) {
        console.error("Error redeeming points:", error);
        return await getUserPoints();
    }
};

/**
 * Get user's points history
 * @returns Promise with array of point transactions
 */
export const getPointsHistory = async (): Promise<PointsTransaction[]> => {
    try {
        const historyString = await AsyncStorage.getItem(POINTS_HISTORY_KEY);
        return historyString ? JSON.parse(historyString) : [];
    } catch (error) {
        console.error("Error getting points history:", error);
        return [];
    }
};

/**
 * Add a transaction to points history
 * @param transaction - The transaction to add
 */
const addToPointsHistory = async (
    transaction: PointsTransaction
): Promise<void> => {
    try {
        // Get current history
        const history = await getPointsHistory();

        // Add new transaction at the beginning
        history.unshift(transaction);

        // Save updated history
        await AsyncStorage.setItem(POINTS_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Error adding to points history:", error);
    }
};

/**
 * Calculate and award points for a purchase with streak bonus
 * @param purchaseAmount - The total purchase amount
 * @param description - Description of the purchase
 * @param productDetails - Optional details about the product
 * @returns Promise with the points earned and new total
 */
export const awardPointsForPurchase = async (
    purchaseAmount: number,
    description: string,
    productDetails?: { id: string; name: string }
): Promise<{
    pointsEarned: number;
    newTotal: number;
    streakDays: number;
    streakLevel: string;
    streakMultiplier: number;
    basePoints: number;
    bonusPoints: number;
    isNewStreakLevel: boolean;
}> => {
    // Calculate points with streak bonus
    const {
        basePoints,
        streakMultiplier,
        totalPoints,
        streakDays,
        streakLevel,
        isNewLevel,
    } = await calculateStreakPoints(purchaseAmount);

    // Calculate bonus points
    const bonusPoints = totalPoints - basePoints;

    // Add description about streak if applicable
    let enhancedDescription = description;
    if (streakMultiplier > 1) {
        enhancedDescription = `${description} (${streakLevel} streak: ${streakMultiplier}x bonus)`;
    }

    // Add points to user's account with streak info
    const newTotal = await addPoints(
        totalPoints,
        enhancedDescription,
        productDetails,
        {
            streakBonus: bonusPoints,
            streakMultiplier,
            streakLevel,
        }
    );

    return {
        pointsEarned: totalPoints,
        newTotal,
        streakDays,
        streakLevel,
        streakMultiplier,
        basePoints,
        bonusPoints,
        isNewStreakLevel: isNewLevel,
    };
};

/**
 * Get current user streak information
 * @returns Promise with streak information
 */
export const getCurrentStreak = async (): Promise<{
    days: number;
    level: string;
    multiplier: number;
    nextLevel: { days: number; multiplier: number; name: string } | null;
    daysToNextLevel: number | null;
}> => {
    // Get current streak days
    const { days } = await getUserStreak();

    // Find current level
    const currentLevel = STREAK_LEVELS.reduce((highest, level) => {
        if (days >= level.days && level.days >= highest.days) {
            return level;
        }
        return highest;
    }, STREAK_LEVELS[0]);

    // Find next level
    let nextLevel = null;
    let daysToNextLevel = null;

    for (const level of STREAK_LEVELS) {
        if (level.days > days) {
            if (!nextLevel || level.days < nextLevel.days) {
                nextLevel = level;
                daysToNextLevel = level.days - days;
            }
        }
    }

    return {
        days,
        level: currentLevel.name,
        multiplier: currentLevel.multiplier,
        nextLevel,
        daysToNextLevel,
    };
};
