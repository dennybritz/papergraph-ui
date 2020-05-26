<script>
  import _ from "lodash";
  import { setContext } from "svelte";
  import { currentSubGraph, selectedPaper, incomingCitations } from "../stores";

  let papersByCitations = [];
  $: papers = $currentSubGraph ? Object.values($currentSubGraph.papers) : [];
  $: {
    papersByCitations = _.sortBy(papers, p => -p.num_citations);
  }
  // incomingCitations.subscribe(x => console.log(x));
</script>

<div>
  <div class="font-bold mb-3">{papersByCitations.length} papers in subgraph</div>
  {#each papersByCitations as paper}
    <div class="mt-1 text-xs">
      <button
        class="inline font-bold text-left"
        class:text-black="{$selectedPaper.id === paper.id}"
        class:text-blue-600="{$selectedPaper.id !== paper.id}"
        on:click={() => selectedPaper.set(paper)}>
        {paper.title} ({paper.year})
      </button>
      <div class="text-xs text-gray-600">
        <span>{paper.num_citations} citations, </span>
        <span>{$incomingCitations[paper.id] || 0} in subgraph</span>
      </div>
    </div>
  {/each}
</div>
