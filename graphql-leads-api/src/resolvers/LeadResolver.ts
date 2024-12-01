import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Lead } from "../entities/Lead";
import { RegisterInput } from "../inputs/RegisterInput";
import { getRepository } from "typeorm";

@Resolver()
export class LeadResolver {
  @Query(() => [Lead])
  async leads(): Promise<Lead[]> {
    return await getRepository(Lead).find();
  }

  @Query(() => Lead, { nullable: true })
  async lead(@Arg("id") id: number): Promise<Lead | null> {
    return await getRepository(Lead).findOne({ where: { id } });
  }

  @Mutation(() => Lead)
  async register(@Arg("input") input: RegisterInput): Promise<Lead> {
    const lead = getRepository(Lead).create(input);
    await getRepository(Lead).save(lead);
    return lead;
  }
}