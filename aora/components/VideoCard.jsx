import React, { useContext, useEffect, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Dimensions } from "react-native";
import { icons } from "../constants";
import {
    saveVideo,
    getSavedVideos,
    unsaveVideo,
    deleteVideoPost,
    likeVideo,
    unlikeVideo,
    getLikedVideos,
    getTotalLikes,
    follow,
    unfollow,
    getTotalFollowing,
    createFirstChat,
} from "../lib/appwrite";
import CustomAlert from "./CustomAlert";
import { useRouter } from "expo-router";
import { FollowingContext } from '../context/FollowingProvider';

const VideoCard = ({ title, creator, avatar, thumbnail, video, isUserPost, videoId, isBottomShow, creatorId }) => {
    const [play, setPlay] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isSaved, setIsSaved] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const { following, addFollowing, removeFollowing, setFollowing } = useContext(FollowingContext);

    useEffect(() => {
        const fetchFollowing = async () => {
            const following = await getTotalFollowing();
            setFollowing(following);
        };

        fetchFollowing();
    }, []);

    const isFollowing = following.includes(creatorId);

    useEffect(() => {
        const fetchLikes = async () => {
            const likes = await getTotalLikes(videoId);
            setLikes(likes);
        };

        fetchLikes();
    }, [videoId]);

    useEffect(() => {
        const checkIsLiked = async () => {
            const likes = await getLikedVideos();
            setIsLiked(likes.some(likedVideo => likedVideo.$id === videoId));
        };

        checkIsLiked();
    }, [videoId]);


    useEffect(() => {
        const checkIsSaved = async () => {
            const savedVideos = await getSavedVideos();
            setIsSaved(savedVideos.some(savedVideo => savedVideo.$id === videoId));
        };

        checkIsSaved();
    }, [videoId]);

    const menuRef = useRef(null);
    const screenWidth = Dimensions.get("window").width;

    const handleMenuPress = () => {
        menuRef.current.measure((fx, fy, width, height, px, py) => {
            const xPosition = px + width > screenWidth - 100 ? screenWidth - 100 : px;
            setMenuPosition({ x: xPosition, y: py });
            setModalVisible(true);
        });
    };

    const handleDelete = async () => {
        await deleteVideoPost(videoId);
        setAlertVisible(false);
    };

    const editPost = () => {
        router.push({ pathname: '../other/edit-post', params: { videoId } });
    };

    const handleMenuSelect = async (value) => {
        setModalVisible(false);
        switch (value) {
            case 'save':
                if (isSaved) {
                    await unsaveVideo(videoId);
                    setIsSaved(false);
                } else {
                    await saveVideo(videoId);
                    setIsSaved(true);
                }
                break;
            case 'delete':
                setAlertVisible(true);
                break;
            case 'edit':
                editPost();
                break;
            default:
                break;
        }
    };
    const handleLike = async () => {
        if (isLiked) {
            await unlikeVideo(videoId);
            setIsLiked(false);
            setLikes(likes - 1);
        } else {
            await likeVideo(videoId);
            setIsLiked(true);
            setLikes(likes + 1);
        }
    };

    const handleComment = () => {
        console.log('comment')
    }

    const handleSave = async () => {
        if (isSaved) {
            await unsaveVideo(videoId);
            setIsSaved(false);
        } else {
            await saveVideo(videoId);
            setIsSaved(true);
        }
    }

    const handleFollow = () => {
        if (isFollowing) {
            unfollow(creatorId)
                .then(() => {
                    removeFollowing(creatorId);
                })
                .catch((error) => {
                    console.error('Failed to unfollow:', error);
                });
        } else {
            follow(creatorId)
                .then(() => {
                    addFollowing(creatorId);
                    createFirstChat(creatorId);
                })
                .catch((error) => {
                    console.error('Failed to follow:', error);
                });
        }
    };

    const handleGoToProfile = () => {
        if (isUserPost) {
            router.replace('profile');
        } else {
            router.push({ pathname: '../other/other-user-profile', params: { userId: creatorId } });
        }
    }

    return (
        <View className="flex flex-col items-center px-4 mb-5">
            {isBottomShow && (
                <View className="flex flex-row gap-3 items-start">
                    <View className="flex justify-center items-center flex-row flex-1">
                        <TouchableOpacity className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5" onPress={handleGoToProfile}>
                            <Image
                                source={{ uri: avatar }}
                                className="w-full h-full rounded-lg"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>

                        <View className="flex justify-center flex-1 ml-3 gap-y-1">
                            <Text
                                className="font-psemibold text-sm text-white"
                                numberOfLines={1}
                            >
                                {title}
                            </Text>
                            <View className="flex-row">
                                <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{creator}  </Text>
                                {!isUserPost && (
                                    isFollowing ? (
                                        <TouchableOpacity onPress={handleFollow}>
                                            <Text className="text-xs text-blue-500 font-pregular">Following</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={handleFollow}>
                                            <Text className="text-xs text-blue-500 font-pregular">Follow</Text>
                                        </TouchableOpacity>
                                    )
                                )}
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ padding: 10 }} ref={menuRef} onPress={handleMenuPress}>
                        <Image source={icons.menu} style={{ width: 20, height: 20 }} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            )}

            {play ? (
                <Video
                    source={{ uri: video }}
                    className="w-full h-60 rounded-xl mt-3"
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.didJustFinish) {
                            setPlay(false);
                        }
                    }}
                />
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                    className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full rounded-xl mt-3"
                        resizeMode="cover"
                    />

                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}

            {isBottomShow && (
                <View className="flex-row w-full px-2 pt-8 pb-5">
                    <View className="flex-1 flex-row align-middle gap-3">
                        <TouchableOpacity onPress={handleLike}>
                            <Image source={isLiked ? icons.like : icons.unlike} className="w-8 h-8" resizeMode="contain" />
                        </TouchableOpacity>
                        <Text className="text-white font-psemibold text-lg">{likes}</Text>
                    </View>
                    <View className="flex-1 flex-row justify-end">
                        {!isUserPost && (
                            <TouchableOpacity onPress={handleSave}>
                                <Image source={isSaved ? icons.saved : icons.unsaved} className="w-8 h-8" resizeMode="contain" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleComment}>
                            <Image source={icons.comment} className="w-8 h-8 ml-5" resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={[styles.modalContent, { top: menuPosition.y, left: menuPosition.x }]}>
                        {!isUserPost && (
                            <TouchableOpacity onPress={() => handleMenuSelect('save')} style={styles.modalOption}>
                                <Text style={styles.modalOptionText}>{isSaved ? 'Saved' : 'Save'}</Text>
                            </TouchableOpacity>
                        )}
                        {isUserPost && (
                            <>
                                <TouchableOpacity onPress={() => handleMenuSelect('edit')} style={styles.modalOption}>
                                    <Text style={styles.modalOptionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleMenuSelect('delete')} style={styles.modalOption}>
                                    <Text style={styles.modalOptionText}>Delete</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
            <CustomAlert
                visible={alertVisible}
                title="Delete Video"
                message="Are you sure you want to delete this video?"
                onClose={() => setAlertVisible(false)}
                onConfirm={handleDelete}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        position: "absolute",
        backgroundColor: "#FF9C01",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalOption: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    modalOptionText: {
        fontSize: 16,
        color: "#161622",
        fontFamily: "Poppins-SemiBold",
    },
});

export default VideoCard;
