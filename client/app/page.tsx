"use client";
// Import everything needed to use the `useQuery` hook
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const exampleQuery = gql`
  query ExampleQuery {
    Example {
      name
    }
  }
`;

export default function App() {
  const { loading, error, data } = useQuery(exampleQuery);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  console.log(data);

  return (
    <div>
      <h2>Data received check in the console.</h2>
    </div>
  );
}
