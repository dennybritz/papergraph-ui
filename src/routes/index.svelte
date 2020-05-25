<script>
  import { subgraph, selectedPaper, currentSearch } from "../stores";
  import { onMount } from "svelte";
  import Network from "../components/Network.svelte";
  import PaperInfo from "../components/PaperInfo.svelte";

  $: tbText = $currentSearch;
  currentSearch.subscribe(data => {
    getData();
  });

  async function getData() {
    const res = await fetch(
      `/paper.json?title=${encodeURIComponent($currentSearch)}`
    );
    let data = await res.json();
    subgraph.set(data);
    return data;
  }

  onMount(async () => {
    let data = await getData();
    console.log(data);
  });

  function onTitleChange() {
    currentSearch.set(tbText);
    console.log(`fetching ${$currentSearch}`);
    getData();
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="w-full h-full flex flex-row">
  <div class="w-1/4 border-r pr-8 mr-8 flex flex-col">
    <div class="mb-2 text-xs pb-2">
      <button
        class="inline font-bold text-blue-600 uppercase pb-1 border-gray-400
        border-b-2">
        Details
      </button>
      <button class="inline font-bold text-blue-600 uppercase ml-4">
        List
      </button>
      <button class="inline font-bold text-blue-600 uppercase ml-4">
        Examples
      </button>	
      <button class="inline font-bold text-blue-600 uppercase ml-4">
        Options
      </button>						
      <button class="inline font-bold text-blue-600 uppercase ml-4">
        Help
      </button>
    </div>
    <div class="mt-2 flex-1">
      {#if $selectedPaper}
        <PaperInfo paper={$selectedPaper} />
      {/if}
    </div>
    <div class="text-gray-500 text-xs mt-4">
      Built with ❤️ by
      <a href="https://twitter.com/dennybritz" target="_blank">@dennybritz</a>
    </div>
  </div>
  <div class="w-3/4 flex flex-col">
    <div class="mb-4">
      <input
        class="border border-gray-400 px-4 py-2 w-full shadow-none outline-none"
        bind:value={tbText}
        on:change={onTitleChange} />
      <div class="text-gray-500 text-xs mt-1">
        Input a (partial) paper title and press enter to search. You can also
        enter a Semantic Scholar ID with
        <pre class="inline">id:</pre>
        prefix. The first result will become the root node.
      </div>
    </div>
    {#if $subgraph}
      <div class="w-full h-full block">
        <Network />
      </div>
    {/if}
  </div>

</div>
