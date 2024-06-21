import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList } from "react-native";
import useAppwrite from "../../lib/useAppwrite";
import {
    getUserPosts,
    getTotalFollower,
    getTotalFollowing,
    getUserById,
    follow,
    unfollow,
    isFollowing,
} from "../../lib/appwrite";
import { CustomButton, EmptyState, InfoBox, VideoCard } from "../../components";

const OtherUserProfile = () => {
    const { userId } = useLocalSearchParams();
    const { data: user } = useAppwrite(() => getUserById(userId));
    const { data: posts } = useAppwrite(() => getUserPosts(userId));
    const { data: followers } = useAppwrite(() => getTotalFollower(userId, userId));
    const { data: followings } = useAppwrite(() => getTotalFollowing());

    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const checkFollowing = async () => {
            const result = await isFollowing(userId);
            setFollowing(result);
        };

        checkFollowing();
    }, [userId]);

    const handleFollow = async () => {
        if (following) {
            await unfollow(userId);
            setFollowing(false);
        } else {
            await follow(userId);
            setFollowing(true);
        }
    };

    const handleMessage = () => {
        //router.push(`/chat/${userId}`);
    }

    return (
        <SafeAreaView className="bg-primary h-full">
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
                        isBottomShow={false}
                        userId={item.creator.$id}
                    />
                )}
                ListEmptyComponent={() => (
                    <>
                        <EmptyState
                            title="No Videos Found"
                            subtitle="No videos found for this profile"
                        />
                        <CustomButton
                            title="Back to Explore"
                            handlePress={() => router.push("/home")}
                            containerStyles="w-[90%] my-5 mx-auto"
                        />
                    </>
                )}
                ListHeaderComponent={() => (
                    <View className="flex-col">
                        <View className="flex-row justify-center items-center mb-10">
                            <View className="w-16 h-16 border border-secondary rounded-full flex justify-center items-center ml-5">
                                <Image
                                    source={{ uri: user?.avatar }}
                                    className="w-[90%] h-[90%] rounded-full"
                                    resizeMode="cover"
                                />
                            </View>

                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                titleStyles="text-xl"
                                containerStyles="flex-1"
                            />
                            <InfoBox
                                title={followers?.length || 0}
                                subtitle="Followers"
                                titleStyles="text-xl"
                                containerStyles="flex-1"
                            />
                            <InfoBox
                                title={followings?.length || 0}
                                subtitle="Followings"
                                titleStyles="text-xl"
                                containerStyles="flex-1"
                            />
                        </View>

                        <View className="flex flex-row mb-6">
                            <CustomButton
                                title={following ? "Unfollow" : "Follow"}
                                handlePress={handleFollow}
                                containerStyles={`w-[30%] h-[40px] mx-5 flex-1 bg-secondary text-white ${following ? "bg-white text-secondary" : "bg-secondary text-white"}`}
                            />
                            <CustomButton
                                title="Message"
                                handlePress={handleMessage}
                                containerStyles="w-[30%] h-[40px] mx-5 flex-1 bg-white text-secondary"
                            />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

export default OtherUserProfile