import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat';
import useAppwrite from '../../lib/useAppwrite';
import { getMessages, getUserById, createMessage } from '../../lib/appwrite';
import { useLocalSearchParams } from 'expo-router';

const DetailChat = () => {
    const { chatId } = useLocalSearchParams();
    const { data: messages } = useAppwrite(() => getMessages(chatId));
    const { data: sender } = useAppwrite(() => getUserById(messages.senderId));
    const [formatedMessages, setFormatedMessages] = useState([])

    useEffect(() => {
        const messagesLabel = messages.map(doc => ({
            _id: doc.$id,
            text: doc.text,
            createdAt: new Date(doc.createdAt),
            user: {
                _id: sender.$id,
                name: sender.username,
                avatar: sender.avatar,
            }
        }));
        setFormatedMessages(messagesLabel);
    }, [messages]);

    const onSend = async (newMessages = []) => {
        try {
            await createMessage(chatId, newMessages[0].text, sender.$id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View className="bg-primary h-full">
            <View className="flex flex-row justify-between items-center mb-5">
                <Text className="text-2xl font-psemibold text-white">Chat</Text>
            </View>
            <GiftedChat
                messages={formatedMessages}
                onSend={newMessages => onSend(newMessages)}
                user={{
                    _id: sender.$id,
                    name: sender.username,
                    avatar: sender.avatar,
                }}
            />
        </View>
    )
}

export default DetailChat