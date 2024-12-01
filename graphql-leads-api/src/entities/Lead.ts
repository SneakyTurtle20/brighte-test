import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { ServiceType } from "../enums/ServiceType";

// Register the enum with GraphQL
registerEnumType(ServiceType, {
  name: "ServiceType",
  description: "The type of service user is interested in"
});

@Entity()
@ObjectType()
export class Lead {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  mobile: string;

  @Column()
  @Field()
  postcode: string;

  @Column("simple-array")
  @Field(() => [ServiceType])
  interestedServices: ServiceType[];
}