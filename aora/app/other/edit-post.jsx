import React, { useState, useEffect } from "react";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { icons } from "../../constants";
import { updatePost } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useLocalSearchParams } from "expo-router";
import { getPostById } from "../../lib/appwrite";
import { useToast } from "../../context/ToastProvider";

const EditPost = () => {
    const { videoId } = useLocalSearchParams();
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
    });
    // const [toastVisible, setToastVisible] = useState(false);
    // const [toastMessage, setToastMessage] = useState("");
    // const [toastTitle, setToastTitle] = useState("");

    const toast = useToast();

    useEffect(() => {
        if (videoId) {
            const fetchPost = async () => {
                const post = await getPostById(videoId);
                setForm({
                    title: post.title,
                    video: post.video,
                    thumbnail: post.thumbnail,
                    prompt: post.prompt,
                });
            };

            fetchPost();
        }
    }, [videoId]);

    const openPicker = async (selectType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type:
                selectType === "image"
                    ? ["image/png", "image/jpg"]
                    : ["video/mp4", "video/gif"],
        });

        if (!result.canceled) {
            if (selectType === "image") {
                setForm({
                    ...form,
                    thumbnail: result.assets[0],
                });
            }

            if (selectType === "video") {
                setForm({
                    ...form,
                    video: result.assets[0],
                });
            }
        } else {
            // setTimeout(() => {
            //     setToastTitle("Error");
            //     setToastMessage("No file selected");
            //     setToastVisible(true);
            // }, 100);
            toast("Error", "No file selected");
        }
    };

    const update = async () => {
        if (
            (form.prompt === "") |
            (form.title === "") |
            !form.thumbnail |
            !form.video
        ) {
            return (
                // setToastTitle("Error"),
                // setToastMessage("All fields are required"),
                // setToastVisible(true),
                // setTimeout(() => {
                //     setToastVisible(false);
                // }, 2500)
                toast("Error", "Please fill all the fields")
            )
        }

        setUploading(true);

        try {
            await updatePost(videoId, form);

            // setToastTitle("Success");
            // setToastMessage("Post updated successfully");
            // setUploading(false);
            // setToastVisible(true);
            // setTimeout(() => {
            //     setToastVisible(false);
            // }, 2500);
            toast("Success", "Post updated successfully");
        } catch (error) {
            // setUploading(false);
            // setToastTitle("Error");
            // setToastMessage("An error occurred while updating post");
            // setToastVisible(true);
            // setTimeout(() => {
            //     setToastVisible(false);
            // }, 2500);
            toast("Error", "An error occurred while updating post");
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4">
                <Text className="text-2xl text-white font-psemibold">Edit Video</Text>

                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video a catchy title..."
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Upload Video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("video")}>
                        {form.video ? (
                            <Video
                                source={{ uri: form.video.uri }}
                                className="w-full h-64 rounded-2xl"
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                            />
                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        alt="upload"
                                        className="w-1/2 h-1/2"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("image")}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode="cover"
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                                <Image
                                    source={icons.upload}
                                    resizeMode="contain"
                                    alt="upload"
                                    className="w-5 h-5"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FormField
                    title="AI Prompt"
                    value={form.prompt}
                    placeholder="The AI prompt of your video...."
                    handleChangeText={(e) => setForm({ ...form, prompt: e })}
                    otherStyles="mt-7"
                />

                <CustomButton
                    title="Update & Submit"
                    handlePress={update}
                    containerStyles="mt-7 mb-10"
                    isLoading={uploading}
                />
                {/* <CustomToast
                title={toastTitle}
                message={toastMessage}
                isVisible={toastVisible}
                /> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditPost;
