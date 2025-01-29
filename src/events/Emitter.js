import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();

export const Emitter = {
    on: (event, fn) => eventEmitter.on(event, fn),
    once: (event, fn) => eventEmitter.once(event, fn),
    off: (event, fn) => eventEmitter.off(event, fn),
    emit: (event, payload) => eventEmitter.emit(event, payload),
};

Object.freeze(Emitter);

export const APP_INITIALIZED = "APP_INITIALIZED";
export const POSTS_LOADED = "POSTS_LOADED";
export const BLOCKED_USERS_CHANGED = "BLOCKED_USERS_CHANGED";
export const LOGGED_OUT = "LOGGED_OUT";
export const USER_BLOCKED = "USER_BLOCKED";
export const QUEUE_USER = "QUEUE_USER";
