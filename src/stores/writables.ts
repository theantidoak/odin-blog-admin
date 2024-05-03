import { writable, type Writable } from "svelte/store";

export const showCommentForm: Writable<boolean> = writable(false);
export const posts: Writable<any[]> = writable([]);
export const comments: Writable<any[]> = writable([]);
export const responseMessage: Writable<string> = writable('');
export const post: Writable<{ title: string, content: string, slug: string, _id: string, is_published: boolean } | null> = writable(null);
export const hasLoaded: Writable<boolean> = writable(false);
export const isLoggedIn: Writable<boolean> = writable(false);