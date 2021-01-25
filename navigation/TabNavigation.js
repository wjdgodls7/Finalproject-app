import React from 'react';
import { View, Platform } from "react-native";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign } from '@expo/vector-icons';
import Home from "../screens/Home";
import Search from "../screens/tabs/serch/SearchContainer";
import Notifications from "../screens/tabs/Notifications";
import Profile from "../screens/tabs/Profile";
import MessagesLink from '../components/MessagesLink';
import NavIcon from "../components/NavIcon";
import styled from "styled-components/native";
import constants from "../constants";
import styles from '../styles';
import Detail from '../screens/Detail'
import UserDetail from '../screens/UserDetail'

const stackFactory = (initialRoute, customConfig) =>
    createStackNavigator({
        InitialRoute: {
            screen: initialRoute,
            navigationOptions: { ...customConfig }
        },
        Detail: {
            screen: Detail,
            navigationOptions: {
                headerTintColor: styles.blackColor,
                headerBackTitle: null,
                title: "Photo"
            }
        },
        UserDetail: {
            screen: UserDetail,
            headerTintColor: styles.blackColor,
            navigationOptions: ({ navigation }) => ({
                title: navigation.getParam("username")
            })
        }
    },
        {
            defaultNavigationOptions: {
                headerBackTitle: null,
                headerTintColor: styles.blackColor
            }
        });
const Image = styled.Image`
  margin-top : -30px;
  margin-bottom : -30px;
  width: ${constants.width / 2.8};
    margin-left : -15px;
  `;

export default createBottomTabNavigator(
    {
        Home: {
            screen: stackFactory(Home, {
                headerRight: () => <MessagesLink />,
                headerTitle: () => <Image resizeMode={"contain"} source={require("../assets/logo.png")} />
            }),
            navigationOptions: {
                tabBarIcon: ({ focused }) => (
                    <NavIcon
                        focused={focused}
                        name={Platform.OS === "ios" ? focused ? "home-sharp" : "home-outline" : focused ? "home-sharp" : "home-outline"} size={22} />
                )
            }
        },
        Search: {
            screen: stackFactory(Search, {
                headerBackTitle: null
            }),
            navigationOptions: {
                tabBarIcon: ({ focused }) => (
                    <NavIcon
                        focused={focused} name={Platform.OS === "ios" ? focused ? "ios-search-sharp" : "ios-search-outline" : focused ? "md-search-sharp" : "md-search-outline"} />
                )
            }
        },
        Add: {
            screen: View,
            navigationOptions: {
                tabBarOnPress: ({ navigation }) =>
                    navigation.navigate("PhotoNavigation"),
                tabBarIcon: ({ focused }) => (
                    <NavIcon
                        focused={focused} name={Platform.OS === "ios" ? "ios-add" : "md-add"} size={32} />
                )
            }
        },
        Notifications: {
            screen: stackFactory(Notifications, {
                title: "Notifications"
            }),
            navigationOptions: {
                tabBarIcon: ({ focused }) => (
                    <AntDesign
                        focused={focused} name={focused ? "star" : "staro"} size={26} color={focused ? styles.navyColor : styles.darkGreyColor} />
                )
            }
        },
        Profile: {
            screen: stackFactory(Profile, {
                title: "Profile"
            }),
            navigationOptions: {
                tabBarIcon: ({ focused }) => (
                    <NavIcon
                        focused={focused} name={Platform.OS === "ios" ? focused ? "person" : "person-outline" : focused ? "person" : "person-outline"} size={22} />
                )
            }
        }
    },
    {
        initialRouteName: "Search",
        tabBarOptions: {
            showLabel: false

        }
    }
);