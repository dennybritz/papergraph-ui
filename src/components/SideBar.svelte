<script>
  import { setContext, getContext } from "svelte";
  import { selectedPaper } from "../stores";
  import PaperInfo from "./PaperInfo.svelte";
  import PaperList from "./PaperList.svelte";
  import Options from "./Options.svelte";
  import Help from "./Help.svelte";

  let selection = "details";

  selectedPaper.subscribe(() => {
    selection = "details";
  });
</script>

<div class="flex flex-col h-full">
  <div class="mb-2 text-xs pb-2">
    <button
      class="inline font-bold text-blue-600 uppercase pb-1 border-gray-400"
      class:border-b-2={selection === 'details'}
      on:click={() => (selection = 'details')}>
      Details
    </button>
    <button
      class="inline font-bold text-blue-600 uppercase ml-4 pb-1 border-gray-400"
      class:border-b-2={selection === 'list'}
      on:click={() => (selection = 'list')}>
      List
    </button>
    <button
      class="inline font-bold text-blue-600 uppercase ml-4 pb-1 border-gray-400"
      class:border-b-2={selection === 'options'}
      on:click={() => (selection = 'options')}>
      Options
    </button>
    <button
      class="inline font-bold text-blue-600 uppercase ml-4 pb-1 border-gray-400"
      class:border-b-2={selection === 'help'}
      on:click={() => (selection = 'help')}>
      Help
    </button>
  </div>

  <div class="mt-2 flex-1 overflow-y-scroll">
    {#if selection === 'details' && $selectedPaper}
      <PaperInfo paper={$selectedPaper} />
    {:else if selection === 'list'}
      <PaperList />
    {:else if selection === 'options'}
      <Options />
    {:else if selection === 'help'}
      <Help />
    {/if}
  </div>

  <div class="text-gray-500 text-xs mt-4">
    Built with ❤️ by
    <a href="https://twitter.com/dennybritz" target="_blank">@dennybritz</a>
  </div>

</div>
