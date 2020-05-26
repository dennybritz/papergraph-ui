<script>
  import { selectedPaper, currentSearch, currentSubGraph } from "../stores";
  import { onMount } from "svelte";
  import Network from "../components/Network.svelte";
  import PaperInfo from "../components/PaperInfo.svelte";
  import SideBar from "../components/SideBar.svelte";
  import Meta from "../components/Meta.svelte";

  function onSearchBoxChange(e) {
    currentSearch.set(e.target.value);
    // console.log(`fetching: ${$currentSearch}`);
  }

  onMount(() => {
    currentSearch.subscribe(search => {
      if (window && search) {
        var queryParams = new URLSearchParams(window.location.search);
        queryParams.set("search", search);
        history.pushState(null, null, "?" + queryParams.toString());
      }
    });

    let params = new URLSearchParams(document.location.search);
    let search = params.get("search");
    if (search) {
      currentSearch.set(search);
    } else {
      currentSearch.set("Mastering Atari, Go, Chess and Shogi by Planning");
    }
  });

  let examples = [
    ["World Models", "id:ff332c21562c87cab5891d495b7d0956f2d9228b"],
    ["ResNet", "id:2c03df8b48bf3fa39054345bafabfeff15bfd11d"],
    ["BERT", "id:df2b0e26d0599ce3e70df8a9da02e51594e0e992"]
  ];
</script>

<Meta title="papergraph - {$currentSearch}" />

<div class="w-full h-full flex flex-row">
  <div class="w-1/4 border-r pr-8 mr-8 flex flex-col h-full">
    <SideBar />
  </div>
  <div class="w-3/4 flex flex-col">
    <div class="mb-4">
      <input
        class="border border-gray-400 px-4 py-2 w-full shadow-none outline-none"
        value={$currentSearch}
        on:change={onSearchBoxChange} />
      <div class="text-gray-500 text-xs mt-1">
        Input a (partial) paper title and press enter to search. You can also
        enter a Semantic Scholar ID with
        <pre class="inline">id:</pre>
        prefix. The first result will become the root node.
      </div>
      <div class="text-gray-500 text-xs mt-1">
        Try:
        {#each examples as [name, search]}
          <button
            class="text-blue-600"
            class:ml-1={search !== examples[0][1]}
            on:click={() => currentSearch.set(search)}>
            [{name}]
          </button>
        {/each}
      </div>
    </div>
    <div class="w-full h-full block">
      <Network />
    </div>

  </div>

</div>
