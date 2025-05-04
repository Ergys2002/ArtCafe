/**
 * Loyalty Points Utility
 * Functions for calculating, awarding, and redeeming loyalty points
 */

/**
 * Calculate points based on the purchase price
 * Default calculation is 10% of the price (1 point per $0.10 spent)
 *
 * @param price - The price of the coffee/product
 * @param pointsRate - Points rate as a percentage (default: 10)
 * @returns The number of points earned (rounded to nearest integer)
 */
export const calculatePoints = (
    price: number,
    pointsRate: number = 10
): number => {
    return Math.round((price * pointsRate) / 100);
};

/**
 * Calculate how many points are needed to redeem a free item
 *
 * @param itemPrice - Price of the item to redeem
 * @param redemptionRate - How many cents each point is worth for redemption (default: 5)
 * @returns The number of points needed
 */
export const pointsNeededForRedemption = (
    itemPrice: number,
    redemptionRate: number = 5
): number => {
    return Math.ceil((itemPrice * 100) / redemptionRate);
};

/**
 * Check if user has enough points to redeem an item
 *
 * @param userPoints - Current points balance
 * @param itemPrice - Price of the item to redeem
 * @param redemptionRate - How many cents each point is worth (default: 5)
 * @returns Boolean indicating if user can redeem the item
 */
export const canRedeemItem = (
    userPoints: number,
    itemPrice: number,
    redemptionRate: number = 5
): boolean => {
    const pointsNeeded = pointsNeededForRedemption(itemPrice, redemptionRate);
    return userPoints >= pointsNeeded;
};

/**
 * Format points for display
 *
 * @param points - Number of points
 * @returns Formatted string (e.g., "1,234")
 */
export const formatPoints = (points: number): string => {
    return points.toLocaleString();
};
