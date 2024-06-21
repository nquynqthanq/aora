import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';

const UserCard = ({
    username,
    nickname,
    avatar,
    userId,
}) => {

    const handleGoToProfile = () => {
        router.push({ pathname: '../other/other-user-profile', params: { userId: userId } });
    }

    return (
        <View className="flex flex-row items-center px-4 mb-5">
            <View className="flex flex-row items-center">
                <TouchableOpacity className="w-[50px] h-[50px] rounded-full border border-secondary flex justify-center items-center" onPress={handleGoToProfile}>
                    <Image
                        source={{ uri: avatar }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <View className="ml-4">
                    <Text className="text-lg font-semibold text-white">{username}</Text>
                    <Text className="text-sm font-semibold text-gray-400">{nickname}</Text>
                </View>
            </View>
        </View>
    )
}

export default UserCard