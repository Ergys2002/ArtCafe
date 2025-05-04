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
import Components from "../screens/Components/Components";
import AccordionScreen from "../screens/Components/Accordion";
import BottomSheet from "../screens/Components/BottomSheet";
import ModalBox from "../screens/Components/ModalBox";
import Buttons from "../screens/Components/Buttons";
import Badges from "../screens/Components/Badges";
import Charts from "../screens/Components/Charts";
import Headers from "../screens/Components/Headers";
import Footers from "../screens/Components/Footers";
import TabStyle1 from "../components/Footers/FooterStyle1";
import TabStyle2 from "../components/Footers/FooterStyle2";
import TabStyle3 from "../components/Footers/FooterStyle3";
import TabStyle4 from "../components/Footers/FooterStyle4";
import Inputs from "../screens/Components/Inputs";
import ListScreen from "../screens/Components/lists";
import Pricings from "../screens/Components/Pricings";
import DividerElements from "../screens/Components/DividerElements";
import Snackbars from "../screens/Components/Snackbars";
import Socials from "../screens/Components/Socials";
import SwipeableScreen from "../screens/Components/Swipeable";
import Tabs from "../screens/Components/Tabs";
import Tables from "../screens/Components/Tables";
import Toggles from "../screens/Components/Toggles";
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

                <StackComponent.Screen
                    name="Components"
                    component={Components}
                />
                <StackComponent.Screen
                    name="Accordion"
                    component={AccordionScreen}
                />
                <StackComponent.Screen
                    name="BottomSheet"
                    component={BottomSheet}
                />
                <StackComponent.Screen name="ModalBox" component={ModalBox} />
                <StackComponent.Screen name="Buttons" component={Buttons} />
                <StackComponent.Screen name="Badges" component={Badges} />
                <StackComponent.Screen name="Charts" component={Charts} />
                <StackComponent.Screen name="Headers" component={Headers} />
                <StackComponent.Screen name="Footers" component={Footers} />
                <StackComponent.Screen name="TabStyle1" component={TabStyle1} />
                <StackComponent.Screen name="TabStyle2" component={TabStyle2} />
                <StackComponent.Screen name="TabStyle3" component={TabStyle3} />
                <StackComponent.Screen name="TabStyle4" component={TabStyle4} />
                <StackComponent.Screen name="Inputs" component={Inputs} />
                <StackComponent.Screen name="lists" component={ListScreen} />
                <StackComponent.Screen name="Pricings" component={Pricings} />
                <StackComponent.Screen
                    name="DividerElements"
                    component={DividerElements}
                />
                <StackComponent.Screen name="Snackbars" component={Snackbars} />
                <StackComponent.Screen name="Socials" component={Socials} />
                <StackComponent.Screen
                    name="Swipeable"
                    component={SwipeableScreen}
                />
                <StackComponent.Screen name="Tabs" component={Tabs} />
                <StackComponent.Screen name="Tables" component={Tables} />
                <StackComponent.Screen name="Toggles" component={Toggles} />
            </StackComponent.Navigator>
        </View>
    );
};

export default StackNavigator;
