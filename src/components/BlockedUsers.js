import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

const BlockedUsers = () => {
    const { blockedUsers } = useContext(UserContext);

    const render = () => {
        return (
            <section>
                <div>Users that are current blocked.</div>
                <br />
                {Object.keys(blockedUsers || {}).length === 0 ? (
                    <div class="header-no-results">No users currently blocked.</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(blockedUsers || {})
                                .sort((a, b) => (a.username < b.username ? -1 : 1))
                                .map((userObj) => {
                                    return (
                                        <tr key={`blocked-user-${userObj.username}`}>
                                            <td>
                                                <a href={userObj.profileUrl}>{userObj.username}</a>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                )}
            </section>
        );
    };

    return render();
};

export default BlockedUsers;
