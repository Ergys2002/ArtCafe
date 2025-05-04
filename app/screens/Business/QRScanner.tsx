import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants/theme";
import Header from "../../layout/Header";
import { sampleBusinesses } from "../../models/BusinessModel";

const QRScanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const theme = useTheme();
    const { colors } = theme;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // Check if the QR code contains a business ID
        if (data && data.startsWith("business:")) {
            const businessId = data.split("business:")[1];
            // Check if this business exists in our database
            const business = sampleBusinesses.find((b) => b.id === businessId);

            if (business) {
                // Navigate to business details
                navigation.navigate("BusinessDetails", { businessId });
            } else {
                // Show error or feedback
                alert(
                    "Business not found. Please try scanning a valid QR code."
                );
                setScanned(false);
            }
        } else {
            // Generic QR code
            alert(
                `Bar code with type ${type} and data ${data} has been scanned!`
            );
            setScanned(false);
        }
    };

    const toggleFlash = () => {
        setFlashMode(
            flashMode === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
        );
    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <SafeAreaView
                style={[
                    styles.permissionContainer,
                    { backgroundColor: colors.background },
                ]}
            >
                <Text style={[styles.permissionText, { color: colors.title }]}>
                    Camera permission is required to scan QR codes.
                </Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={() => Camera.requestCameraPermissionsAsync()}
                >
                    <Text style={styles.permissionButtonText}>
                        Grant Permission
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Header title="Scan QR Code" leftIcon="back" />

            <View style={styles.cameraContainer}>
                <Camera
                    style={styles.camera}
                    type={Camera.Constants.Type.back}
                    flashMode={flashMode}
                    onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                >
                    <View style={styles.overlay}>
                        <View style={styles.unfocusedArea} />
                        <View style={styles.middleRow}>
                            <View style={styles.unfocusedArea} />
                            <View style={styles.focusedArea}>
                                <View style={styles.scannerCorner} />
                                <View
                                    style={[
                                        styles.scannerCorner,
                                        {
                                            top: 0,
                                            right: 0,
                                            transform: [{ rotate: "90deg" }],
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.scannerCorner,
                                        {
                                            bottom: 0,
                                            right: 0,
                                            transform: [{ rotate: "180deg" }],
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.scannerCorner,
                                        {
                                            bottom: 0,
                                            left: 0,
                                            transform: [{ rotate: "270deg" }],
                                        },
                                    ]}
                                />
                            </View>
                            <View style={styles.unfocusedArea} />
                        </View>
                        <View style={styles.unfocusedArea} />
                    </View>
                </Camera>
            </View>

            <View style={styles.instructionsContainer}>
                <Text
                    style={[styles.instructionsText, { color: colors.title }]}
                >
                    Align the QR code within the frame to scan
                </Text>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleFlash}>
                    <Feather
                        name={
                            flashMode === Camera.Constants.FlashMode.off
                                ? "zap-off"
                                : "zap"
                        }
                        size={24}
                        color={COLORS.primary}
                    />
                    <Text style={styles.buttonText}>
                        {flashMode === Camera.Constants.FlashMode.off
                            ? "Flash Off"
                            : "Flash On"}
                    </Text>
                </TouchableOpacity>

                {scanned && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setScanned(false)}
                    >
                        <Feather
                            name="refresh-cw"
                            size={24}
                            color={COLORS.primary}
                        />
                        <Text style={styles.buttonText}>Scan Again</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const windowWidth = Dimensions.get("window").width;
const scannerSize = windowWidth * 0.7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        overflow: "hidden",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    unfocusedArea: {
        flex: 1,
    },
    middleRow: {
        flexDirection: "row",
        height: scannerSize,
    },
    focusedArea: {
        width: scannerSize,
        height: scannerSize,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "transparent",
        position: "relative",
    },
    scannerCorner: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 30,
        height: 30,
        borderColor: COLORS.primary,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: 16,
    },
    instructionsContainer: {
        padding: 20,
        alignItems: "center",
    },
    instructionsText: {
        ...FONTS.fontMedium,
        fontSize: 16,
        textAlign: "center",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    buttonText: {
        ...FONTS.fontMedium,
        fontSize: 14,
        color: COLORS.primary,
        marginTop: 5,
    },
    permissionContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    permissionText: {
        ...FONTS.fontMedium,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    permissionButtonText: {
        ...FONTS.fontMedium,
        fontSize: 16,
        color: "white",
    },
});

export default QRScanner;
