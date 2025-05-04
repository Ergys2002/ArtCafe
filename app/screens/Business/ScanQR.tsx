import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    TextInput,
    Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants/theme";
import Header from "../../layout/Header";
import { sampleBusinesses } from "../../models/BusinessModel";

const ScanQR = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [manualCode, setManualCode] = useState("");
    // Always use manual entry mode for now to avoid native module issues
    const [useManualEntry, setUseManualEntry] = useState(true);
    const theme = useTheme();
    const { colors } = theme;

    useEffect(() => {
        // No need to request permissions since we're using manual entry
        setHasPermission(true);
    }, []);

    const handleManualSubmit = () => {
        if (manualCode) {
            processQRData(manualCode);
        }
    };

    const processQRData = (data) => {
        if (data && data.startsWith("business:")) {
            const businessId = data.split("business:")[1];
            const business = sampleBusinesses.find((b) => b.id === businessId);

            if (business) {
                navigation.navigate("BusinessDetails", { businessId });
            } else {
                alert(
                    "Business not found. Please try scanning a valid QR code."
                );
                setManualCode("");
            }
        } else {
            alert(`QR code scanned: ${data}`);
            setManualCode("");
        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Header title="Scan QR Code" leftIcon="back" />

            <View style={styles.simulatorContainer}>
                <View style={styles.qrImageContainer}>
                    <Feather name="camera" size={60} color={COLORS.primary} />
                    <Text
                        style={[styles.simulatorText, { color: colors.title }]}
                    >
                        Enter a business QR code below
                    </Text>
                </View>

                <View style={styles.manualEntryContainer}>
                    <Text
                        style={[
                            styles.manualEntryTitle,
                            { color: colors.title },
                        ]}
                    >
                        Enter QR Code
                    </Text>
                    <TextInput
                        style={[
                            styles.manualInput,
                            {
                                backgroundColor: colors.card,
                                color: colors.text,
                            },
                        ]}
                        placeholder="Enter code (e.g., business:1)"
                        placeholderTextColor="#999"
                        value={manualCode}
                        onChangeText={setManualCode}
                    />
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            { backgroundColor: COLORS.primary },
                        ]}
                        onPress={handleManualSubmit}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>

                    <View style={styles.sampleCodesContainer}>
                        <Text
                            style={[
                                styles.sampleCodesTitle,
                                { color: colors.title },
                            ]}
                        >
                            Sample Business Codes:
                        </Text>
                        {sampleBusinesses.map((business) => (
                            <TouchableOpacity
                                key={business.id}
                                style={styles.sampleCodeItem}
                                onPress={() => {
                                    setManualCode(`business:${business.id}`);
                                }}
                            >
                                <View style={styles.sampleCodeRow}>
                                    <View style={styles.businessLogoContainer}>
                                        {business.logo && (
                                            <View
                                                style={
                                                    styles.businessLogoPlaceholder
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.businessLogoText
                                                    }
                                                >
                                                    {business.name.charAt(0)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.businessInfoContainer}>
                                        <Text
                                            style={[
                                                styles.businessName,
                                                { color: colors.title },
                                            ]}
                                        >
                                            {business.name}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.businessCode,
                                                { color: COLORS.primary },
                                            ]}
                                        >
                                            business:{business.id}
                                        </Text>
                                    </View>
                                    <Feather
                                        name="chevron-right"
                                        size={20}
                                        color="#999"
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.infoSection}>
                        <Text
                            style={[styles.infoTitle, { color: colors.title }]}
                        >
                            How to use QR Codes:
                        </Text>
                        <View style={styles.infoItem}>
                            <Feather
                                name="info"
                                size={16}
                                color={COLORS.primary}
                                style={styles.infoIcon}
                            />
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: colors.text },
                                ]}
                            >
                                In production, users would scan QR codes at
                                coffee shops.
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Feather
                                name="info"
                                size={16}
                                color={COLORS.primary}
                                style={styles.infoIcon}
                            />
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: colors.text },
                                ]}
                            >
                                For testing, use the sample codes above.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    simulatorContainer: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    qrImageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    simulatorText: {
        ...FONTS.fontMedium,
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
    },
    manualEntryContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    manualEntryTitle: {
        ...FONTS.fontMedium,
        fontSize: 18,
        marginBottom: 15,
    },
    manualInput: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        padding: 10,
        marginBottom: 15,
        ...FONTS.fontRegular,
    },
    submitButton: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    submitButtonText: {
        ...FONTS.fontMedium,
        fontSize: 16,
        color: "white",
    },
    sampleCodesContainer: {
        width: "100%",
        marginTop: 10,
    },
    sampleCodesTitle: {
        ...FONTS.fontMedium,
        fontSize: 16,
        marginBottom: 10,
    },
    sampleCodeItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    sampleCodeRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    businessLogoContainer: {
        marginRight: 10,
    },
    businessLogoPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    businessLogoText: {
        ...FONTS.fontBold,
        fontSize: 18,
        color: "white",
    },
    businessInfoContainer: {
        flex: 1,
    },
    businessName: {
        ...FONTS.fontMedium,
        fontSize: 16,
    },
    businessCode: {
        ...FONTS.fontRegular,
        fontSize: 14,
    },
    infoSection: {
        width: "100%",
        marginTop: 20,
        backgroundColor: "rgba(0,0,0,0.03)",
        padding: 15,
        borderRadius: 8,
    },
    infoTitle: {
        ...FONTS.fontMedium,
        fontSize: 16,
        marginBottom: 10,
    },
    infoItem: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "flex-start",
    },
    infoIcon: {
        marginRight: 8,
        marginTop: 3,
    },
    infoText: {
        ...FONTS.fontRegular,
        fontSize: 14,
        flex: 1,
    },
});

export default ScanQR;
