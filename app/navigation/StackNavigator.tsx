import React from "react";
import {
    createStackNavigator,
    CardStyleInterpolators,
} from "@react-navigation/stack";
import { RootStackParamList } from "./RootStackParamList";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";

import Onboarding from "../screens/Auth/Onboarding";
import WelCome from "../screens/Auth/WelCome";
import SignUp from "../screens/Auth/SignUp";
import SingIn from "../screens/Auth/SingIn";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import OTPAuthentication from "../screens/Auth/OTPAuthentication";
import NewPassword from "../screens/Auth/NewPassword";
import DrawerNavigation from "./DrawerNavigation";
import BottomNavigation from "./BottomNavigation";
import Notification from "../screens/Notification/Notification";
import Search from "../screens/Search/Search";
import Products from "../screens/Category/Products";
import ProductsDetails from "../screens/Category/ProductsDetails";
import DeliveryAddress from "../screens/Payment/DeliveryAddress";
import AddDeliveryAddress from "../screens/Payment/AddDeliveryAddress";
import Payment from "../screens/Payment/Payment";
import Addcard from "../screens/Payment/Addcard";
import Checkout from "../screens/Payment/Checkout";
import Myorder from "../screens/Myorder/Myorder";
import Writereview from "../screens/Myorder/Writereview";
import Rewards from "../screens/Myorder/Rewards";
import Trackorder from "../screens/Myorder/Trackorder";
import Chat from "../screens/Chat/Chat";
import Singlechat from "../screens/Chat/Singlechat";
import Call from "../screens/Chat/Call";
import Demo from "../screens/Home/Demo";
import EditProfile from "../screens/Profile/EditProfile";
// Business related imports
import BusinessList from "../screens/Business/BusinessList";
import BusinessDetails from "../screens/Business/BusinessDetails";
import ScanQR from "../screens/Business/ScanQR";

const StackComponent = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
    const theme = useTheme();

    return (
        <View style={{ width: "100%", flex: 1 }}>
            <StackComponent.Navigator
                initialRouteName="Onboarding"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: "transparent" },
                    // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
            >
                <StackComponent.Screen
                    name="Onboarding"
                    component={Onboarding}
                />
                <StackComponent.Screen name="WelCome" component={WelCome} />
                <StackComponent.Screen name="SignUp" component={SignUp} />
                <StackComponent.Screen name="SingIn" component={SingIn} />
                <StackComponent.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                />
                <StackComponent.Screen
                    name="OTPAuthentication"
                    component={OTPAuthentication}
                />
                <StackComponent.Screen
                    name="NewPassword"
                    component={NewPassword}
                />
                <StackComponent.Screen
                    name="DrawerNavigation"
                    component={DrawerNavigation}
                />
                <StackComponent.Screen
                    name="BottomNavigation"
                    component={BottomNavigation}
                />
                <StackComponent.Screen
                    name="Notification"
                    component={Notification}
                />
                <StackComponent.Screen name="Search" component={Search} />
                <StackComponent.Screen name="Products" component={Products} />
                <StackComponent.Screen
                    name="ProductsDetails"
                    component={ProductsDetails}
                />
                <StackComponent.Screen
                    name="DeliveryAddress"
                    component={DeliveryAddress}
                />
                <StackComponent.Screen
                    name="AddDeliveryAddress"
                    component={AddDeliveryAddress}
                />
                <StackComponent.Screen name="Payment" component={Payment} />
                <StackComponent.Screen name="Addcard" component={Addcard} />
                <StackComponent.Screen name="Checkout" component={Checkout} />
                <StackComponent.Screen name="Myorder" component={Myorder} />
                <StackComponent.Screen
                    name="Trackorder"
                    component={Trackorder}
                />
                <StackComponent.Screen
                    name="Writereview"
                    component={Writereview}
                />
                <StackComponent.Screen name="Rewards" component={Rewards} />
                <StackComponent.Screen name="Demo" component={Demo} />
                <StackComponent.Screen name="Chat" component={Chat} />
                <StackComponent.Screen
                    name="Singlechat"
                    component={Singlechat}
                />
                <StackComponent.Screen name="Call" component={Call} />
                <StackComponent.Screen
                    name="EditProfile"
                    component={EditProfile}
                />

                {/* Business screens */}
                <StackComponent.Screen
                    name="BusinessList"
                    component={BusinessList}
                />
                <StackComponent.Screen
                    name="BusinessDetails"
                    component={BusinessDetails}
                />
                <StackComponent.Screen name="ScanQR" component={ScanQR} />
            </StackComponent.Navigator>
        </View>
    );
};

export default StackNavigator;
