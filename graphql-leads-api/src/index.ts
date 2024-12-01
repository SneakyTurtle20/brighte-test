import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Lead } from "./entities/Lead";
import { LeadResolver } from "./resolvers/LeadResolver";

async function main() {
  await createConnection({
    type: "sqlite",
    database: "database.sqlite",
    entities: [Lead],
    synchronize: true,
  });

  const schema = await buildSchema({
    resolvers: [LeadResolver],
    validate: false,
  });

  const server = new ApolloServer({ schema });

  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

main().catch((error) => {
  console.error(error);
});