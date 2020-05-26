import { writable, derived } from "svelte/store";
import _ from "lodash";

// recursively apply a function to each paper node
const each_node = (paper, fn) => {
  fn(paper);
  if (!paper.cites) {
    return;
  }
  paper.cites.forEach(cited => each_node(cited, fn));
};

export const isLoading = writable(false);

export const currentSearch = writable(
  "Mastering Atari, Go, Chess and Shogi by Planning"
);

export const currentSubGraph = derived(
  currentSearch,
  async ($currentSearch, set) => {
    isLoading.set(true);
    const res = await fetch(
      `/paper.json?title=${encodeURIComponent($currentSearch)}`
    );
    let data = await res.json();
    
    if (data.papers.length == 0) {
      selectedPaper.set(null);
      set(null);
      isLoading.set(false);
      return;
    }

    // Flatten the graph structure
    const root = data.papers[0];
    if (root) {
      root.isRoot = true;
      selectedPaper.set(root);
      let papers = {};
      let citations = [];
      each_node(root, paper => {
        // TODO: Clean this up
        papers[paper.id] = paper;
        (paper.cites || []).forEach(cited =>
          citations.push({ from: paper.id, to: cited.id })
        );
      });

      set({ papers, citations });
      isLoading.set(false);
    }
  }
);

export const incomingCitations = derived(currentSubGraph, (csg) => {
  return csg ? _.countBy(csg.citations, "to") : {};
});

export const selectedPaper = writable(null);
