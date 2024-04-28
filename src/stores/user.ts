import { writable, type Writable } from "svelte/store";

export const responseMessage: Writable<string> = writable('');