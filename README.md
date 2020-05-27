This is the frontend for [dennybritz/papergraph](https://github.com/dennybritz/papergraph). 

Technologies used:

- [sapper](https://sapper.svelte.dev/) + [svelte](https://svelte.dev/) for static site generation
- [tailwindcss](https://tailwindcss.com/) for styling
- [dennybritz/papergraph](https://github.com/dennybritz/papergraph) for the data

Note that this is a static site with no server required. All rendering happens in the browser, and data is requested via GraphQL on the client-side.

### Run locally

```bash
yarn install
yarn dev

# For local development, you should also run the CSS generation in the background
# see https://github.com/ScottWhittaker/sapper-tailwind-template
yarn css:watch
```

For details, refer to the [sapper](https://sapper.svelte.dev/) documentation.