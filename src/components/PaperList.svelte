<script>
  import _ from "lodash";
  import { setContext } from "svelte";
  import { currentSubGraph, selectedPaper, incomingCitations, paperListSortOrder } from "../stores";

  const sortOptions = {
    Citations: papers => _.sortBy(papers, p => -p.num_citations),
    InDegree: papers => _.sortBy(papers, p => -$incomingCitations[p.id]),
    Year: papers => _.sortBy(papers, p => -p.year)
  };

  let papersByCitations = [];
  $: papers = $currentSubGraph ? Object.values($currentSubGraph.papers) : [];
  $: {
    papersByCitations = sortOptions[$paperListSortOrder](papers)
  }
</script>

<div>
  <div class="font-bold">
    {papersByCitations.length} papers in subgraph
  </div>
  <div class="mt-2 text-xs uppercase font-bold border-b pb-2 mb-3">
    <span class="text-gray-600">Sort By:</span>
    <button
      class="inline font-bold uppercase pb-1 ml-1"
      class:text-gray-900={$paperListSortOrder === 'Citations'}
      class:text-blue-600 ={$paperListSortOrder !== 'Citations'}
      on:click={() => paperListSortOrder.set('Citations')}>
      Citations
    </button>
    <button
      class="inline font-bold uppercase ml-4 pb-1"
      class:text-gray-900={$paperListSortOrder === 'InDegree'}
      class:text-blue-600 ={$paperListSortOrder !== 'InDegree'}
      on:click={() => paperListSortOrder.set('InDegree')}>
      In-Degree
    </button>
    <button
      class="inline font-bold uppercase ml-4 pb-1"
      class:text-gray-900={$paperListSortOrder === 'Year'}
      class:text-blue-600 ={$paperListSortOrder !== 'Year'}
      on:click={() => paperListSortOrder.set('Year')}>
      Year
    </button>
  </div>

  {#each papersByCitations as paper}
    <div class="mt-1 text-xs">
      <button
        class="inline font-bold text-left"
        class:text-gray-900={$selectedPaper.id === paper.id}
        class:text-blue-600={$selectedPaper.id !== paper.id}
        on:click={() => selectedPaper.set(paper)}>
        {paper.title} ({paper.year})
      </button>
      <div class="text-xs text-gray-600">
        <span>{paper.num_citations} citations,</span>
        <span>{$incomingCitations[paper.id] || 0} in subgraph</span>
      </div>
    </div>
  {/each}
</div>
