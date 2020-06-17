import { gql } from "@apollo/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const GRAPHQL_ENDPOINT =
  process.env["P_GRAPHQL_ENDPOINT"] ||
  "https://papergraph.dennybritz.com/v1/graphql";

const MAX_CITATIONS_PER_PAPER = 20;

export const PAPER_FIELDS = `
fragment paper_fields on papers {
  id
  title
  authors {
    author {
      name
    }
  }
  paper_abstract
  year
  doi_url
  s2_url
  pdf_urls
  num_citations
}
`;

export const ID_QUERY = gql`
  ${PAPER_FIELDS}
  query papers($id: String!) {
    papers(limit: 1, where: { id: { _eq: $id } }, offset: 0) {
      ...paper_fields
      cites(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
        ...paper_fields
        cites(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
          ...paper_fields
        }
      }
    }
  }
`;

export const ID_QUERY_REV = gql`
  ${PAPER_FIELDS}
  query papers($id: String!) {
    papers(limit: 1, where: { id: { _eq: $id } }, offset: 0) {
      ...paper_fields
      cites: cited_by(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
        ...paper_fields
        cites: cited_by(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
          ...paper_fields
        }
      }
    }
  }
`;

export const TITLE_QUERY = gql`
  ${PAPER_FIELDS}
  query papers($title: String!) {
    papers(limit: 1, where: { title: { _like: $title } }, offset: 0) {
      ...paper_fields
      cites(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
        ...paper_fields
        cites(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
          ...paper_fields
        }
      }
    }
  }
`;

export const TITLE_QUERY_REV = gql`
  ${PAPER_FIELDS}
  query papers($title: String!) {
    papers(limit: 1, where: { title: { _like: $title } }, offset: 0) {
      ...paper_fields
      cites: cited_by(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
        ...paper_fields
        cites: cited_by(args: { limit_: ${MAX_CITATIONS_PER_PAPER} }) {
          ...paper_fields
        }
      }
    }
  }
`;

let client;

export const getPaper = async title => {
  if (!client) {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: GRAPHQL_ENDPOINT,
        fetch,
      }),
    });
  }


  // TODO: Clean up with a proper query syntax
  let parsed = title;
  const isRev = title.startsWith("~");
  if (isRev) {
    parsed = title.slice(1);
  }

  let query;
  const idMatch = parsed.match(/id:([a-z0-9]+$)/);
  if (idMatch) {
    query = {
      query: isRev ? ID_QUERY_REV : ID_QUERY,
      variables: { id: idMatch[1] },
    };
  } else {
    query = {
      query: isRev ? TITLE_QUERY_REV : TITLE_QUERY,
      variables: { title: `%${parsed}%` },
    };
  }

  return await client.query(query).then(res => res.data);
};
