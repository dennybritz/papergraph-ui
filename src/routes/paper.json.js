import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import fetch from 'cross-fetch';

const QUERY = gql`
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
    num_citations
  }

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


export async function get(req, res, next) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "http://papergraph.dennybritz.com/v1/graphql",
      fetch,
    }),
  });

  const title = `%${req.query.title}%`;

  try {
    let data = await client.query( { query: QUERY, variables: { title } }).then(res => res.data);
    res.end(JSON.stringify(data));
  } catch (err) {
    res.statusCode = 404;
    res.end(JSON.stringify(err));
  }
}
