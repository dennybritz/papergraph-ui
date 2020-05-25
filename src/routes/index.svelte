<script>
  import { subgraph, selectedPaper, currentSearch } from "../stores";
  import { onMount } from "svelte";
  import Network from "../components/Network.svelte";
  import PaperInfo from "../components/PaperInfo.svelte";
  // let title = "Mastering Atari, Go, Chess and Shogi by Planning";
  let data = new Promise(() => {});

	$: tbText = $currentSearch;
  currentSearch.subscribe(data => {
    getData();
  });

  async function getData() {
    const res = await fetch(
      `/paper.json?title=${encodeURIComponent($currentSearch)}`
    );
    data = await res.json();
    subgraph.set(data);
  }

  onMount(async () => {
    data = await getData();
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

<div class="w-full h-full block flex flex-row">
  <div class="w-1/4 border-r pr-8">
    <div>
      <input
        class="border border-gray-400 px-4 py-2 w-full shadow-none outline-none"
        bind:value={tbText}
        on:change={onTitleChange} />
      <div class="text-gray-500 text-xs mt-1">
        Input a (partial) paper title and press enter to search. You can also
        enter a Semantic Scholar ID. The first result will become the root node.
      </div>
      <!-- {#if $subgraph}
        <p class="text-sm mt-2">
          <strong>Loaded:</strong>
          {$subgraph.papers[0].title}
        </p>
      {/if} -->
    </div>
    <div class="mt-2 pt-2">
      {#if $selectedPaper}
        <PaperInfo paper={$selectedPaper} />
      {/if}
    </div>
  </div>
  <div class="w-3/4">
    {#if $subgraph}
      <div class="w-full h-full block">
        <Network />
      </div>
    {/if}
  </div>

</div>
