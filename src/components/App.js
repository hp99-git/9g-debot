import About from "@/components/About";
import BlockedUsers from "@/components/BlockedUsers";
import QueuedUsers from "@/components/QueuedUsers";
import ScannedUsers from "@/components/ScannedUsers";
import { UserContext } from "@/context/UserContext";
import { APP_INITIALIZED, Emitter, LOGGED_OUT } from "@/events/Emitter";
import postServiceInstance from "@/services/PostService";
import userServiceInstance from "@/services/UserService";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const App = () => {
    const { queuedUsers, scannedUsers, blockedUsers } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isAppVisible, setIsAppVisible] = useState(true);
    const [visibleTabName, setVisibleTabName] = useState("about"); // "about", "queue", "scanned", "blocked"

    useEffect(() => {
        Emitter.on(LOGGED_OUT, unloadApplication);
        Emitter.on(APP_INITIALIZED, initializeHandler);
        loadApplication();

        return () => {
            Emitter.off(LOGGED_OUT, unloadApplication);
            Emitter.on(APP_INITIALIZED, initializeHandler);
            unloadApplication();
        };
    }, []);

    const initializeHandler = () => {
        setIsLoading(false);
        toast.success("Debot-App: Application initialized!");
    };

    const loadApplication = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsLoading(true);
        setIsLoggedOut(false);
        userServiceInstance.loadCurrentBlockList();
        postServiceInstance.registerHooks();
    };

    const unloadApplication = () => {
        setIsLoading(true);
        setIsLoggedOut(true);
        postServiceInstance.unregisterHooks();
    };

    const toggleAppVisibility = () => {
        setIsAppVisible((prev) => {
            return !prev;
        });
    };

    const render = () => {
        if (isLoggedOut) {
            return (
                <div style={{ width: "525px", display: isAppVisible ? "block" : "none" }}>
                    You do not appear to be logged into the site.
                    <br />
                    <br />
                    Please log in, the page will refresh and then reload this application.
                </div>
            );
        }

        if (isLoading) {
            return (
                <div style={{ width: "525px", display: isAppVisible ? "block" : "none" }}>
                    <h3>Loading your current block list...</h3>
                </div>
            );
        }

        return (
            <div style={{ width: "525px", display: isAppVisible ? "block" : "none" }}>
                <div class="top-spacing tab-group">
                    <button
                        type="button"
                        class={`tab-button ${visibleTabName === "about" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setVisibleTabName("about");
                        }}
                    >
                        About
                    </button>
                    <button
                        type="button"
                        class={`tab-button ${visibleTabName === "queue" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setVisibleTabName("queue");
                        }}
                    >
                        Queue ({Object.keys(queuedUsers || {}).length})
                    </button>
                    <button
                        type="button"
                        class={`tab-button ${visibleTabName === "scanned" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setVisibleTabName("scanned");
                        }}
                    >
                        Scanned ({Object.keys(scannedUsers || {}).length})
                    </button>
                    <button
                        type="button"
                        class={`tab-button ${visibleTabName === "blocked" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setVisibleTabName("blocked");
                        }}
                    >
                        Blocked ({Object.keys(blockedUsers || {}).length})
                    </button>
                </div>
                <div class="top-spacing" style={{ display: visibleTabName === "about" ? "block" : "none" }}>
                    <About />
                </div>
                <div class="top-spacing" style={{ display: visibleTabName === "queue" ? "block" : "none" }}>
                    <QueuedUsers />
                </div>
                <div class="top-spacing" style={{ display: visibleTabName === "scanned" ? "block" : "none" }}>
                    <ScannedUsers />
                </div>
                <div class="top-spacing" style={{ display: visibleTabName === "blocked" ? "block" : "none" }}>
                    <BlockedUsers />
                </div>
            </div>
        );
    };

    return (
        <section style={{ padding: "5px" }}>
            <div class="app-btn-container">
                <button type="button" onClick={toggleAppVisibility}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            fill-rule="evenodd"
                            d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                        />
                    </svg>
                </button>
            </div>
            <div class="title" style={{ display: isAppVisible ? "block" : "none" }}>
                <span style={{ verticalAlign: "top", paddingRight: "5px" }}>🤖</span>
                <span style={{ verticalAlign: "middle" }}>9G Debot App</span>
                <span style={{ verticalAlign: "top", paddingLeft: "5px" }}>🤖</span>
                <span class="version">v0.0.1</span>
            </div>
            {render()}
        </section>
    );
};

export default App;
