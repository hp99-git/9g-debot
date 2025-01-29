import { BLOCKED_USERS_CHANGED, Emitter, LOGGED_OUT, USER_BLOCKED } from "@/events/Emitter";
import { toast } from "react-toastify";

class UserService {
    /**
     * Get the logged in user's block list. This may need to be done in multiple batches.
     *
     * @async
     * @param {Array[object]} [blockedUserList=[]] The full block list.
     * @param {number} [iteration=0] Recursive call count.
     * @returns {Array[object]} The full block list.
     */
    async _getCurrentBlockListRecursively(blockedUserList = [], iteration = 0) {
        try {
            let response = await fetch("https://9gag.com/v1/user-block-list", {
                headers: {
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                },
                body: JSON.stringify({ fromIndex: iteration * 20, itemCount: 20 }),
                method: "POST",
            });

            if (response.status === 401) {
                Emitter.emit(LOGGED_OUT);
                return null;
            }

            if (response.status !== 200) {
                toast.error("Debot-App: Failed to get current block list.");
                return null;
            }

            let json = await response.json();

            let isSuccess = (json?.meta?.status || "").toLowerCase() === "success";
            if (!isSuccess) {
                toast.error("Debot-App: Failed to get current block list.");
                return null;
            }

            let updatedBlockedUserList = [...blockedUserList, ...json.data.users];
            if (json.data.users.length === 0 || !!json.data.didEndOfList) return updatedBlockedUserList;

            return await this._getCurrentBlockListRecursively(updatedBlockedUserList, iteration + 1);
        } catch (ex) {
            console.error(ex);
            toast.error("Debot-App: Failed to get current block list.");
        }
    }

    /**
     * Get a batch of user posts. Caller can parse the response's "nextCursor" and make a subsequent call for the next batch.
     *
     * @async
     * @param {string} username
     * @param {string} [nextCursor=""] This value comes from the response.
     * @returns {object}
     */
    async _getUserPostsBatch(username, nextCursor = "") {
        try {
            let response = await fetch(`https://9gag.com/v1/user-posts/username/${username}/type/posts?${nextCursor}`, {
                headers: {
                    "cache-control": "no-cache",
                },
                method: "POST",
            });

            if (response.status !== 200) {
                toast.error("Debot-App: Failed to get post batch.");
                return null;
            }

            let json = await response.json();

            let isSuccess = (json?.meta?.status || "").toLowerCase() === "success";
            if (!isSuccess) {
                toast.error("Debot-App: Failed to get post batch.");
                return null;
            }

            return json.data;
        } catch (ex) {
            console.error(ex);
            toast.error("Debot-App: Failed to get post batch.");
        }
    }

    /**
     * Load the currently logged in user's block list.
     *
     * Emits 'LOGGED_OUT' if you're not logged in.
     * Emits 'BLOCKED_USERS_CHANGED' with the results.
     *
     * Function returns nothing and will run asynchronously.
     *
     * @async
     */
    loadCurrentBlockList() {
        (async () => {
            Emitter.emit(BLOCKED_USERS_CHANGED, await this._getCurrentBlockListRecursively());
        })();
    }

    /**
     * Get the user's posts over the last 'maxAgeInDays'.
     *
     * @async
     * @param {string} username Get posts for this user.
     * @param {number} [maxAgeInDays=5] How many days to look back.
     * @returns {Array[object]} Array of posts.
     */
    async getPostsByUser(username, maxAgeInDays = 5) {
        let cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays);

        let userPosts = [];
        let isDone = false;
        let nextCursor = "";
        while (!isDone) {
            let postBatch = await this._getUserPostsBatch(username, nextCursor);
            if (!postBatch || postBatch.posts.length === 0) isDone = true;
            else {
                nextCursor = postBatch.nextCursor || "";
                postBatch.posts.forEach((post) => {
                    let createdOn = new Date(post.creationTs * 1000);
                    if (createdOn > cutoffDate) userPosts.push(post);
                    else isDone = true;
                });
            }
        }

        return userPosts;
    }

    /**
     * Add a user to the logged in user's block list.
     *
     * Emits 'LOGGED_OUT' if you're not logged in.
     * Emits 'USER_BLOCKED' if blocked successfully.
     *
     * @async
     * @param {object} userObj The user object that's pulled when posts are received.
     */
    async addUserToBlockList(userObj) {
        try {
            let response = await fetch("https://9gag.com/v1/user-block", {
                headers: {
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: `accountId=${userObj.accountId}&_method=post`,
                method: "POST",
            });

            if (response.status === 401) {
                Emitter.emit(LOGGED_OUT);
                return;
            }

            if (response.status !== 200) return;

            let json = await response.json();

            let isSuccess = (json?.meta?.status || "").toLowerCase() === "success";

            if (isSuccess) {
                Emitter.emit(USER_BLOCKED, userObj);
            }
        } catch (ex) {
            console.error(ex);
        }
    }
}

const userServiceInstance = new UserService();

export default userServiceInstance;
