import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import { Lead } from "../entities/Lead";

beforeAll(async () => {
  await createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [Lead],
    synchronize: true,
    logging: false
  });
});

afterAll(async () => {
  const conn = getConnection();
  await conn.close();
});

afterEach(async () => {
  const conn = getConnection();
  await conn.synchronize(true);
});