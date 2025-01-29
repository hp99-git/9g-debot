import { UserProvider } from "@/context/UserContext";
import { combineProviders } from "react-combine-providers";

export const createStore = () => {
    let providers = new combineProviders();
    providers.push(UserProvider);

    let MasterProvider = providers.master();

    let Store = ({ children /*NOSONAR*/ }) => {
        return <MasterProvider>{children}</MasterProvider>;
    };

    return Store;
};
