import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.nqt.aora",
    projectId: "666fab3b00076d38c456",
    storageId: "666fadc200122c3a7bcd",
    databaseId: "666fac4f0006ddd63701",
    userCollectionId: "666fac69000dfe0fdaaa",
    videoCollectionId: "666fac7f00228e796ce2",
    chatCollectionId: "6675750300384c8e79a4",
    messageCollectionId: "6675752e0014dc9db359",
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username, nickname) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
            nickname
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                nickname: nickname,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Sign Out
export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Upload File
export async function uploadFile(file, type) {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

// Create Video Post
export async function createVideoPost(form) {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}

// Get all video Posts
export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get video posts created by user
export async function getUserPosts(userId) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("creator", userId)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get video posts that matches search query
export async function searchPosts(query) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.search("title", query)]
        );

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get latest created video posts
export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// update user profile
export async function updateUserProfile(userId, data) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            data
        );

        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Save video
export async function saveVideo(videoId) {
    try {
        const user = await getCurrentUser();
        if (!user) throw Error;

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                videoIds: [...user.videoIds, videoId],
            }
        );

        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Unsave video
export async function unsaveVideo(videoId) {
    try {
        const user = await getCurrentUser();
        if (!user) throw Error;

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                videoIds: user.videoIds.filter((id) => id !== videoId),
            }
        );

        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Get saved videos
export async function getSavedVideos() {
    try {
        const user = await getCurrentUser();
        if (!user || !user.videoIds) throw Error;

        const promises = user.videoIds.map((id) => {
            return databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.videoCollectionId,
                [Query.equal("$id", id)]
            );
        });

        const savedVideos = await Promise.all(promises);

        return savedVideos.flatMap(video => video.documents);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Delete video post
export async function deleteVideoPost(videoId) {
    try {
        const deletedPost = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            videoId
        );

        return deletedPost;
    } catch (error) {
        throw new Error(error);
    }
}

// Get video post by id
export async function getPostById(videoId) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            videoId
        );

        return post;
    } catch (error) {
        throw new Error(error);
    }
}

// Update Post
export async function updatePost(videoId, data) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            videoId,
            data
        );

        return updatedPost;
    } catch (error) {
        throw new Error(error);
    }
}

// Like video
export async function likeVideo(videoId) {
    try {
        const post = await getPostById(videoId);
        if (!post) throw Error;

        const user = await getCurrentUser();
        if (!user) throw Error;

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            videoId,
            {
                likes: post.likes + 1,
            }
        );

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                likes: [...user.likes, videoId],
            }
        );

        return updatedPost && updatedUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Unlike video
export async function unlikeVideo(videoId) {
    try {
        const post = await getPostById(videoId);
        if (!post) throw Error;
        const user = await getCurrentUser();
        if (!user) throw Error;

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            videoId,
            {
                likes: post.likes - 1,
            }
        );

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                likes: user.likes.filter((id) => id !== videoId),
            }
        );

        return updatedPost && updatedUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Get like videos
export async function getLikedVideos() {
    try {
        const user = await getCurrentUser();
        if (!user || !user.likes) throw Error;

        const promises = user.likes.map((id) => {
            return databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.videoCollectionId,
                [Query.equal("$id", id)]
            );
        });

        const likedVideos = await Promise.all(promises);

        return likedVideos.flatMap(video => video.documents);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Get total likes of a video
export async function getTotalLikes(videoId) {
    try {
        const post = await getPostById(videoId);
        if (!post) throw Error;

        return post.likes;
    } catch (error) {
        throw new Error(error);
    }
}

// Follow user
export async function follow(userId) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not found');

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                following: [...user.following, userId],
            }
        );

        return updatedUser;
    } catch (error) {
        throw new Error(`Error following user: ${error.message}`);
    }
}

// Unfollow user
export async function unfollow(userId) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not found');

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                following: user.following.filter((id) => id !== userId),
            }
        );

        return updatedUser;
    } catch (error) {
        throw new Error(`Error unfollowing user: ${error.message}`);
    }
}

// Get list user that current user is following
export async function getFollowings() {
    try {
        const user = await getCurrentUser();
        if (!user || !user.following) throw new Error('User not found or no following list');

        const promises = user.following.map((id) => {
            return databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [Query.equal("$id", id)]
            );
        });

        const following = await Promise.all(promises);

        return following.flatMap(user => user.documents);
    } catch (error) {
        console.error(error);
        throw new Error(`Error fetching following users: ${error.message}`);
    }
}

// Get total followings
export async function getTotalFollowing() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not found');

        return user.following;
    } catch (error) {
        console.error(error);
        throw new Error(`Error fetching followers: ${error.message}`);
    }
}

// Get total followers
export async function getTotalFollower() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not found');

        // Query to find users who have the current user's ID in their following array
        const followers = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.search("following", user.$id)]
        );

        return followers.documents;
    } catch (error) {
        console.error(error);
        throw new Error(`Error fetching followers: ${error.message}`);
    }
}

// Get followers by user id
export async function getFollowersById(userId) {
    try {
        const followers = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.search("following", userId)]
        );

        return followers.documents;
    } catch (error) {
        console.error(error);
        throw new Error(`Error fetching followers: ${error.message}`);
    }
}

// Set is following status
export async function isFollowing(userId) {
    try {
        const user = await getCurrentUser();
        if (!user) return false;

        return user.following.includes(userId);
    } catch (error) {
        console.error(error);
        throw new Error(`Error checking following status: ${error.message}`);
    }
}

// get user by id
export async function getUserById(userId) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );

        return user;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Users list without current user
export async function getUsers() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not found');

        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.notEqual("$id", user.$id)]
        );

        return users.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get posts from the last 7 days
export async function getNewPosts(userId) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("$id", userId), Query.greaterThan("$createdAt", Date.now() - 604800000)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get chats document
export async function getChats() {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not found');

        const chats = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.chatCollectionId,
            [Query.equal("members", user.$id)]
        );

        return chats.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get messages document
export async function getMessages(chatId) {
    try {
        const messages = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.messageCollectionId,
            [Query.equal("chatId", chatId)]
        );

        return messages.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Create chat
export async function createChat(members, latestMessage) {
    try {
        const newChat = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.chatCollectionId,
            ID.unique(),
            {
                members,
                latestMessage,
            }
        );

        return newChat;
    } catch (error) {
        throw new Error(error);
    }
}

// Create message
export async function createMessage(chatId, text, senderId) {
    try {
        const newMessage = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.messageCollectionId,
            ID.unique(),
            {
                chatId,
                text,
                senderId,
                createdAt: Date.now(),
            }
        );

        return newMessage;
    } catch (error) {
        throw new Error(error);
    }
}

// Create first chat when following
export async function createFirstChat(followingId) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('User not found');

        const newChat = await createChat([user.$id, followingId], newMessage);
        const newMessage = createMessage(newChat.$id, "Say hi 👋", user.$id);

        return newChat && newMessage;
    } catch (error) {
        throw new Error(error);
    }
}