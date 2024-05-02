import { writable, type Writable } from "svelte/store";

export const responseMessage: Writable<string> = writable('');
export const post: Writable<{ title: string, content: string, slug: string, _id: string, is_published: boolean } | null> = writable(null);
export const hasLoaded: Writable<boolean> = writable(false);