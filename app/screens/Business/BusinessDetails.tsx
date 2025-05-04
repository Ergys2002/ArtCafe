import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Linking,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { sampleBusinesses } from "../../models/BusinessModel";

const BusinessDetails = ({ route, navigation }) => {
    const { businessId } = route.params;
    const [business, setBusiness] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const theme = useTheme();
    const { colors } = theme;

    useEffect(() => {
        // Find the business data based on the ID from route params
        const businessData = sampleBusinesses.find((b) => b.id === businessId);
        if (businessData) {
            setBusiness(businessData);
            setSelectedCategory(businessData.menu.categories[0].id);
        }
    }, [businessId]);

    if (!business) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <Header title="Loading..." leftIcon="back" />
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: colors.text }]}>
                        Loading business details...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const selectedCategoryData = business.menu.categories.find(
        (c) => c.id === selectedCategory
    );

    const handleOpenMaps = () => {
        const { latitude, longitude } = business.location;
        const url = `https://maps.google.com/?q=${latitude},${longitude}`;
        Linking.openURL(url).catch((err) =>
            console.error("Error opening maps:", err)
        );
    };

    const handleCall = () => {
        Linking.openURL(`tel:${business.phone}`).catch((err) =>
            console.error("Error making call:", err)
        );
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryBtn,
                selectedCategory === item.id && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(item.id)}
        >
            <Text
                style={[
                    styles.categoryBtnText,
                    selectedCategory === item.id
                        ? styles.categoryBtnTextActive
                        : { color: colors.text },
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={[styles.productCard, { backgroundColor: colors.card }]}
            activeOpacity={0.9}
            onPress={() =>
                navigation.navigate("ProductsDetails", { product: item })
            }
        >
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.title }]}>
                    {item.name}
                </Text>
                <Text
                    style={[styles.productDescription, { color: colors.text }]}
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
                <View style={styles.productBottom}>
                    <Text style={styles.productPrice}>
                        ${item.price.toFixed(2)}
                    </Text>
                    {item.rating && (
                        <View style={styles.ratingContainer}>
                            <Feather
                                name="star"
                                size={14}
                                color={COLORS.primary}
                            />
                            <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Header title={business.name} leftIcon="back" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.heroContainer}>
                    <Image source={business.logo} style={styles.heroImage} />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>{business.name}</Text>
                        <View style={styles.ratingRow}>
                            <Feather name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingValue}>
                                {business.rating.toFixed(1)}
                            </Text>
                            <Text style={styles.reviewCount}>
                                ({business.reviewCount} reviews)
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[GlobalStyleSheet.container, { paddingTop: 15 }]}>
                    <Text style={[styles.description, { color: colors.text }]}>
                        {business.description}
                    </Text>

                    <View style={styles.infoSection}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIcon}>
                                <Feather
                                    name="map-pin"
                                    size={18}
                                    color={COLORS.primary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: colors.text },
                                ]}
                            >
                                {business.address}
                            </Text>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.infoIcon}>
                                <Feather
                                    name="phone"
                                    size={18}
                                    color={COLORS.primary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: colors.text },
                                ]}
                            >
                                {business.phone}
                            </Text>
                        </View>

                        <View style={styles.infoItem}>
                            <View style={styles.infoIcon}>
                                <Feather
                                    name="mail"
                                    size={18}
                                    color={COLORS.primary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: colors.text },
                                ]}
                            >
                                {business.email}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleCall}
                        >
                            <Feather
                                name="phone"
                                size={20}
                                color={COLORS.primary}
                            />
                            <Text style={styles.actionButtonText}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleOpenMaps}
                        >
                            <Feather
                                name="map"
                                size={20}
                                color={COLORS.primary}
                            />
                            <Text style={styles.actionButtonText}>
                                Directions
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() =>
                                Linking.openURL(`mailto:${business.email}`)
                            }
                        >
                            <Feather
                                name="mail"
                                size={20}
                                color={COLORS.primary}
                            />
                            <Text style={styles.actionButtonText}>Email</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.hoursContainer}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: colors.title },
                            ]}
                        >
                            Opening Hours
                        </Text>
                        <View style={styles.hoursContent}>
                            <View style={styles.hourRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: colors.title },
                                    ]}
                                >
                                    Monday
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {business.openingHours.monday}
                                </Text>
                            </View>
                            <View style={styles.hourRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: colors.title },
                                    ]}
                                >
                                    Tuesday
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {business.openingHours.tuesday}
                                </Text>
                            </View>
                            <View style={styles.hourRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: colors.title },
                                    ]}
                                >
                                    Wednesday
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {business.openingHours.wednesday}
                                </Text>
                            </View>
                            <View style={styles.hourRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: colors.title },
                                    ]}
                                >
                                    Thursday
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {business.openingHours.thursday}
                                </Text>
                            </View>
                            <View style={styles.hourRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: colors.title },
                                    ]}
                                >
                                    Friday
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {business.openingHours.friday}
                                </Text>
                            </View>
                            <View style={styles.hourRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: colors.title },
                                    ]}
                                >
                                    Saturday
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {business.openingHours.saturday}
                                </Text>
                            </View>
                            <View style={styles.hourRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: colors.title },
                                    ]}
                                >
                                    Sunday
                                </Text>
                                <Text
                                    style={[
                                        styles.timeText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {business.openingHours.sunday}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.menuContainer}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: colors.title },
                            ]}
                        >
                            Menu
                        </Text>

                        <FlatList
                            data={business.menu.categories}
                            keyExtractor={(item) => item.id}
                            renderItem={renderCategoryItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryList}
                        />

                        {selectedCategoryData &&
                            selectedCategoryData.products.map((product) => (
                                <View
                                    key={product.id}
                                    style={styles.productCardContainer}
                                >
                                    {renderProduct({ item: product })}
                                </View>
                            ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        ...FONTS.fontMedium,
        fontSize: 16,
    },
    heroContainer: {
        height: 200,
        width: "100%",
        position: "relative",
    },
    heroImage: {
        height: "100%",
        width: "100%",
        resizeMode: "cover",
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    heroContent: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    heroTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 24,
        color: "#FFFFFF",
        marginBottom: 5,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingValue: {
        ...FONTS.fontMedium,
        fontSize: 16,
        color: "#FFFFFF",
        marginLeft: 5,
    },
    reviewCount: {
        ...FONTS.fontRegular,
        fontSize: 14,
        color: "#FFFFFF",
        marginLeft: 5,
        opacity: 0.8,
    },
    description: {
        ...FONTS.fontRegular,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    infoIcon: {
        width: 30,
        alignItems: "center",
    },
    infoText: {
        ...FONTS.fontRegular,
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 25,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    actionButton: {
        alignItems: "center",
    },
    actionButtonText: {
        ...FONTS.fontMedium,
        fontSize: 14,
        color: COLORS.primary,
        marginTop: 5,
    },
    hoursContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 18,
        marginBottom: 15,
    },
    hoursContent: {
        backgroundColor: "rgba(0,0,0,0.02)",
        borderRadius: 8,
        padding: 12,
    },
    hourRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },
    dayText: {
        ...FONTS.fontMedium,
        fontSize: 14,
    },
    timeText: {
        ...FONTS.fontRegular,
        fontSize: 14,
    },
    menuContainer: {
        marginBottom: 30,
    },
    categoryList: {
        paddingBottom: 15,
    },
    categoryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    categoryBtnActive: {
        backgroundColor: COLORS.primary,
    },
    categoryBtnText: {
        ...FONTS.fontMedium,
        fontSize: 14,
    },
    categoryBtnTextActive: {
        color: "#FFFFFF",
    },
    productCardContainer: {
        marginBottom: 15,
    },
    productCard: {
        flexDirection: "row",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
    },
    productInfo: {
        flex: 1,
        padding: 12,
        justifyContent: "space-between",
    },
    productName: {
        ...FONTS.fontSemiBold,
        fontSize: 16,
        marginBottom: 4,
    },
    productDescription: {
        ...FONTS.fontRegular,
        fontSize: 13,
        marginBottom: 8,
    },
    productBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        ...FONTS.fontSemiBold,
        fontSize: 16,
        color: COLORS.primary,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(134, 82, 255, 0.1)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        ...FONTS.fontMedium,
        fontSize: 12,
        color: COLORS.primary,
        marginLeft: 4,
    },
});

export default BusinessDetails;
