import { FlatList, RefreshControl, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-animatable";
import useAppwrite from "../../lib/useAppwrite";
import { getSavedVideos, getCurrentUser } from "../../lib/appwrite";
import { EmptyState, SearchInput, VideoCard } from "../../components";
import { useState } from "react";

const Bookmark = () => {
    const { data: posts, refetch } = useAppwrite(getSavedVideos);
    const { data: user } = useAppwrite(getCurrentUser);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    return (
        <SafeAreaView className="px-4 my-6 bg-primary h-full">
            <View className="flex flex-row justify-between items-center mb-5">
                <Text className="text-2xl font-psemibold text-white">Bookmarks</Text>
            </View>

            <SearchInput placeholder="Search your saved videos" />

            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        video={item.video}
                        creator={item.creator.username}
                        avatar={item.creator.avatar}
                        isUserPost={item.creator.$id === user?.$id}
                        videoId={item.$id}
                        isBottomShow={true}
                        creatorId={item.creator.$id}
                    />
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos created yet"
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className="mt-10"
            />
        </SafeAreaView>
    );
};

export default Bookmark;