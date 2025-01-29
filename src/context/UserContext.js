import { APP_INITIALIZED, BLOCKED_USERS_CHANGED, Emitter, POSTS_LOADED, QUEUE_USER, USER_BLOCKED } from "@/events/Emitter";
import userServiceInstance from "@/services/UserService";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const UserContext = React.createContext();

export const UserProvider = ({ children /*NOSONAR*/ }) => {
    const [blockedUsers, setBlockedUsers] = useState(null); // Will initialize on app load.
    const [queuedUsers, setQueuedUsers] = useState({});
    const [scannedUsers, setScannedUsers] = useState({});
    const [currentlyScanningUser, setCurrentlyScanningUser] = useState();
    const [queueProcessingTimeoutId, setQueueProcessingTimeoutId] = useState();

    /**
     * Fires when the logged in user's block list is loaded.
     *
     * If loaded for the first time it will also fire an APP_INITIALIZED events. This is an easy way to signal that the app is loaded and ready to go.
     *
     * @param {object} users
     */
    const _receiveBlockedUsersHandler = (users) => {
        if (!users) return;

        let newBlockedUsers = {};
        users.forEach((user) => {
            newBlockedUsers[user.username] = user;
        });

        setBlockedUsers(newBlockedUsers);

        // Consider the app initialized once the very first block list has been retrieved.
        if (!blockedUsers) {
            Emitter.emit(APP_INITIALIZED);
        }
    };

    /**
     * Fires when posts are intercepted from the site. If the post creator is not in the scanned/queued/blocked lists already, they are added to the queue.
     *
     * @param {object} posts
     */
    const _receivePostsHandler = (posts) => {
        let postCreators = {};

        posts.forEach((post) => {
            if (!post?.creator?.username) return;

            if (post.creator.username in scannedUsers || post.creator.username in queuedUsers || post.creator.username in (blockedUsers || {})) return;

            postCreators[post.creator.username] = {
                ...post.creator,
                _accountAgeInDays: Math.floor((new Date() - new Date(post.creator.creationTs * 1000)) / 1000 / 60 / 60 / 24),
            };
        });

        setQueuedUsers({ ...queuedUsers, ...postCreators });
    };

    /**
     * Fires once a user is blocked. Removes from the queue/scanned lists and adds them to the blocked list.
     *
     * @param {object} user
     */
    const _userWasBlockedHandler = (user) => {
        setQueuedUsers((prevQueuedUsers) => {
            let newQueuedUsers = structuredClone(prevQueuedUsers);
            delete newQueuedUsers[user.username];
            return newQueuedUsers;
        });

        setScannedUsers((prevScannedUsers) => {
            let newScannedUsers = structuredClone(prevScannedUsers);
            delete newScannedUsers[user.username];
            return newScannedUsers;
        });

        setBlockedUsers((prevBlockedUsers) => {
            return { ...prevBlockedUsers, [user.username]: user };
        });

        toast.success(`User '${user.username}' has been blocked.`);
    };

    /**
     * Add a user to the queue, and remove it from the scanned users list if it exists.
     *
     * @param {object} user
     */
    const _queueUserHandler = (user) => {
        setQueuedUsers((prevQueuedUsers) => {
            return { ...prevQueuedUsers, [user.username]: user };
        });

        setScannedUsers((prevScannedUsers) => {
            let newScannedUsers = structuredClone(prevScannedUsers);
            delete newScannedUsers[user.username];
            return newScannedUsers;
        });
    };

    /**
     * Get the first item out of the queue users list and process.
     *
     * @async
     * @returns {string} The username processed, otherwise null.
     */
    const _processNextQueueItemAsync = async () => {
        let user = Object.values(queuedUsers || {}).at(0);
        if (!user) return null;

        setCurrentlyScanningUser(user);
        let posts = await userServiceInstance.getPostsByUser(user.username);

        let downVoteTotal = 0;
        posts.forEach((post) => (downVoteTotal += post.downVoteCount));

        setQueuedUsers((prevQueuedUsers) => {
            let newQueuedUsers = structuredClone(prevQueuedUsers);
            delete newQueuedUsers[user.username];
            return newQueuedUsers;
        });

        setScannedUsers((prevScannedUsers) => {
            let newScannedUsers = structuredClone(prevScannedUsers);
            newScannedUsers[user.username] = {
                ...user,
                _postCountLast5Days: posts?.length || 0,
                _postDownVotesLast5Days: downVoteTotal,
                _scannedOn: new Date(),
            };
            return newScannedUsers;
        });

        setCurrentlyScanningUser(undefined);

        return user.username;
    };

    const providerValue = useMemo(() => {
        return {
            blockedUsers,
            queuedUsers,
            currentlyScanningUser,
            scannedUsers,
        };
    });

    /**
     * Setup and teardown of all event handlers.
     */
    useEffect(() => {
        Emitter.on(BLOCKED_USERS_CHANGED, _receiveBlockedUsersHandler);
        Emitter.on(POSTS_LOADED, _receivePostsHandler);
        Emitter.on(USER_BLOCKED, _userWasBlockedHandler);
        Emitter.on(QUEUE_USER, _queueUserHandler);

        return () => {
            Emitter.off(BLOCKED_USERS_CHANGED, _receiveBlockedUsersHandler);
            Emitter.off(POSTS_LOADED, _receivePostsHandler);
            Emitter.off(USER_BLOCKED, _userWasBlockedHandler);
            Emitter.off(QUEUE_USER, _queueUserHandler);
        };
    }, [blockedUsers, queuedUsers, scannedUsers]);

    /**
     * Whenever the queued users list changes, set a timer to start processing the queue.
     *
     * Delay of 2 seconds between triggers.
     */
    useEffect(() => {
        setQueueProcessingTimeoutId(
            setTimeout(() => {
                _processNextQueueItemAsync().then();
            }, 2000)
        );
    }, [queuedUsers]);

    /**
     * Whenever the queue processing timer ID changes, make sure to clear the old one or events will start to stack.
     */
    useEffect(() => {
        return () => {
            if (queueProcessingTimeoutId) clearTimeout(queueProcessingTimeoutId);
        };
    }, [queueProcessingTimeoutId]);

    return <UserContext.Provider value={providerValue}>{children}</UserContext.Provider>;
};
