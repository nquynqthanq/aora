import { FlatList, RefreshControl, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-animatable";
import useAppwrite from "../../lib/useAppwrite";
import { getCurrentUser, getChats } from "../../lib/appwrite";
import { EmptyState, SearchInput, ChatCard } from "../../components";
import { useEffect, useState } from "react";

const Chat = () => {
    const { data: currentUser, refetch } = useAppwrite(getCurrentUser);
    const { data: chats } = useAppwrite(getChats);
    const [refreshing, setRefreshing] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredChats, setFillteredChats] = useState([]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleSearch = (query) => {
        setQuery(query);
        setSearchPerformed(true);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <View className="flex my-6 px-4 space-y-6">
                <View className="flex flex-row justify-between items-center mb-5">
                    <Text className="text-2xl font-psemibold text-white">Chat</Text>
                </View>

                <SearchInput placeholder="Search" initialQuery={query} onSearch={handleSearch} />
            </View>
            {searchPerformed && (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <ChatCard
                            chatId={item.$id}
                            members={item.members}
                            latestMessage={item.latestMessage}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <EmptyState
                            title="No chats found"
                            subtitle="Chat"
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}

export default Chat;
