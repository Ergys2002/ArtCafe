import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { sampleBusinesses } from "../../models/BusinessModel";
import { Feather } from "@expo/vector-icons";

const BusinessList = ({ navigation }) => {
    const theme = useTheme();
    const { colors } = theme;

    const renderBusinessItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.businessCard, { backgroundColor: colors.card }]}
            onPress={() =>
                navigation.navigate("BusinessDetails", { businessId: item.id })
            }
        >
            <Image source={item.logo} style={styles.businessLogo} />
            <View style={styles.businessInfo}>
                <Text style={[styles.businessName, { color: colors.title }]}>
                    {item.name}
                </Text>
                <Text
                    style={[styles.businessDescription, { color: colors.text }]}
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
                <View style={styles.businessFooter}>
                    <View style={styles.ratingContainer}>
                        <Feather name="star" size={14} color={COLORS.primary} />
                        <Text style={styles.rating}>
                            {item.rating.toFixed(1)}
                        </Text>
                        <Text
                            style={[styles.reviewCount, { color: colors.text }]}
                        >
                            ({item.reviewCount} reviews)
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.directionsButton}
                        onPress={() =>
                            navigation.navigate("BusinessDetails", {
                                businessId: item.id,
                            })
                        }
                    >
                        <Text style={styles.directionsButtonText}>
                            View Menu
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Header title="Coffee Shops" leftIcon="back" />
            <View style={[GlobalStyleSheet.container]}>
                <View style={styles.headerSection}>
                    <Text style={[styles.headerTitle, { color: colors.title }]}>
                        Discover Coffee Shops
                    </Text>
                    <Text
                        style={[styles.headerSubtitle, { color: colors.text }]}
                    >
                        Find the best coffee shops near you
                    </Text>
                </View>
            </View>

            <FlatList
                data={sampleBusinesses}
                keyExtractor={(item) => item.id}
                renderItem={renderBusinessItem}
                contentContainerStyle={[
                    GlobalStyleSheet.container,
                    { paddingTop: 0 },
                ]}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            />

            <View style={[GlobalStyleSheet.container, styles.scanContainer]}>
                <TouchableOpacity
                    style={styles.scanButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("ScanQR")}
                >
                    <Feather name="camera" size={20} color={COLORS.card} />
                    <Text style={styles.scanButtonText}>Scan QR Code</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerSection: {
        marginBottom: 20,
    },
    headerTitle: {
        ...FONTS.fontSemiBold,
        fontSize: 22,
        marginBottom: 6,
    },
    headerSubtitle: {
        ...FONTS.fontRegular,
        fontSize: 14,
    },
    businessCard: {
        flexDirection: "row",
        borderRadius: 12,
        padding: 12,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    businessLogo: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    businessInfo: {
        flex: 1,
        justifyContent: "space-between",
    },
    businessName: {
        ...FONTS.fontSemiBold,
        fontSize: 18,
        marginBottom: 4,
    },
    businessDescription: {
        ...FONTS.fontRegular,
        fontSize: 13,
        marginBottom: 8,
    },
    businessFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        ...FONTS.fontMedium,
        fontSize: 14,
        color: COLORS.primary,
        marginLeft: 4,
        marginRight: 4,
    },
    reviewCount: {
        ...FONTS.fontRegular,
        fontSize: 12,
    },
    directionsButton: {
        backgroundColor: "rgba(134, 82, 255, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    directionsButtonText: {
        ...FONTS.fontMedium,
        fontSize: 12,
        color: COLORS.primary,
    },
    scanContainer: {
        paddingVertical: 20,
    },
    scanButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    scanButtonText: {
        ...FONTS.fontMedium,
        fontSize: 16,
        color: COLORS.card,
        marginLeft: 8,
    },
});

export default BusinessList;
