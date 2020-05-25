import { writable } from 'svelte/store';

export const currentSearch = writable("Mastering Atari, Go, Chess and Shogi by Planning");
export const subgraph = writable(null);
export const selectedPaper = writable(null);