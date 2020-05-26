<script>
  import { currentSubGraph, selectedPaper, currentSearch } from "../stores";
  import _ from "lodash";
  import { DataSet, Network } from "vis-network/standalone";
  import { onMount } from "svelte";

  let network;
  let graph_data;
  let is_updating = true;

  const makeTitle = paper => {
    return `${paper.title} [${paper.year}] [${paper.num_citations} citations]`;
  };

  selectedPaper.subscribe(paper => {
    if (!is_updating && network && network.findNode(paper.id).length > 0) {
      network.selectNodes([paper.id]);
    }
  });

  currentSearch.subscribe(_newSearch => {
    is_updating = true;
    if (network) {
      network.destroy();
    }
  });

  const updateGraph = data => {
    is_updating = true;
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
          iterations: 200
        }
      }
      // layout: {
      // 	hierarchical: true,
      // }
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
      is_updating = false;
    });

    
  };

  onMount(async () => {
    currentSubGraph.subscribe(data => {
      data && updateGraph(data);
    });
  });
</script>

{#if is_updating}
  <div class="w-full text-left">
    <i class="las la-circle-notch la-spin la-2x text-gray-400" />
  </div>
{/if}

<div  class="w-full h-full">
  <div id="network" class="w-full h-full" />
</div>

