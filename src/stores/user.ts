import { writable, type Writable } from "svelte/store";

export const responseMessage: Writable<string> = writable('');
export const post: Writable<{ title: string, content: string } | null> = writable(null);