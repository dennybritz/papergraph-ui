import { writable, derived } from "svelte/store";
import _ from "lodash";
import { getPaper } from "./db";

// recursively apply a function to each paper node
const each_node = (paper, fn) => {
  fn(paper);
  if (!paper.cites) {
    return;
  }
  paper.cites.forEach(cited => each_node(cited, fn));
};

export const paperListSortOrder = writable("Citations");

export const isLoading = writable(false);

export const currentSearch = writable(
  null
);

export const currentSubGraph = derived(
  currentSearch,
  async ($currentSearch, set) => {
    if (!$currentSearch) {
      set(null);
      return;
    }

    isLoading.set(true);
    let data = await getPaper($currentSearch);
    
    if (data.papers.length == 0) {
      selectedPaper.set(null);
      set(null);
      isLoading.set(false);
      return;
    }

    // Flatten the graph structure
    let root = data.papers[0];
    if (root) {
      root = { ...root, isRoot: true };
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

      const subGraphData = { papers, citations };
      if (window) {
        window.subGraphData = subGraphData;
      }

      set(subGraphData);
      isLoading.set(false);
    }
  }
);

export const incomingCitations = derived(currentSubGraph, (csg) => {
  return csg ? _.countBy(csg.citations, "to") : {};
});

export const selectedPaper = writable(null);
