import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
} from "react-native";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { ScrollView } from "react-native-gesture-handler";
import CheckoutItems from "../../components/CheckoutItems";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducer/cartReducer";
import Swiper from "react-native-swiper/src";
import { Feather } from "@expo/vector-icons";
import { calculatePoints, formatPoints } from "../../utils/loyalty/points";
import {
    awardPointsForPurchase,
    getUserPoints,
    getCurrentStreak,
} from "../../utils/loyalty/userPoints";

const ItemImages = [IMAGES.item4, IMAGES.item5, IMAGES.item6];

// Coffee customization options
const milkOptions = [
    { id: "none", label: "No Milk" },
    { id: "regular", label: "Regular" },
    { id: "skim", label: "Skim" },
    { id: "almond", label: "Almond" },
    { id: "oat", label: "Oat" },
    { id: "soy", label: "Soy" },
];

const sugarOptions = [
    { id: "none", label: "No Sugar" },
    { id: "light", label: "Light" },
    { id: "medium", label: "Medium" },
    { id: "extra", label: "Extra" },
];

const alcoholOptions = [
    { id: "none", label: "None" },
    { id: "baileys", label: "Baileys" },
    { id: "kahlua", label: "Kahlua" },
    { id: "whiskey", label: "Whiskey" },
];

type ProductsDetailsScreenProps = StackScreenProps<
    RootStackParamList,
    "ProductsDetails"
>;

