import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut, getTotalFollower, getTotalFollowing } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { CustomButton, EmptyState, InfoBox, VideoCard } from "../../components";

const Profile = () => {
    const { user, setUser, setIsLogged } = useGlobalContext();
    const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
    const { data: followers } = useAppwrite(() => getTotalFollower(user.$id, user.$id));
    const { data: followings } = useAppwrite(() => getTotalFollowing());

    console.log("FOLLOWERS", followers);
    console.log("FOLLOWINGS", followings);

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLogged(false);

        router.replace("/sign-in");
    };

    const editProfile = () => {
        router.push("../other/edit-profile");
    };

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
                        creatorId={item.creator.$id}
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
                    <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
                        <TouchableOpacity
                            onPress={logout}
                            className="flex w-full items-end mb-10"
                        >
                            <Image
                                source={icons.logout}
                                resizeMode="contain"
                                className="w-6 h-6"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center" onPress={editProfile}>
                            <Image
                                source={{ uri: user?.avatar }}
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>

                        <InfoBox
                            title={user?.username}
                            containerStyles="mt-5"
                            titleStyles="text-lg"
                        />

                        <View className="mt-5 flex flex-row">
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
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Profile;
