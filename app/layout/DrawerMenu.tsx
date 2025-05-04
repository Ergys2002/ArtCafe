import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { IMAGES } from "../constants/Images";
import { COLORS, FONTS } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import ThemeBtn from "../components/ThemeBtn";
import { useDispatch } from "react-redux";
import { closeDrawer } from "../redux/actions/drawerAction";
import { GlobalStyleSheet } from "../constants/StyleSheet";

const MenuItems = [
    {
        id: "0",
        icon: IMAGES.home,
        name: "Home",
        navigate: "Home",
    },
    {
        id: "1",
        icon: IMAGES.producta,
        name: "Products",
        navigate: "Products",
    },
    {
        id: "2",
        icon: IMAGES.gift,
        name: "Loyalty Rewards",
        navigate: "Rewards",
        highlight: true,
    },
    {
        id: "6",
        icon: IMAGES.order,
        name: "My Orders",
        navigate: "Myorder",
    },
    {
        id: "9",
        icon: IMAGES.user3,
        name: "Profile",
        navigate: "Profile",
    },
    {
        id: "10",
        icon: IMAGES.logout,
        name: "Logout",
        navigate: "SingIn",
    },
];

const DrawerMenu = ({ navigation }: any) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { colors }: { colors: any } = theme;

    const [active, setactive] = useState(MenuItems[0]);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        paddingVertical: 30,
                        paddingRight: 10,
                    }}
                >
                    <Image
                        style={{
                            height: 70,
                            width: 70,
                            borderRadius: 35,
                            resizeMode: "cover",
                        }}
                        source={
                            theme.dark ? IMAGES.appnamedark : IMAGES.appname
                        }
                    />
                </View>
                <View
                    style={[
                        GlobalStyleSheet.flex,
                        {
                            paddingHorizontal: 15,
                            paddingBottom: 20,
                        },
                    ]}
                >
                    <Text
                        style={{
                            ...FONTS.fontSemiBold,
                            fontSize: 20,
                            color: colors.title,
                        }}
                    >
                        Main Menus
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.closeDrawer()}
                        activeOpacity={0.5}
                    >
                        <Feather size={24} color={colors.title} name="x" />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    {MenuItems.map((data: any, index: any) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    data.navigate === "DrawerNavigation"
                                        ? dispatch(closeDrawer())
                                        : dispatch(closeDrawer());
                                    navigation.navigate(data.navigate);
                                }}
                                key={index}
                                style={[
                                    GlobalStyleSheet.flex,
                                    {
                                        paddingVertical: 5,
                                        marginBottom: 0,
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 20,
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 45,
                                            width: 45,
                                            borderRadius: 10,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: data.highlight
                                                ? "rgba(22, 192, 51, 0.1)"
                                                : "transparent",
                                        }}
                                    >
                                        <Image
                                            source={data.icon}
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor:
                                                    data.id == "10"
                                                        ? "#FF8484"
                                                        : data.id === "0" ||
                                                          data.highlight
                                                        ? COLORS.primary
                                                        : "#BDBDBD",
                                                resizeMode: "contain",
                                            }}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            FONTS.fontRegular,
                                            {
                                                color: colors.title,
                                                fontSize: 16,
                                                opacity: 0.6,
                                            },
                                            (data.id === "0" ||
                                                data.highlight) && {
                                                ...FONTS.fontSemiBold,
                                                fontSize: 16,
                                                color: COLORS.primary,
                                            },
                                        ]}
                                    >
                                        {data.name}
                                    </Text>
                                    {data.highlight && (
                                        <View
                                            style={{
                                                backgroundColor: COLORS.primary,
                                                paddingHorizontal: 8,
                                                paddingVertical: 3,
                                                borderRadius: 12,
                                                marginLeft: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...FONTS.fontMedium,
                                                    fontSize: 10,
                                                    color: "#FFFFFF",
                                                }}
                                            >
                                                NEW
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <ThemeBtn />
                </View>
                <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                    <Text
                        style={{
                            ...FONTS.fontMedium,
                            fontSize: 16,
                            color: "#868686",
                        }}
                    >
                        Art Coffee App
                    </Text>
                    
                </View>
            </View>
        </ScrollView>
    );
};

export default DrawerMenu;