const ProductsDetails = ({ navigation }: ProductsDetailsScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [userPoints, setUserPoints] = useState(0);
    const [showPointsEarned, setShowPointsEarned] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [streakInfo, setStreakInfo] = useState<{
        days: number;
        level: string;
        multiplier: number;
        nextLevel: { days: number; multiplier: number; name: string } | null;
        daysToNextLevel: number | null;
    } | null>(null);

    // Coffee customization state
    const [selectedMilk, setSelectedMilk] = useState(milkOptions[0].id);
    const [selectedSugar, setSelectedSugar] = useState(sugarOptions[0].id);
    const [selectedAlcohol, setSelectedAlcohol] = useState(
        alcoholOptions[0].id
    );
    const [showCustomization, setShowCustomization] = useState(false);

    const product = {
        id: "15",
        image: IMAGES.item11,
        title: "Ice Chocolate Coffee",
        price: 5.8,
        priceString: "$5.8",
        brand: "Coffee",
        redeemableWith: 250,
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const points = await getUserPoints();
        setUserPoints(points);

        const streak = await getCurrentStreak();
        setStreakInfo(streak);
    };

    const addItemToCart = () => {
        // Prepare customization details
        const customizations = {
            milk:
                milkOptions.find((option) => option.id === selectedMilk)
                    ?.label || "No Milk",
            sugar:
                sugarOptions.find((option) => option.id === selectedSugar)
                    ?.label || "No Sugar",
            alcohol:
                alcoholOptions.find((option) => option.id === selectedAlcohol)
                    ?.label || "None",
        };

        // Get a customization summary for the title
        let customizationSummary = [];
        if (selectedMilk !== "none")
            customizationSummary.push(customizations.milk + " Milk");
        if (selectedSugar !== "none")
            customizationSummary.push(customizations.sugar + " Sugar");
        if (selectedAlcohol !== "none")
            customizationSummary.push("with " + customizations.alcohol);

        const customizedTitle =
            customizationSummary.length > 0
                ? `${product.title} (${customizationSummary.join(", ")})`
                : product.title;

        dispatch(
            addToCart({
                id: product.id,
                image: product.image,
                title: customizedTitle,
                price: product.priceString,
                brand: product.brand,
                quantity: quantity,
                customizations: customizations,
            } as any)
        );
    };

    const handlePlaceOrder = async () => {
        addItemToCart();
        const totalPrice = product.price * quantity;
        const result = await awardPointsForPurchase(
            totalPrice,
            `Purchase of ${product.title}`,
            { id: product.id, name: product.title }
        );

        setPointsEarned(result.pointsEarned);
        setUserPoints(result.newTotal);
        setShowPointsEarned(true);

        const updatedStreak = await getCurrentStreak();
        setStreakInfo(updatedStreak);

        let alertMessage = `You earned ${result.pointsEarned} points for this purchase.`;

        if (result.streakMultiplier > 1) {
            alertMessage += `\n\n• Base points: ${result.basePoints}\n• Streak bonus: +${result.bonusPoints} (${result.streakLevel} streak: ${result.streakMultiplier}x)`;
        }

        if (result.isNewStreakLevel) {
            alertMessage += `\n\n🎉 Congratulations! You've reached ${result.streakLevel} streak level!`;
        }

        alertMessage += `\n\nYour new balance is ${result.newTotal} points.`;

        Alert.alert(
            result.isNewStreakLevel ? "New Streak Level! 🎉" : "Points Earned!",
            alertMessage,
            [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("DeliveryAddress"),
                },
            ]
        );
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const basePoints = calculatePoints(product.price * quantity);
    const streakMultiplier = streakInfo ? streakInfo.multiplier : 1;
    const potentialBonus =
        Math.round(basePoints * streakMultiplier) - basePoints;
    const potentialPoints = basePoints + potentialBonus;
    const totalPrice = product.price * quantity;
    const pointsAfterPurchase = userPoints + potentialPoints;
    const percentTowardsFreeItem = Math.min(
        100,
        Math.round((pointsAfterPurchase / product.redeemableWith) * 100)
    );

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.imagecard]}>
                    <Swiper
                        autoplay={true}
                        autoplayTimeout={2}
                        showsPagination={
                            Platform.OS === "android" ? false : false
                        }
                        loop={false}
                    >
                        {ItemImages.map((data, index) => (
                            <View key={index}>
                                <Image
                                    style={{
                                        height: 350,
                                        width: "100%",
                                        resizeMode: "contain",
                                    }}
                                    source={data}
                                />
                            </View>
                        ))}
                    </Swiper>
                    <View style={[styles.toparre]}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[
                                styles.backbtn,
                                { backgroundColor: "rgba(246,246,246,.3)" },
                            ]}
                        >
                            <Feather
                                size={24}
                                color={COLORS.card}
                                name={"arrow-left"}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                ...FONTS.fontSemiBold,
                                fontSize: 20,
                                color: COLORS.card,
                            }}
                        >
                            Details
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                addItemToCart();
                                navigation.navigate("MyCart");
                            }}
                            style={[
                                styles.backbtn,
                                { backgroundColor: "rgba(246,246,246,.3)" },
                            ]}
                        >
                            <Feather
                                size={20}
                                color={COLORS.card}
                                name={"shopping-cart"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={[
                        styles.bottomcard,
                        {
                            backgroundColor: theme.dark
                                ? colors.background
                                : colors.card,
                        },
                    ]}
                >
                    <View
                        style={[
                            GlobalStyleSheet.container,
                            { paddingHorizontal: 30 },
                        ]}
                    >
                        <View
                            style={{ alignItems: "center", marginBottom: 20 }}
                        >
                            <View
                                style={{
                                    height: 6,
                                    width: 60,
                                    borderRadius: 20,
                                    backgroundColor: "#DDDDDD",
                                }}
                            />
                        </View>
                        <View style={[styles.rattingcard]}>
                            <Text
                                style={{
                                    ...FONTS.fontSemiBold,
                                    fontSize: 24,
                                    color: COLORS.card,
                                    lineHeight: 34,
                                }}
                            >
                                4.5
                            </Text>
                        </View>
                        <Text
                            style={[styles.brandTitle, { color: colors.title }]}
                        >
                            Ice Chocolate Coffee
                        </Text>
                        <Text
                            style={[
                                styles.subtitle,
                                {
                                    color: theme.dark
                                        ? "rgba(255,255,255,.7)"
                                        : "#4E4E4E",
                                    paddingVertical: 15,
                                },
                            ]}
                        >
                            “Lorem ipsum dolor sit amet,{"\n"}consectetur
                            adipiscing elit, sed do
                        </Text>
                        <View
                            style={[
                                GlobalStyleSheet.flex,
                                { paddingVertical: 15 },
                            ]}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <View style={{ flexDirection: "row", gap: 5 }}>
                                    <Text
                                        style={[
                                            styles.subtitle2,
                                            {
                                                fontSize: 14,
                                                color: colors.title,
                                            },
                                        ]}
                                    >
                                        $
                                    </Text>
                                    <Text
                                        style={[
                                            styles.subtitle2,
                                            {
                                                color: colors.title,
                                                lineHeight: 30,
                                            },
                                        ]}
                                    >
                                        {product.price.toFixed(2)}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        ...FONTS.fontMedium,
                                        fontSize: 16,
                                        color: "#9A9A9A",
                                        textDecorationLine: "line-through",
                                    }}
                                >
                                    $8.0
                                </Text>
                            </View>
                            <View>
                                <CheckoutItems
                                    productList={true}
                                    quantity={quantity}
                                    onIncrement={incrementQuantity}
                                    onDecrement={decrementQuantity}
                                />
                            </View>
                        </View>

                        {/* Coffee Customization Section */}
                        <View style={styles.customizationContainer}>
                            <View style={styles.customizationHeader}>
                                <Feather
                                    name="coffee"
                                    size={20}
                                    color={COLORS.primary}
                                    style={{ marginRight: 8 }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.fontSemiBold,
                                        fontSize: 16,
                                        color: COLORS.primary,
                                    }}
                                >
                                    Customize Your Coffee
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowCustomization(!showCustomization)
                                    }
                                    style={{ marginLeft: "auto" }}
                                >
                                    <Feather
                                        name={
                                            showCustomization
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>

                            {showCustomization && (
                                <View style={styles.customizationOptions}>
                                    {/* Milk Options */}
                                    <View style={styles.optionSection}>
                                        <Text style={styles.optionTitle}>
                                            Milk
                                        </Text>
                                        <View style={styles.optionsRow}>
                                            {milkOptions.map((option) => (
                                                <TouchableOpacity
                                                    key={option.id}
                                                    style={[
                                                        styles.optionButton,
                                                        selectedMilk ===
                                                            option.id &&
                                                            styles.selectedOption,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedMilk(
                                                            option.id
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.optionText,
                                                            selectedMilk ===
                                                                option.id &&
                                                                styles.selectedOptionText,
                                                        ]}
                                                    >
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Sugar Options */}
                                    <View style={styles.optionSection}>
                                        <Text style={styles.optionTitle}>
                                            Sugar
                                        </Text>
                                        <View style={styles.optionsRow}>
                                            {sugarOptions.map((option) => (
                                                <TouchableOpacity
                                                    key={option.id}
                                                    style={[
                                                        styles.optionButton,
                                                        selectedSugar ===
                                                            option.id &&
                                                            styles.selectedOption,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedSugar(
                                                            option.id
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.optionText,
                                                            selectedSugar ===
                                                                option.id &&
                                                                styles.selectedOptionText,
                                                        ]}
                                                    >
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Alcohol Options */}
                                    <View style={styles.optionSection}>
                                        <Text style={styles.optionTitle}>
                                            Alcohol
                                        </Text>
                                        <View style={styles.optionsRow}>
                                            {alcoholOptions.map((option) => (
                                                <TouchableOpacity
                                                    key={option.id}
                                                    style={[
                                                        styles.optionButton,
                                                        selectedAlcohol ===
                                                            option.id &&
                                                            styles.selectedOption,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedAlcohol(
                                                            option.id
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.optionText,
                                                            selectedAlcohol ===
                                                                option.id &&
                                                                styles.selectedOptionText,
                                                        ]}
                                                    >
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>

                        <View style={styles.pointsContainer}>
                            <View style={styles.pointsHeader}>
                                <Image
                                    source={IMAGES.gift}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        tintColor: COLORS.primary,
                                    }}
                                />
                                <Text
                                    style={{
                                        ...FONTS.fontSemiBold,
                                        fontSize: 16,
                                        color: COLORS.primary,
                                        marginLeft: 8,
                                    }}
                                >
                                    Loyalty Points
                                </Text>
                            </View>
                            {streakInfo && streakInfo.days > 0 && (
                                <View style={styles.streakContainer}>
                                    <Text style={styles.streakTitle}>
                                        {streakInfo.level} Streak:{" "}
                                        {streakInfo.days}{" "}
                                        {streakInfo.days === 1 ? "day" : "days"}
                                    </Text>
                                    {streakInfo.multiplier > 1 && (
                                        <Text style={styles.streakBonus}>
                                            {streakInfo.multiplier}x points
                                            multiplier active!
                                        </Text>
                                    )}
                                    {streakInfo.nextLevel && (
                                        <Text style={styles.streakNext}>
                                            {streakInfo.daysToNextLevel} more{" "}
                                            {streakInfo.daysToNextLevel === 1
                                                ? "day"
                                                : "days"}{" "}
                                            to reach {streakInfo.nextLevel.name}{" "}
                                            level (
                                            {streakInfo.nextLevel.multiplier}x)
                                        </Text>
                                    )}
                                </View>
                            )}
                            <Text
                                style={{
                                    ...FONTS.fontMedium,
                                    fontSize: 14,
                                    color: colors.title,
                                    marginTop: 8,
                                }}
                            >
                                You'll earn{" "}
                                <Text
                                    style={{
                                        color: COLORS.primary,
                                        ...FONTS.fontSemiBold,
                                    }}
                                >
                                    {basePoints} base points
                                </Text>
                                {potentialBonus > 0 && (
                                    <>
                                        {" + "}
                                        <Text
                                            style={{
                                                color: "#FFA500",
                                                ...FONTS.fontSemiBold,
                                            }}
                                        >
                                            {potentialBonus} bonus
                                        </Text>
                                        {" = "}
                                        <Text
                                            style={{
                                                color: COLORS.primary,
                                                ...FONTS.fontSemiBold,
                                            }}
                                        >
                                            {potentialPoints} total
                                        </Text>
                                    </>
                                )}{" "}
                                on this ${totalPrice.toFixed(2)} purchase
                            </Text>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBackground}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${percentTowardsFreeItem}%`,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>
                                    {userPoints} + {potentialPoints} ={" "}
                                    {pointsAfterPurchase} points
                                </Text>
                            </View>
                            <Text style={styles.progressCaption}>
                                {pointsAfterPurchase >= product.redeemableWith
                                    ? "You'll have enough points for a free item!"
                                    : `${Math.max(
                                          0,
                                          product.redeemableWith -
                                              pointsAfterPurchase
                                      )} more points until you can redeem a free ${
                                          product.title
                                      }`}
                            </Text>
                        </View>
                        <Text
                            style={{
                                ...FONTS.fontLight,
                                fontSize: 12,
                                color: theme.dark
                                    ? "rgba(255,255,255,.7)"
                                    : "#4E4E4E",
                                marginTop: 5,
                                paddingHorizontal: 5,
                            }}
                        >
                            *10% of your purchase price converted to base
                            points.
                            {streakInfo &&
                                streakInfo.multiplier > 1 &&
                                ` ${streakInfo.multiplier}x multiplier from your ${streakInfo.level} streak.`}
                        </Text>
                        <View style={styles.streakTipContainer}>
                            <Feather
                                name="info"
                                size={16}
                                color={COLORS.primary}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={styles.streakTip}>
                                Make purchases on consecutive days to increase
                                your streak and earn up to 2.5x bonus points!
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
                <Button
                    onPress={handlePlaceOrder}
                    title="Place order"
                    color={COLORS.primary}
                    text={COLORS.card}
                    style={{ borderRadius: 50 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pointsContainer: {
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: "rgba(22, 192, 51, 0.08)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(22, 192, 51, 0.2)",
    },
    pointsHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    progressContainer: {
        marginTop: 12,
        marginBottom: 5,
    },
    progressBackground: {
        height: 8,
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: COLORS.primary,
    },
    progressText: {
        ...FONTS.fontRegular,
        fontSize: 12,
        color: "#666",
        marginTop: 5,
        textAlign: "center",
    },
    progressCaption: {
        ...FONTS.fontMedium,
        fontSize: 13,
        color: COLORS.primary,
        marginTop: 5,
        textAlign: "center",
    },
    streakContainer: {
        backgroundColor: "rgba(255, 165, 0, 0.15)",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 5,
        borderLeftWidth: 3,
        borderLeftColor: "#FFA500",
    },
    streakTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 14,
        color: "#FFA500",
    },
    streakBonus: {
        ...FONTS.fontMedium,
        fontSize: 13,
        color: "#FFA500",
        marginTop: 2,
    },
    streakNext: {
        ...FONTS.fontRegular,
        fontSize: 12,
        color: "#666",
        marginTop: 3,
    },
    streakTipContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(22, 192, 51, 0.05)",
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 30,
        marginTop: 10,
    },
    streakTip: {
        ...FONTS.fontRegular,
        fontSize: 12,
        color: "#555",
        flex: 1,
    },
    imagecard: {
        width: "100%",
        height: SIZES.height / 2,
        paddingTop: 60,
        backgroundColor: COLORS.primary,
        paddingBottom: 30,
    },
    backbtn: {
        height: 45,
        width: 45,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    toparre: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        paddingHorizontal: 30,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    bottomcard: {
        backgroundColor: COLORS.card,
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -60,
    },
    rattingcard: {
        height: 64,
        width: 64,
        borderRadius: 50,
        backgroundColor: "#FF8730",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "rgba(255,135,48,.4)",
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.34,
        shadowRadius: 31.27,
        elevation: 8,
        position: "absolute",
        right: 40,
        top: -25,
    },
    subtitle: {
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title,
    },
    bottombtn: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.secondary,
        height: 65,
        borderRadius: 50,
        padding: 0,
    },
    brandTitle: {
        ...FONTS.fontMedium,
        fontSize: 20,
        color: COLORS.title,
    },
    subtitle2: {
        ...FONTS.fontSemiBold,
        fontSize: 24,
        color: COLORS.title,
    },
    customizationContainer: {
        marginTop: 10,
        marginBottom: 15,
        padding: 15,
        backgroundColor: "rgba(134, 82, 255, 0.08)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(134, 82, 255, 0.2)",
    },
    customizationHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    customizationOptions: {
        marginTop: 15,
    },
    optionSection: {
        marginBottom: 15,
    },
    optionTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 14,
        color: COLORS.title,
        marginBottom: 8,
    },
    optionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.05)",
        marginBottom: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
    },
    selectedOption: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    optionText: {
        ...FONTS.fontRegular,
        fontSize: 12,
        color: "#666",
    },
    selectedOptionText: {
        color: COLORS.card,
        ...FONTS.fontMedium,
    },
});

export default ProductsDetails;
