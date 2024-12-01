import { ApolloServer, gql } from "apollo-server";
import { buildSchema } from "type-graphql";
import { LeadResolver } from "../resolvers/LeadResolver";
import { ServiceType } from "../enums/ServiceType";
import { RegisterInput } from '../inputs/RegisterInput'

let server: ApolloServer;

beforeAll(async () => {
  const schema = await buildSchema({
    resolvers: [LeadResolver],
    validate: false,
  });
  server = new ApolloServer({ schema });
});

const REGISTER_LEAD = gql`
  mutation Register($input: RegisterInput!) { 
    register(input: $input) {
      id
      name
      email
      mobile
      postcode
      interestedServices
    }
  }
`;

const GET_LEAD = gql`
  query GetLead($id: Float!) {
    lead(id: $id) {
      id
      name
      email
      mobile
      postcode
      interestedServices
    }
  }
`;

const GET_LEADS = gql`
  query {
    leads {
      id
      name
      email
      mobile
      postcode
      interestedServices
    }
  }
`;

describe("Lead Resolver", () => {

  describe("Mutations", () => {
    it("should successfully register a new lead", async () => {
      const input =  {
        name: "Walid Jamarin",
        email: "walidjam@example.com",
        mobile: "+61412345678",
        postcode: "3000",
        interestedServices: ['DELIVERY', 'PICKUP']
      };

      const response = await server.executeOperation({
        query: REGISTER_LEAD,
        variables: {input}
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.register).toMatchObject({
        name: input.name,
        email: input.email,
        mobile: input.mobile,
        postcode: input.postcode,
        interestedServices: input.interestedServices
      });
      expect(response.data?.register.id).toBeDefined();
    });

    it("should fail when registering with invalid email", async () => {
      const input = {
        name: "Walid Jamarin", 
        email: "invalid-email",
        mobile: "+61412345678",
        postcode: "2000",
        interestedServices: ['DELIVERY']
      };

      const response = await server.executeOperation({
        query: REGISTER_LEAD,
        variables: {input}
      });

      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].extensions?.errors?.[0]).toEqual("Email format is invalid, Please provide a valid email address");
    });

    it("should fail when registering with invalid mobile", async () => {
      const input = {
        name: "Walid Jamarin",
        email: "walid@example.com", 
        mobile: "",
        postcode: "2000",
        interestedServices: ['DELIVERY']
      };

      const response = await server.executeOperation({
        query: REGISTER_LEAD,
        variables: {input}
      });

      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].extensions?.errors?.[0]).toEqual("Mobile number must be a valid Australian mobile number");
    });

    it("should fail when registering with empty interested services", async () => {
      const input = {
        name: "Walid Jamarin",
        email: "walid@example.com",
        mobile: "+61412345678",
        postcode: "2000",
        interestedServices: []
      };

      const response = await server.executeOperation({
        query: REGISTER_LEAD,
        variables: {input}
      });

      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].extensions?.errors?.[0]).toEqual("At least one service must be selected");
    });
  });

  describe("Queries", () => {
    // Tests querying leads when none exist
    it("should return empty array when no leads exist", async () => {
      const response = await server.executeOperation({
        query: GET_LEADS
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.leads).toEqual([]);
    });

    // Tests querying a non-existent lead by ID
    it("should return null when querying non-existent lead", async () => {
      const response = await server.executeOperation({
        query: GET_LEAD,
        variables: { id: 999 }
      });

      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].message).toEqual("Lead not found");
    });

    // Tests querying a single lead after registering it
    it("should successfully query an existing lead", async () => {
      // First register a lead
      const input = {
        name: "Walid Jamarin",
        email: "walid@example.com",
        mobile: "+61412345678",
        postcode: "2000",
        interestedServices: ['DELIVERY']
      };

      const registerResponse = await server.executeOperation({
        query: REGISTER_LEAD,
        variables: { input }
      });
      console.log('registerResponse', JSON.stringify(registerResponse));

      const leadId = registerResponse.data?.register.id;

      // Then query the lead
      const response = await server.executeOperation({
        query: GET_LEAD,
        variables: { id: Number(leadId) }
      });

      expect(response.errors).toBeUndefined();
      expect(response.data?.lead).toMatchObject({
        id: leadId,
        ...input
      });
    });

    // Tests querying multiple leads after registering them
    it("should successfully query all leads", async () => {
      // First register two leads
      const inputs = [
        {
          name: "Walid Jamarin",
          email: "walid@example.com",
          mobile: "+61412345678",
          postcode: "2000",
          interestedServices: ['DELIVERY']
        },
        {
          name: "Jane Doe",
          email: "jane@example.com",
          mobile: "+61412345679",
          postcode: "2001",
          interestedServices: ['PICKUP', 'PAYMENT']
        }
      ];

      for (const input of inputs) {
        await server.executeOperation({
          query: REGISTER_LEAD,
          variables: { input }
        });
      }

      // Then query all leads
      const response = await server.executeOperation({ query: GET_LEADS });

      expect(response.errors).toBeUndefined();
      expect(response.data?.leads).toHaveLength(2);
      expect(response.data?.leads[0]).toMatchObject(inputs[0]);
      expect(response.data?.leads[1]).toMatchObject(inputs[1]);
    });
  });
});