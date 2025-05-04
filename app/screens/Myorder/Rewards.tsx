import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import { Feather } from "@expo/vector-icons";
import { formatPoints } from "../../utils/loyalty/points";
import {
    getUserPoints,
    getPointsHistory,
    redeemPoints,
    PointsTransaction,
    getCurrentStreak,
} from "../../utils/loyalty/userPoints";
import { STREAK_LEVELS } from "../../utils/loyalty/streaks";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for AsyncStorage - copied from userPoints.ts for direct access in initialization
const POINTS_STORAGE_KEY = "@CoffeeApp:userPoints";
const POINTS_HISTORY_KEY = "@CoffeeApp:pointsHistory";

const redemptionOptions = [
    {
        id: "1",
        title: "Free Espresso Shot",
        pointsRequired: 150,
        image: IMAGES.item1,
        description: "A single shot of our premium espresso",
    },
    {
        id: "2",
        title: "Medium Coffee",
        pointsRequired: 250,
        image: IMAGES.item2,
        description: "Any medium-sized coffee of your choice",
    },
    {
        id: "3",
        title: "Specialty Latte",
        pointsRequired: 400,
        image: IMAGES.item3,
        description: "Any specialty latte with your choice of milk",
    },
    {
        id: "4",
        title: "Premium Cold Brew",
        pointsRequired: 550,
        image: IMAGES.item4,
        description: "Our signature cold brew coffee with specialty beans",
    },
    {
        id: "5",
        title: "$5 Off Any Coffee",
        pointsRequired: 500,
        image: IMAGES.item5,
        description: "Discount applied to any coffee purchase",
    },
];

const initialHistory: PointsTransaction[] = [
    {
        id: "1",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 126,
        description: "Purchase of Hot Creamy Cappuccino Latte Art",
        productId: "0",
        productName: "Hot Creamy Cappuccino Latte Art",
    },
    {
        id: "2",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 136,
        description: "Purchase of Creamy Mocha Ome Coffee",
        productId: "1",
        productName: "Creamy Mocha Ome Coffee",
    },
    {
        id: "3",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        amount: -150,
        description: "Redeemed: Free Espresso Shot",
    },
    {
        id: "4",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 126,
        description: "Purchase of Original Latte Ombe Hot Coffee",
        productId: "2",
        productName: "Original Latte Ombe Hot Coffee",
    },
];

const dropdownData = [
    {
        id: "1",
        lable: "Newest",
    },
    {
        id: "2",
        lable: "Oldest",
    },
    {
        id: "3",
        lable: "Remark",
    },
];

