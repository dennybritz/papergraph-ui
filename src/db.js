import { gql } from "@apollo/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

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
      cites(args: { limit_: 10 }) {
        ...paper_fields
        cites(args: { limit_: 10 }) {
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
      cites(args: { limit_: 10 }) {
        ...paper_fields
        cites(args: { limit_: 10 }) {
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
        uri: "http://papergraph.dennybritz.com/v1/graphql",
        fetch,
      }),
    });
  }

  let query;
  const idMatch = title.match(/id:([a-z0-9]+$)/);
  if (idMatch) {
    query = { query: ID_QUERY, variables: { id: idMatch[1] } };
  } else {
    query = { query: TITLE_QUERY, variables: { title: `%${title}%` } };
  }

  return await client.query(query).then(res => res.data);
};
