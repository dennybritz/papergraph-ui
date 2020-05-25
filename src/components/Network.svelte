<script>
  import { subgraph, selectedPaper } from "../stores";
  import _ from "lodash";
  import { DataSet, Network } from "vis-network/standalone";
  import { onMount } from "svelte";

  let nodes = [];
  let edges = [];
  let papers = {};

  const process_paper = (paper, fn) => {
    fn(paper);
    if (!paper.cites) {
      return;
    }
    paper.cites.forEach(cited => process_paper(cited, fn));
  };

  const makeTitle = (paper) => {
    return `${paper.title} [${paper.year}] [${paper.num_citations} citations]`;
  }

  const updateGraph = data => {
    const root = data.papers[0];

    selectedPaper.set(root);

    nodes = [];
    edges = [];

    process_paper(root, p => {
      const group = p == root ? 1 : 2;
      const value = p.num_citations;
      papers[p.id] = p;
      nodes.push({
        id: p.id,
        title: makeTitle(p),
        value,
        group
      });
      (p.cites || []).forEach(cited =>
        edges.push({ from: p.id, to: cited.id, arrows: "to" })
      );
    });
    nodes = _.uniqBy(nodes, p => p.id);

    var graph_data = {
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
    var network = new Network(container, graph_data, options);

    network.on("click", function(params) {
      const nodeId = this.getNodeAt(params.pointer.DOM);
      if (nodeId) {
        const paper = papers[nodeId];
        selectedPaper.set(paper);
      }
    })
  };

  onMount(async () => {
    subgraph.subscribe(data => {
      data && updateGraph(data);
    });
  });



</script>

<div id="network" class="w-full h-full" />
