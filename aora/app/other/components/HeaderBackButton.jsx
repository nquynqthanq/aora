import { Pressable } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { router } from "expo-router";

export default HeaderBackButton = () => {

    const handleGoBack = () => {
        router.back();
    };

    return (
        <Pressable
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            onPress={handleGoBack}
            style={{ marginRight: 20 }}
        >
            <Icon name="chevron-left" size={25} color='#161622' />
        </Pressable>
    );
};