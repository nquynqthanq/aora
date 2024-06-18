import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchInput } from "../../components";
import { View } from "react-native-animatable";

const Bookmark = () => {
    return (
        <SafeAreaView className="px-4 my-6 bg-primary h-full">
            <View className="flex flex-row justify-between items-center mb-5">
                <Text className="text-2xl font-psemibold text-white">Bookmarks</Text>
            </View>

            <SearchInput placeholder="Search your saved videos" />
        </SafeAreaView>
    );
};

export default Bookmark;