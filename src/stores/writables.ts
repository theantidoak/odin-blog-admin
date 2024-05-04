import { writable, type Writable } from "svelte/store";
import type TinyMCEOptions from "@tinymce/tinymce-svelte";

export const showCommentForm: Writable<boolean> = writable(false);
export const posts: Writable<any[]> = writable([]);
export const comments: Writable<any[]> = writable([]);
export const responseMessage: Writable<string> = writable('');
export const post: Writable<{ title: string, content: string, slug: string, _id: string, is_published: boolean } | null> = writable(null);
export const hasLoaded: Writable<boolean> = writable(false);
export const isLoggedIn: Writable<boolean> = writable(false);
export const tinyEditor: Writable<TinyMCEOptions | null> = writable(null);
export const config: Writable<{ apiKey: string, inline: boolean, conf?: any } | null> = writable(null);