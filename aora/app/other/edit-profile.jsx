import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { getCurrentUser, updateUserProfile } from '../../lib/appwrite';
import { FormField, CustomToast } from '../../components';
import CustomButton from '../../components/CustomButton';
import useAppwrite from "../../lib/useAppwrite";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useToast } from '../../context/ToastProvider';

const EditProfile = () => {
    const { data: user } = useAppwrite(getCurrentUser);
    const [username, setUsername] = useState(user?.username);
    const [avatar, setAvatar] = useState(user?.avatar);
    const { setUser } = useGlobalContext();
    // const [toastVisible, setToastVisible] = useState(false);
    // const [toastMessage, setToastMessage] = useState("");
    // const [toastTitle, setToastTitle] = useState("");

    const toast = useToast();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setAvatar(user.avatar);
        }
    }, [user]);

    const handleImagePicker = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            return (
                // setToastTitle("Warning"),
                // setToastMessage("You need to enable permissions to access the library"),
                // setToastVisible(true),
                // setTimeout(() => {
                //     setToastVisible(false);
                // }, 2500)
                toast("Warning", "You need to enable permissions to access the library")
            )
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleUpdate = async () => {
        if (!username || !avatar) {
            // return (
            //     setToastTitle("Warning"),
            //     setToastMessage("Please fill all fields"),
            //     setToastVisible(true),
            //     setTimeout(() => {
            //         setToastVisible(false);
            //     }, 2500)
            // )
            toast("Warning", "Please fill all fields")
            return;
        }

        try {
            await updateUserProfile(user.$id, { username, avatar });
            await setUser({ ...user, username, avatar });
            // setToastTitle("Success"),
            //     setToastMessage("Profile updated successfully"),
            //     setToastVisible(true),
            //     setTimeout(() => {
            //         setToastVisible(false);
            //     }, 2500)
            toast("Success", "Profile updated successfully");
            router.replace("../(tabs)/profile");
        } catch (error) {
            // setToastTitle("Error"),
            //     setToastMessage("An error occurred while updating profile"),
            //     setToastVisible(true),
            //     setTimeout(() => {
            //         setToastVisible(false);
            //     }, 2500)
            toast("Error", "An error occurred while updating profile");
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full items-center">
            <TouchableOpacity onPress={handleImagePicker}>
                <Image
                    source={{ uri: avatar }}
                    className="w-24 h-24 rounded-full"
                    resizeMode="cover"
                />
            </TouchableOpacity>
            <FormField
                title="Username"
                value={username}
                onChangeText={setUsername}
                otherStyles="w-[90%] mt-7"
            />
            <FormField
                title="Email (Uneditable)"
                value={user?.email}
                otherStyles="w-[90%] mt-7"
                editable={false}
            />
            <CustomButton
                title="Update Profile"
                handlePress={handleUpdate}
                containerStyles="w-[90%] mt-20"
            />
            {/* <CustomToast
                title={toastTitle}
                message={toastMessage}
                isVisible={toastVisible}
            /> */}
        </SafeAreaView>
    );
};

export default EditProfile;
