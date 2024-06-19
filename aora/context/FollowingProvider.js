import React, { createContext, useState } from 'react';

export const FollowingContext = createContext();

export const FollowingProvider = ({ children }) => {
    const [following, setFollowing] = useState([]);

    const addFollowing = (userId) => {
        setFollowing([...following, userId]);
    };

    const removeFollowing = (userId) => {
        setFollowing(following.filter(id => id !== userId));
    };

    return (
        <FollowingContext.Provider value={{ following, addFollowing, removeFollowing, setFollowing }}>
            {children}
        </FollowingContext.Provider>
    );
};