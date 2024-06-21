import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput } from "react-native";
import { useToast } from '../context/ToastProvider';
import { icons } from "../constants";

const SearchInput = ({ initialQuery, placeholder, onSearch }) => {
    const pathname = usePathname();
    const toast = useToast();
    const [query, setQuery] = useState(initialQuery || "");

    const handleSearch = () => {
        if (query === "") {
            toast("Missing Query", "Please input something to search");
            return;
        }

        if (pathname.startsWith("/search")) {
            router.setParams({ query });
        } else {
            router.push(`/search/${query}`);
        }

        onSearch(query);
    };

    return (
        <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
            <TextInput
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={query}
                placeholder={placeholder || "Search..."}
                placeholderTextColor="#CDCDE0"
                onChangeText={(e) => {
                    setQuery(e);
                    onSearch(e);
                }}
            />
            <TouchableOpacity onPress={handleSearch}>
                <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;
