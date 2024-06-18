import React, { useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Dimensions } from "react-native";
import { icons } from "../constants";

const VideoCard = ({ title, creator, avatar, thumbnail, video, isUserPost }) => {
    const [play, setPlay] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const menuRef = useRef(null);
    const screenWidth = Dimensions.get("window").width;

    const handleMenuPress = () => {
        menuRef.current.measure((fx, fy, width, height, px, py) => {
            const xPosition = px + width > screenWidth - 100 ? screenWidth - 100 : px;
            setMenuPosition({ x: xPosition, y: py });
            setModalVisible(true);
        });
    };

    const handleMenuSelect = (value) => {
        setModalVisible(false);
        switch (value) {
            case 'save':
                console.log('Save selected');
                break;
            case 'share':
                console.log('Share selected');
                break;
            case 'delete':
                console.log('Delete selected');
                break;
            default:
                break;
        }
    };

    return (
        <View className="flex flex-col items-center px-4 mb-14">
            <View className="flex flex-row gap-3 items-start">
                <View className="flex justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>

                    <View className="flex justify-center flex-1 ml-3 gap-y-1">
                        <Text
                            className="font-psemibold text-sm text-white"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                        <View className="flex-row">
                            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{creator}</Text>
                            <Text className="text-xs text-secondary font-pregular" numberOfLines={1}>  follow</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{ padding: 10 }} ref={menuRef} onPress={handleMenuPress}>
                    <Image source={icons.menu} style={{ width: 20, height: 20 }} resizeMode="contain" />
                </TouchableOpacity>
            </View>

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
                        <TouchableOpacity onPress={() => handleMenuSelect('save')} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleMenuSelect('share')} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Share</Text>
                        </TouchableOpacity>
                        {isUserPost && (
                            <TouchableOpacity onPress={() => handleMenuSelect('delete')} style={styles.modalOption}>
                                <Text style={styles.modalOptionText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
