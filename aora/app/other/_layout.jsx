import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import HeaderBackButton from "./components/HeaderBackButton";

const OtherLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="edit-profile"
                    options={{
                        headerTitle: "Edit Profile",
                        headerTitleAlign: "center",
                        headerTitleJustifyContent: "center",
                        headerLeftContainerStyle: {
                            paddingLeft: "5%",
                        },
                        headerLeft: () => <HeaderBackButton />,
                        headerStyle: { backgroundColor: '#FF9C01' },
                        headerTitleStyle: { color: '#161622', fontFamily: 'Poppins-Bold', fontSize: 20 },
                    }}
                />
                <Stack.Screen
                    name="edit-post"
                    options={{
                        headerTitle: "Edit Post",
                        headerTitleAlign: "center",
                        headerTitleJustifyContent: "center",
                        headerLeftContainerStyle: {
                            paddingLeft: "5%",
                        },
                        headerLeft: () => <HeaderBackButton />,
                        headerStyle: { backgroundColor: '#FF9C01' },
                        headerTitleStyle: { color: '#161622', fontFamily: 'Poppins-Bold', fontSize: 20 },
                    }}
                />
            </Stack>
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default OtherLayout;