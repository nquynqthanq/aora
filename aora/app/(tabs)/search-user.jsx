import { FlatList, RefreshControl, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-animatable";
import useAppwrite from "../../lib/useAppwrite";
import { getUsers } from "../../lib/appwrite";
import { EmptyState, SearchInput, UserCard } from "../../components";
import { useEffect, useState } from "react";

const SearchUser = () => {
    const { data: users, refetch } = useAppwrite(getUsers);
    const [refreshing, setRefreshing] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (query) {
            setFilteredUsers(users.filter(user => user.username.includes(query) || user.nickname.includes(query)));
        } else {
            setFilteredUsers([]);
        }
    }, [query, users]);

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
                    <Text className="text-2xl font-psemibold text-white">Search</Text>
                </View>

                <SearchInput placeholder="Search" initialQuery={query} onSearch={handleSearch} />
            </View>
            {searchPerformed && (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <UserCard
                            username={item.username}
                            nickname={item.nickname}
                            avatar={item.avatar}
                            userId={item.$id}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <EmptyState
                            title="No recent searches"
                            subtitle="Search"
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

export default SearchUser;
