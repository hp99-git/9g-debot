export const SortUserBy = Object.freeze({
    USERNAME: Symbol("USERNAME"),
    ACCOUNT_AGE: Symbol("ACCOUNT_AGE"),
    RECENT_POSTS_COUNT: Symbol("RECENT_POSTS_COUNT"),
    RECENT_POSTS_DOWN_VOTE_COUNT: Symbol("RECENT_POSTS_DOWN_VOTE_COUNT"),
});

export const SortDirection = Object.freeze({
    ASC: Symbol("ASC"),
    DESC: Symbol("DESC"),
});
