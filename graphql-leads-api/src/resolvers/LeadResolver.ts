import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Lead } from "../entities/Lead";
import { RegisterInput } from "../inputs/RegisterInput";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { ApolloError, UserInputError } from "apollo-server";

@Resolver()
export class LeadResolver {
  @Query(() => [Lead])
  async leads(): Promise<Lead[]> {
    try {
      return await getRepository(Lead).find();
    } catch (error) {
      throw new ApolloError("Failed to fetch leads", "DATABASE_ERROR");
    }
  }

  @Query(() => Lead, { nullable: true })
  async lead(@Arg("id") id: number): Promise<Lead | undefined> {
    try {
      const lead = await getRepository(Lead).findOne({ where: { id } });
      if (!lead) {
        throw new UserInputError("Lead not found");
      }
      return lead;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new ApolloError("Failed to fetch lead", "DATABASE_ERROR");
    }
  }

  @Mutation(() => Lead)
  async register(@Arg("input") input: RegisterInput): Promise<Lead> {
    try {
      // Validate input
      const errors = await validate(input);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(", ")
        );
        throw new UserInputError("Invalid input", { errors: errorMessages });
      }

      // Check if email already exists
      const existingLead = await getRepository(Lead).findOne({ 
        where: { email: input.email } 
      });
      
      if (existingLead) {
        throw new UserInputError("Email already registered");
      }

      // Create and save the lead
      const lead = getRepository(Lead).create(input);
      await getRepository(Lead).save(lead);
      return lead;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new ApolloError(
        "Failed to register lead", 
        "REGISTRATION_ERROR",
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}