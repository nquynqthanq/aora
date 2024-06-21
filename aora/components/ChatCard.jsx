import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import useAppwrite from '../lib/useAppwrite'
import { getUserById, getCurrentUser } from '../lib/appwrite'

const ChatCard = ({
    chatId,
    members,
    latestMessage,
}) => {
    const { data: currentUser } = useAppwrite(getCurrentUser);
    const { data: user } = useAppwrite(() => getUserById(members.find(member => member !== currentUser.$id)));

    const chatdetail = () => {
        router.push({ pathname: '../other/detail-chat', params: { chatId: chatId } });
    }
    return (
        <TouchableOpacity className="flex flex-row items-center px-4 mb-5" onPress={chatdetail}>
            <View className="flex flex-row items-center">
                <View className="w-[50px] h-[50px] rounded-full border border-secondary flex justify-center items-center">
                    <Image
                        source={{ uri: user.avatar }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                    />
                </View>
                <View className="ml-4">
                    <Text className="text-lg font-semibold text-white">{user.username}</Text>
                    <Text className="text-sm font-semibold text-gray-400">{latestMessage.text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ChatCard