const Rewards = () => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const [show, setshow] = useState(false);
    const [select, setselect] = React.useState(0);
    const [userPoints, setUserPoints] = useState(238);
    const [showRedemptionOptions, setShowRedemptionOptions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<PointsTransaction[]>([]);
    const [redeeming, setRedeeming] = useState(false);
    const [streakInfo, setStreakInfo] = useState<{
        days: number;
        level: string;
        multiplier: number;
        nextLevel: { days: number; multiplier: number; name: string } | null;
        daysToNextLevel: number | null;
    } | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const points = await getUserPoints();
            const streak = await getCurrentStreak();
            setStreakInfo(streak);

            if (points === 0) {
                const totalPoints = initialHistory.reduce(
                    (sum, transaction) => sum + transaction.amount,
                    0
                );
                setUserPoints(totalPoints);
                setHistory(initialHistory);
            } else {
                setUserPoints(points);
                const pointsHistory = await getPointsHistory();
                if (pointsHistory.length === 0) {
                    setHistory(initialHistory);
                } else {
                    setHistory(pointsHistory);
                }
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            setUserPoints(238);
            setHistory(initialHistory);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemReward = async (
        optionId: string,
        pointsRequired: number,
        description: string
    ) => {
        if (userPoints < pointsRequired) {
            return;
        }

        setRedeeming(true);
        try {
            const newTotal = await redeemPoints(pointsRequired, description);
            if (newTotal !== null) {
                setUserPoints(newTotal);
                const updatedHistory = await getPointsHistory();
                setHistory(updatedHistory);
                setShowRedemptionOptions(false);
            }
        } catch (error) {
            console.error("Error redeeming points:", error);
        } finally {
            setRedeeming(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <Header title="Rewards" leftIcon="back" titleRight />
            {loading ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={[
                            GlobalStyleSheet.container,
                            {
                                padding: 0,
                                paddingHorizontal: 20,
                                marginTop: 20,
                            },
                        ]}
                    >
                        <View style={[styles.rewoardcard]}>
                            <View style={[GlobalStyleSheet.col60]}>
                                <View style={[styles.cardCricle]} />
                                <View>
                                    <Text
                                        style={{
                                            ...FONTS.fontMedium,
                                            fontSize: 18,
                                            color: COLORS.card,
                                        }}
                                    >
                                        My Points
                                    </Text>
                                    <Text
                                        style={{
                                            ...FONTS.fontSemiBold,
                                            fontSize: 34,
                                            color: COLORS.card,
                                            marginTop: 5,
                                        }}
                                    >
                                        {formatPoints(userPoints)}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.cardbutton]}
                                        onPress={() =>
                                            setShowRedemptionOptions(
                                                !showRedemptionOptions
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                ...FONTS.fontMedium,
                                                fontSize: 14,
                                                color: COLORS.card,
                                                lineHeight: 20,
                                            }}
                                        >
                                            Redeem Gift
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[GlobalStyleSheet.col40]}>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Image
                                        style={[
                                            GlobalStyleSheet.image3,
                                            {
                                                tintColor:
                                                    "rgba(255,255,255,.5)",
                                            },
                                        ]}
                                        source={IMAGES.information}
                                    />
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: 90,
                                            right: -60,
                                        }}
                                    >
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                height: 110,
                                                width: 156,
                                            }}
                                            source={IMAGES.Vector}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {streakInfo && (
                            <View style={styles.streakCard}>
                                <View style={styles.streakHeader}>
                                    <Feather
                                        name="zap"
                                        size={22}
                                        color="#FFA500"
                                    />
                                    <Text style={styles.streakHeaderText}>
                                        Your Streak
                                    </Text>
                                </View>

                                <View style={styles.streakInfoRow}>
                                    <View style={styles.streakDaysContainer}>
                                        <Text style={styles.streakDaysNumber}>
                                            {streakInfo.days}
                                        </Text>
                                        <Text style={styles.streakDaysLabel}>
                                            {streakInfo.days === 1
                                                ? "DAY"
                                                : "DAYS"}
                                        </Text>
                                    </View>

                                    <View style={styles.streakDetailsContainer}>
                                        <Text style={styles.streakLevel}>
                                            {streakInfo.level} Level
                                        </Text>
                                        <Text style={styles.streakMultiplier}>
                                            {streakInfo.multiplier}x Points
                                            Multiplier
                                        </Text>

                                        {streakInfo.nextLevel && (
                                            <View
                                                style={
                                                    styles.nextLevelContainer
                                                }
                                            >
                                                <Text
                                                    style={styles.nextLevelText}
                                                >
                                                    {streakInfo.daysToNextLevel}{" "}
                                                    more day
                                                    {streakInfo.daysToNextLevel !==
                                                        1 && "s"}{" "}
                                                    to{" "}
                                                    {streakInfo.nextLevel.name}{" "}
                                                    Level (
                                                    {
                                                        streakInfo.nextLevel
                                                            .multiplier
                                                    }
                                                    x)
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.streakLevelsContainer}>
                                    {STREAK_LEVELS.map((level, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.streakLevelItem,
                                                streakInfo.days >= level.days
                                                    ? styles.streakLevelActive
                                                    : {},
                                                level.name === streakInfo.level
                                                    ? styles.streakLevelCurrent
                                                    : {},
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.streakLevelDay,
                                                    streakInfo.days >=
                                                    level.days
                                                        ? styles.streakLevelTextActive
                                                        : {},
                                                ]}
                                            >
                                                {level.days}d
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.streakLevelMultiplier,
                                                    streakInfo.days >=
                                                    level.days
                                                        ? styles.streakLevelTextActive
                                                        : {},
                                                ]}
                                            >
                                                {level.multiplier}x
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                <Text style={styles.streakTip}>
                                    Make purchases on consecutive days to
                                    increase your streak level and earn more
                                    points!
                                </Text>
                            </View>
                        )}

                        {showRedemptionOptions && (
                            <View style={styles.redemptionContainer}>
                                <Text
                                    style={{
                                        ...FONTS.fontSemiBold,
                                        fontSize: 18,
                                        color: colors.title,
                                        marginBottom: 15,
                                    }}
                                >
                                    Redeem Your Points
                                </Text>

                                {redemptionOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.redemptionOption,
                                            {
                                                backgroundColor: theme.dark
                                                    ? "rgba(255,255,255,.1)"
                                                    : colors.background,
                                            },
                                        ]}
                                        onPress={() =>
                                            handleRedeemReward(
                                                option.id,
                                                option.pointsRequired,
                                                `Redeemed: ${option.title}`
                                            )
                                        }
                                        disabled={
                                            userPoints <
                                                option.pointsRequired ||
                                            redeeming
                                        }
                                    >
                                        <Image
                                            source={option.image}
                                            style={styles.redemptionImage}
                                        />
                                        <View style={styles.redemptionInfo}>
                                            <Text
                                                style={{
                                                    ...FONTS.fontMedium,
                                                    fontSize: 16,
                                                    color: colors.title,
                                                }}
                                            >
                                                {option.title}
                                            </Text>
                                            <Text
                                                style={{
                                                    ...FONTS.fontRegular,
                                                    fontSize: 14,
                                                    color: COLORS.primary,
                                                }}
                                            >
                                                {formatPoints(
                                                    option.pointsRequired
                                                )}{" "}
                                                points
                                            </Text>
                                            <Text
                                                style={{
                                                    ...FONTS.fontRegular,
                                                    fontSize: 12,
                                                    color: theme.dark
                                                        ? "rgba(255,255,255,0.6)"
                                                        : "#666",
                                                    marginTop: 3,
                                                }}
                                            >
                                                {option.description}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.redemptionStatus,
                                                {
                                                    backgroundColor:
                                                        userPoints >=
                                                        option.pointsRequired
                                                            ? COLORS.primary
                                                            : "#ccc",
                                                },
                                            ]}
                                        >
                                            {redeeming ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color={COLORS.card}
                                                />
                                            ) : (
                                                <Text
                                                    style={{
                                                        ...FONTS.fontMedium,
                                                        fontSize: 12,
                                                        color: COLORS.card,
                                                    }}
                                                >
                                                    {userPoints >=
                                                    option.pointsRequired
                                                        ? "Redeem"
                                                        : "Not Enough"}
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View
                            style={[
                                GlobalStyleSheet.flex,
                                { paddingVertical: 30, paddingBottom: 10 },
                            ]}
                        >
                            <Text
                                style={{
                                    ...FONTS.fontMedium,
                                    fontSize: 18,
                                    color: colors.title,
                                }}
                            >
                                Points History
                            </Text>
                            <TouchableOpacity
                                onPress={() => setshow(!show)}
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        ...FONTS.fontMedium,
                                        fontSize: 16,
                                        color: COLORS.primary,
                                    }}
                                >
                                    {dropdownData[select].lable}
                                </Text>
                                <Feather
                                    size={20}
                                    color={COLORS.primary}
                                    name={show ? "chevron-up" : "chevron-down"}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[
                                {
                                    position: "absolute",
                                    bottom: 40,
                                    right: 20,
                                    padding: 10,
                                    backgroundColor: theme.dark
                                        ? colors.background
                                        : colors.card,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    opacity: show ? 1 : 0,
                                },
                            ]}
                        >
                            <View>
                                {dropdownData.map((data: any, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setselect(index);
                                                setshow(!show);
                                            }}
                                            key={index}
                                            style={{
                                                paddingVertical: 2,
                                                paddingHorizontal: 10,
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        ...FONTS.fontMedium,
                                                        fontSize: 16,
                                                        color: colors.title,
                                                    },
                                                    select === index && {
                                                        color: COLORS.primary,
                                                    },
                                                ]}
                                            >
                                                {data.lable}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                    <View
                        style={[
                            GlobalStyleSheet.container,
                            { paddingHorizontal: 20 },
                        ]}
                    >
                        {history.length === 0 ? (
                            <View style={styles.emptyHistory}>
                                <Text
                                    style={{
                                        ...FONTS.fontMedium,
                                        fontSize: 16,
                                        color: colors.title,
                                    }}
                                >
                                    No points activity yet. Make a purchase to
                                    earn points!
                                </Text>
                            </View>
                        ) : (
                            history.map((transaction, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.card,
                                        {
                                            borderBottomColor: colors.border,
                                            backgroundColor: colors.card,
                                        },
                                    ]}
                                >
                                    <View style={[GlobalStyleSheet.flex]}>
                                        <View
                                            style={{
                                                flex: 1,
                                                paddingRight: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...FONTS.fontRegular,
                                                    fontSize: 16,
                                                    color: colors.title,
                                                }}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                {transaction.description}
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    marginTop: 10,
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...FONTS.fontRegular,
                                                        fontSize: 12,
                                                        color: theme.dark
                                                            ? "rgba(255,255,255,.7)"
                                                            : "#595959",
                                                        lineHeight: 18,
                                                    }}
                                                >
                                                    {formatDate(
                                                        transaction.date
                                                    )}
                                                </Text>
                                                <View
                                                    style={{
                                                        width: 2,
                                                        height: 10,
                                                        backgroundColor:
                                                            theme.dark
                                                                ? "rgba(255,255,255,.7)"
                                                                : "#595959",
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        ...FONTS.fontRegular,
                                                        fontSize: 12,
                                                        color: theme.dark
                                                            ? "rgba(255,255,255,.7)"
                                                            : "#595959",
                                                        lineHeight: 18,
                                                    }}
                                                >
                                                    {formatTime(
                                                        transaction.date
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                minWidth: 70,
                                                alignItems: "flex-end",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...FONTS.fontSemiBold,
                                                    fontSize: 20,
                                                    color:
                                                        transaction.amount > 0
                                                            ? COLORS.primary
                                                            : "#FF4D4F",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {transaction.amount > 0
                                                    ? "+"
                                                    : ""}
                                                {transaction.amount}
                                            </Text>
                                            <Text
                                                style={{
                                                    ...FONTS.fontRegular,
                                                    fontSize: 14,
                                                    color: colors.text,
                                                    textAlign: "right",
                                                }}
                                            >
                                                Pts
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    selectedValue: {
        marginTop: 16,
        fontSize: 16,
    },
    rewoardcard: {
        padding: 30,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        width: "100%",
        flexDirection: "row",
        overflow: "hidden",
    },
    cardCricle: {
        width: 272,
        height: 272,
        borderRadius: 250,
        backgroundColor: "#036442",
        position: "absolute",
        left: -160,
        bottom: -160,
    },
    cardbutton: {
        padding: 10,
        backgroundColor: "rgba(255,255,255,.17)",
        borderRadius: 7,
        width: "75%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    card: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
        paddingBottom: 15,
        marginBottom: 15,
        borderRadius: 12,
    },
    redemptionContainer: {
        marginTop: 25,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 15,
        padding: 15,
    },
    redemptionOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 12,
    },
    redemptionImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    redemptionInfo: {
        flex: 1,
        marginLeft: 15,
    },
    redemptionStatus: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    emptyHistory: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.03)",
        borderRadius: 10,
        marginBottom: 20,
    },
    streakCard: {
        backgroundColor: COLORS.card,
        borderRadius: 15,
        padding: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 165, 0, 0.3)",
        shadowColor: "#FFA500",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    streakHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    streakHeaderText: {
        ...FONTS.fontSemiBold,
        fontSize: 18,
        color: "#FFA500",
        marginLeft: 8,
    },
    streakInfoRow: {
        flexDirection: "row",
        marginBottom: 15,
    },
    streakDaysContainer: {
        width: 65,
        height: 65,
        borderRadius: 40,
        backgroundColor: "rgba(255, 165, 0, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    streakDaysNumber: {
        ...FONTS.fontSemiBold,
        fontSize: 24,
        color: "#FFA500",
    },
    streakDaysLabel: {
        ...FONTS.fontRegular,
        fontSize: 10,
        color: "#FFA500",
    },
    streakDetailsContainer: {
        flex: 1,
        justifyContent: "center",
    },
    streakLevel: {
        ...FONTS.fontSemiBold,
        fontSize: 16,
        color: COLORS.title,
    },
    streakMultiplier: {
        ...FONTS.fontMedium,
        fontSize: 14,
        color: "#FFA500",
        marginTop: 2,
    },
    nextLevelContainer: {
        marginTop: 5,
    },
    nextLevelText: {
        ...FONTS.fontRegular,
        fontSize: 12,
        color: COLORS.text,
    },
    streakLevelsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingTop: 5,
    },
    streakLevelItem: {
        alignItems: "center",
        width: "18%",
        paddingVertical: 8,
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 8,
    },
    streakLevelActive: {
        backgroundColor: "rgba(255, 165, 0, 0.15)",
    },
    streakLevelCurrent: {
        borderWidth: 1,
        borderColor: "#FFA500",
    },
    streakLevelDay: {
        ...FONTS.fontMedium,
        fontSize: 12,
        color: COLORS.text,
    },
    streakLevelMultiplier: {
        ...FONTS.fontSemiBold,
        fontSize: 14,
        color: COLORS.text,
    },
    streakLevelTextActive: {
        color: "#FFA500",
    },
    streakTip: {
        ...FONTS.fontRegular,
        fontSize: 12,
        color: COLORS.text,
        textAlign: "center",
        marginTop: 5,
    },
});

export default Rewards;
