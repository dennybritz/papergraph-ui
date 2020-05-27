<script>
  import { selectedPaper, currentSearch, currentSubGraph } from "../stores";
  import { onMount } from "svelte";
  import Network from "../components/Network.svelte";
  import PaperInfo from "../components/PaperInfo.svelte";
  import SideBar from "../components/SideBar.svelte";
  import Meta from "../components/Meta.svelte";

  $: pageTitle = $currentSearch
    ? `papergraph - ${$currentSearch}`
    : `papergraph`;

  function onSearchBoxChange(e) {
    currentSearch.set(e.target.value);
    // console.log(`fetching: ${$currentSearch}`);
  }

  onMount(async () => {
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
    ["ResNet", "Deep Residual Learning for Image Recognition"],
    [
      "BERT",
      "Pre-training of Deep Bidirectional Transformers for Language Understanding"
    ],
    [
      "EfficientNet",
      "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks"
    ],
    ["MuZero", "Mastering Atari, Go, Chess and Shogi by Planning"],
    ["World Models", "id:ff332c21562c87cab5891d495b7d0956f2d9228b"],
    ["~GPT-2", "~Language Models are Unsupervised Multitask Learners"],
    ["Lottery", "The Lottery Ticket Hypothesis: Finding Sparse"],
    ["~Troubling Trends", "~Troubling Trends in Machine Learning Scholarship"]
  ];
</script>

<Meta title={pageTitle} />

<div class="w-full h-full flex flex-row">
  <div class="w-1/4 border-r pr-8 mr-8 flex flex-col h-full">
    <SideBar />
  </div>
  <div class="w-3/4 flex flex-col">
    <div class="mb-2">
      <input
        class="border border-gray-400 px-4 py-2 w-full shadow-none outline-none"
        value={$currentSearch}
        on:change={onSearchBoxChange} />
      <div class="text-gray-500 text-xs mt-1">
        Input a (partial) paper title and press enter to search. Prefix your
        search with
        <pre class="inline">id:</pre>
        to search for a Semantic Scholar ID. Prefix with
        <pre class="inline">~</pre>
        to look for out- instead of in-citations. The first result will become
        the root node. Double-click a node to make it the root. Try:
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
