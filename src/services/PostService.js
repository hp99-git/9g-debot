import { Emitter, POSTS_LOADED } from "@/events/Emitter";
import { toast } from "react-toastify";

const POSTS_ENDPOINT_REGEX = /^https:\/\/9gag.com\/v1\/.+-posts(\/.*)?\/type\//i;

class PostService {
    /**
     * Overrides the default 'fetch' function and listens for "posts" endpoints. Emits POSTS_LOADED when encountered.
     */
    registerHooks() {
        var vanillaFetch = fetch; // NOSONAR
        fetch = (input, init) => {
            return vanillaFetch(input, init).then((response) => {
                return new Promise((resolve) => {
                    try {
                        let responseClone = response.clone();
                        responseClone.json().then((json /*NOSONAR*/) => {
                            // The one matching exception is loading posts from the user's profile page. Ignore this scenario.
                            let isMatch = !input.startsWith("https://9gag.com/v1/user-posts/username/") && POSTS_ENDPOINT_REGEX.test(input);
                            if (!isMatch) return;

                            let isSuccess = (json?.meta?.status || "").toLowerCase() === "success";
                            if (!isSuccess) return;

                            Emitter.emit(POSTS_LOADED, json?.data?.posts || []);
                        });
                    } catch (ex) {
                        console.error(ex);
                        toast.error("Debot-App: Failed to hook into posts.");
                    } finally {
                        resolve(response);
                    }
                });
            });
        };
    }

    /**
     * Reverts the fetch function back to its default version.
     */
    unregisterHooks() {
        fetch = vanillaFetch || fetch;
        var vanillaFetch = undefined; // NOSONAR
    }
}

const postServiceInstance = new PostService();

export default postServiceInstance;
