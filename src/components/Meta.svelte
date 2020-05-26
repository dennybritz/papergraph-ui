<script>
  export let title = "papergraph";
  export let description = "Visualize the AI/ML citation graph";
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  <meta name="twitter:creator" content="@dennybritz" />

  <meta name="og:title" content={title} />
  <meta name="og:description" content={description} />
  <meta name="og:type" content="website" />
</svelte:head>
