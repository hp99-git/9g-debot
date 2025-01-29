import { UserContext } from "@/context/UserContext";
import { SortDirection, SortUserBy } from "@/Enums";
import userServiceInstance from "@/services/UserService";
import { useContext, useState } from "react";

const ScannedUsers = () => {
    const { scannedUsers } = useContext(UserContext);
    const [currentSortBy, setCurrentSortBy] = useState(SortUserBy.RECENT_POSTS_COUNT);
    const [currentSortDirection, setCurrentSortDirection] = useState(SortDirection.DESC);

    const [minPostCount, setMinPostCount] = useState(10);

    const changeSortOnClick = (newSortBy, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (currentSortBy === newSortBy) {
            setCurrentSortDirection((prevSortDirection) => {
                return prevSortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
            });
        } else {
            setCurrentSortBy(newSortBy);
            setCurrentSortDirection(SortDirection.ASC);
        }
    };

    const blockUserOnClick = (user, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!user) return;
        userServiceInstance.addUserToBlockList(user);
    };

    /*
    // const reScanUserOnClick = (user, e) => {
    //     if (e) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //     }
    //     if (!user) return;

    //     Emitter.emit(QUEUE_USER, user);
    // };
    */

    const render = () => {
        return (
            <section>
                <div>
                    <div>
                        &ldquo;Posts&rdquo; = Number of posts made over the last <strong>5 days</strong>.
                    </div>
                    <div>
                        &ldquo;Down Votes&rdquo; = The total down votes across all posts made over the last <strong>5 days</strong>.
                    </div>
                </div>
                <div class="top-spacing">
                    Hide if less than{" "}
                    <input
                        type="number"
                        class="inline-number-input"
                        value={minPostCount}
                        onChange={(e) => {
                            let newMinCount = parseInt(e.target.value);
                            setMinPostCount(newMinCount < 0 ? 0 : newMinCount);
                        }}
                    />{" "}
                    posts in the last 5 days.
                </div>
                <table class="top-spacing">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>
                                {currentSortBy === SortUserBy.USERNAME ? <div class={`sort-pointer ${currentSortDirection === SortDirection.DESC ? "sort-pointer-desc" : ""}`}>🖕</div> : <></>}

                                <button class="button-link sort-button" type="button" onClick={changeSortOnClick.bind(this, SortUserBy.USERNAME)}>
                                    User
                                </button>
                            </th>
                            <th>
                                {currentSortBy === SortUserBy.ACCOUNT_AGE ? <div class={`sort-pointer ${currentSortDirection === SortDirection.DESC ? "sort-pointer-desc" : ""}`}>🖕</div> : <></>}

                                <button class="button-link sort-button" type="button" onClick={changeSortOnClick.bind(this, SortUserBy.ACCOUNT_AGE)}>
                                    Age
                                </button>
                            </th>
                            <th>Pro</th>
                            <th>Pro+</th>
                            <th>
                                {currentSortBy === SortUserBy.RECENT_POSTS_COUNT ? (
                                    <div class={`sort-pointer ${currentSortDirection === SortDirection.DESC ? "sort-pointer-desc" : ""}`}>🖕</div>
                                ) : (
                                    <></>
                                )}

                                <button class="button-link sort-button" type="button" onClick={changeSortOnClick.bind(this, SortUserBy.RECENT_POSTS_COUNT)}>
                                    Posts
                                </button>
                            </th>
                            <th style={{ width: "100%" }}>
                                {currentSortBy === SortUserBy.RECENT_POSTS_DOWN_VOTE_COUNT ? (
                                    <div class={`sort-pointer ${currentSortDirection === SortDirection.DESC ? "sort-pointer-desc" : ""}`}>🖕</div>
                                ) : (
                                    <></>
                                )}

                                <button class="button-link sort-button" type="button" onClick={changeSortOnClick.bind(this, SortUserBy.RECENT_POSTS_DOWN_VOTE_COUNT)}>
                                    Down Votes
                                </button>
                            </th>
                            {/* <th>Scanned On</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(scannedUsers || {})
                            .filter((p) => p._postCountLast5Days >= minPostCount)
                            .sort((a, b) => {
                                let isLessValue = currentSortDirection === SortDirection.ASC ? -1 : 1;
                                let isGreaterValue = isLessValue * -1;
                                switch (currentSortBy) {
                                    case SortUserBy.USERNAME:
                                        return a.username < b.username ? isLessValue : isGreaterValue;
                                    case SortUserBy.ACCOUNT_AGE:
                                        return a._accountAgeInDays < b._accountAgeInDays ? isLessValue : isGreaterValue;
                                    case SortUserBy.RECENT_POSTS_COUNT:
                                        return a._postCountLast5Days < b._postCountLast5Days ? isLessValue : isGreaterValue;
                                    case SortUserBy.RECENT_POSTS_DOWN_VOTE_COUNT:
                                        return a._postDownVotesLast5Days < b._postDownVotesLast5Days ? isLessValue : isGreaterValue;
                                }
                            })
                            .map((userObj) => {
                                return (
                                    <tr key={`scanned-user-${userObj.username}`}>
                                        <td>
                                            <button class="button-link" type="button" title="Block" onClick={blockUserOnClick.bind(this, userObj)} style={{ fontSize: "15px", color: "#FF0000" }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
                                                </svg>
                                            </button>
                                            {/* <button class="button-link" type="button" title="Refresh" onClick={reScanUserOnClick.bind(this, userObj)} style={{ fontSize: "15px", color: "#adff2f" }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                                </svg>
                                            </button> */}
                                        </td>
                                        <td>
                                            <a href={userObj.profileUrl}>{userObj.username}</a>
                                        </td>
                                        <td>{userObj._accountAgeInDays}d</td>
                                        <td>{userObj.isActivePro === true ? "Yes" : "No"}</td>
                                        <td>{userObj.isActiveProPlus === true ? "Yes" : "No"}</td>
                                        <td>{userObj._postCountLast5Days}</td>
                                        <td>{userObj._postDownVotesLast5Days}</td>
                                        {/* <td>{userObj._scannedOn.toISOString()}</td> */}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </section>
        );
    };

    return render();
};

export default ScannedUsers;
