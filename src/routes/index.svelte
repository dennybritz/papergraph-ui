<script>
  import { selectedPaper, currentSearch, currentSubGraph } from "../stores";
  import { onMount } from "svelte";
  import Network from "../components/Network.svelte";
  import PaperInfo from "../components/PaperInfo.svelte";
  import SideBar from "../components/SideBar.svelte";

  function onTitleChange(e) {
    currentSearch.set(e.target.value);
    console.log(`fetching: ${$currentSearch}`);
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="w-full h-full flex flex-row">
  <div class="w-1/4 border-r pr-8 mr-8 flex flex-col h-full">
    <SideBar />
  </div>
  <div class="w-3/4 flex flex-col">
    <div class="mb-4">
      <input
        class="border border-gray-400 px-4 py-2 w-full shadow-none outline-none"
        value={$currentSearch}
        on:change={onTitleChange} />
      <div class="text-gray-500 text-xs mt-1">
        Input a (partial) paper title and press enter to search. You can also
        enter a Semantic Scholar ID with
        <pre class="inline">id:</pre>
        prefix. The first result will become the root node.
      </div>
      <div class="text-gray-500 text-xs mt-1">
        Try:
        <button
          class="text-blue-600"
          on:click={() => currentSearch.set('id:ff332c21562c87cab5891d495b7d0956f2d9228b')}>
          World Models
        </button>
        <button
          class="text-blue-600 ml-1"
          on:click={() => currentSearch.set('id:2c03df8b48bf3fa39054345bafabfeff15bfd11d')}>
          ResNet
        </button>        
      </div>
    </div>
    {#if $currentSubGraph}
      <div class="w-full h-full block">
        <Network />
      </div>
    {/if}
  </div>

</div>
