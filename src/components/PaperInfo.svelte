<script>
  import { currentSearch } from "../stores";
  export let paper;

  const setPaper = () => {
    const prefix = $currentSearch.startsWith("~") ? "~" : "";
    currentSearch.set(`${prefix}id:${paper.id}`);
  };

  $: authors = paper.authors.map(a => a.author.name).join(", ");

  const findPDF = (paper) => {
    let urls = paper.pdf_urls.filter(x => x.endsWith(".pdf"));
    return urls.length > 0 ? [urls[0]] : [];
  }
</script>

<div>
  <div class="font-bold">{paper.title} ({paper.year})</div>
  <div class="mt-1">{authors}</div>
  <div class="mt-1 text-xs">
    <button on:click={setPaper} class="inline font-bold text-blue-600">
      Make Root
    </button>
    <div class="inline text-gray-600 ml-2">{paper.num_citations} citations</div>
    <div class="inline ml-2">
      <a class="break-words" href={paper.s2_url} target="_blank">
        Semantic Scholar
      </a>
    </div>
    {#if paper.doi_url}
      <div class="inline ml-2">
        <a class="break-words" href={paper.doi_url} target="_blank">DOI</a>
      </div>
    {/if}

    {#each findPDF(paper) as pdf}
      <div class="inline ml-2">
        <a class="break-words" href={pdf} target="_blank">PDF</a>
      </div>
    {/each}
  </div>
  <div class="text-xs mt-1">{paper.paper_abstract}</div>
</div>
