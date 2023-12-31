

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/Profile";
import EditProfile from "../screens/EditProfile";

// Create stack of screen, so 'edit' can be pushed in 'Profile'
const Stack = createNativeStackNavigator();
const Profile = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Edit" component={EditProfile} />
        </Stack.Navigator>
    );
};

export default Profile;