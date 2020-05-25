<script context="module">
  export async function preload(page, session) {
    const title = "Mastering Atari, Go, Chess and Shogi by Planning";
    const res = await this.fetch(
      `/paper.json?title=${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return { data };
  }
</script>

<script>
  export let data;
  import _ from "lodash";
	import { DataSet, Network } from "vis-network/standalone";
	import { onMount } from "svelte";

  const process_paper = (paper, fn) => {
    fn(paper);
    if (!paper.cites) {
      return;
    }
    paper.cites.forEach(cited => process_paper(cited, fn));
  };

  let nodes = [];
	let edges = [];
	
	const root = data.papers[0];

  process_paper(root, p => {
		const group = (p == root ? 1 : 2);
    nodes.push({ id: p.id, title: p.title, value: p.num_citations || 0, group });
    (p.cites || []).forEach(cited =>
      edges.push({ from: p.id, to: cited.id, arrows: "to" })
    );
  });

  nodes = _.uniqBy(nodes, p => p.id);


  onMount(async () => {

    var container = document.getElementById("network");
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
			nodes: {
				shape: "dot",
			},
			groups: {
				1: {
					color: "#FEB2B2",
				},
				2: {
					color: "#90CDF4",
				}
			},
			physics: {
				stabilization: {
					iterations: 100,
				}
			},
			layout: {
				hierarchical: true,
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
    var network = new Network(container, data, options);

    // const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
    // photos = await res.json();
  });
</script>

<style>
  #network {
  width: 600px;
  height: 600px;
  }
</style>

<svelte:head>
  <title>Home</title>
</svelte:head>

<!-- <p>Hello World</p> -->

<div id="network" />
