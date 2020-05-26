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

export const currentSearch = writable(
  "Mastering Atari, Go, Chess and Shogi by Planning"
);

export const currentSubGraph = derived(
  currentSearch,
  async ($currentSearch, set) => {
    const res = await fetch(
      `/paper.json?title=${encodeURIComponent($currentSearch)}`
    );
    let data = await res.json();

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
    }
  }
);

export const incomingCitations = derived(currentSubGraph, ({ citations }) => {
  return _.countBy(citations, "to");
});

export const selectedPaper = writable(null);
