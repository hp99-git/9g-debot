import App from "@/components/App";
import { createStore } from "@/Store";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import * as css from "../sass/styles.scss";

const style = document.createElement("style");
style.appendChild(document.createTextNode(css.default[0][1]));
document.head.append(style);

const root = document.createElement("div");
root.id = "debot-app";
document.body.append(root);

const Store = createStore();

createRoot(document.getElementById("debot-app")).render(
    <RouterProvider
        router={createBrowserRouter([
            {
                path: "*",
                element: (
                    <section class="debot-app">
                        <Store>
                            <App />
                            <ToastContainer transition={Flip} autoClose={3000} />
                        </Store>
                    </section>
                ),
            },
        ])}
    />
);
