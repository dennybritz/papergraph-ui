<script>
  import {
    currentSubGraph,
    selectedPaper,
    currentSearch,
    isLoading
  } from "../stores";
  import { DataSet, Network } from "vis-network/standalone";
  import { onMount } from "svelte";

  let network;
  let graph_data;
  let isUpdatingGraph = false;
  let hierarchical = false;

  $: hideGraph = $isLoading || isUpdatingGraph;

  const makeTitle = paper => {
    return `${paper.title} [${paper.year}] [${paper.num_citations} citations]`;
  };

  const toggleHierarchical = () => {
    hierarchical = !hierarchical;
    updateGraph($currentSubGraph);
  }

  selectedPaper.subscribe(paper => {
    // TODO: Fix this
    try {
      network.selectNodes([paper.id]);
    } catch {}
  });

  currentSearch.subscribe(_newSearch => {
    if (network) {
      network.destroy();
    }
  });

  const updateGraph = data => {
    isUpdatingGraph = true;
    const nodes = Object.entries(data.papers).map(([id, paper]) => {
      const group = paper.isRoot ? 1 : 2;
      const value = paper.num_citations;
      return {
        id,
        title: makeTitle(paper),
        value,
        group
      };
    });

    const edges = Array.from(data.citations).map(({ from, to }) => {
      return { from, to, arrows: "to" };
    });

    graph_data = {
      nodes: nodes,
      edges: edges
    };

    var options = {
      nodes: {
        shape: "dot"
      },
      groups: {
        1: {
          color: "#FEB2B2"
        },
        2: {
          color: "#90CDF4"
        }
      },
      physics: {
        stabilization: {
          iterations: 500
        }
      },
      layout: {
        hierarchical: hierarchical
      }
      // layout: {
      //   hierarchical: {
      //     direction: "UD",
      //     sortMethod: "directed"
      //   }
      // }
      // physics: {
      //   stabilization: true,
      //   // barnesHut: {
      //   //   gravitationalConstant: -80000,
      //   //   springConstant: 0.001,
      //   //   springLength: 200
      //   // }
      // }
    };
    var container = document.getElementById("network");
    network = new Network(container, graph_data, options);

    window.network = network;

    network.on("click", function(params) {
      const nodeId = this.getNodeAt(params.pointer.DOM);
      if (nodeId) {
        const paper = $currentSubGraph.papers[nodeId];
        selectedPaper.set(paper);
      }
    });

    network.once("stabilizationIterationsDone", function() {
      isUpdatingGraph = false;
    });

    $selectedPaper && network.selectNodes([$selectedPaper.id]);
  };

  onMount(async () => {
    currentSubGraph.subscribe(data => {
      if (data) {
        updateGraph(data);
      }
    });
  });
</script>

{#if hideGraph}
  <div class="w-full text-left">
    <i class="las la-circle-notch la-spin la-2x text-gray-400" />
  </div>
{/if}

{#if !$isLoading && !$currentSubGraph && $currentSearch}
  <div>No data found.</div>
{/if}

{#if !hideGraph}
  <div class="text-xs float-left font-bold">
  <button 
    class="text-blue-600 font-bold"
    on:click={() => toggleHierarchical()}>
    {#if hierarchical}
      Toggle Normal Layout
    {:else}
      Toggle Hierarchical Layout
    {/if}
    
  </button>
  </div>
{/if}

<div class="w-full h-full">
  <div id="network" class="w-full h-full" />
</div>
