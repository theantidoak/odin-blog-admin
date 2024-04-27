import { writable, type Writable } from "svelte/store";

export const showCommentForm: Writable<boolean> = writable(false);
export const posts: Writable<any[]> = writable([]);
export const comments: Writable<any[]> = writable([]);