import { InputType, Field } from "type-graphql";
import { IsEmail, IsPostalCode, IsPhoneNumber, ArrayMinSize } from "class-validator";
import { ServiceType } from '../enums/ServiceType'
@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsPhoneNumber("AU") // Assuming Australian phone numbers
  mobile: string;

  @Field()
  @IsPostalCode("AU") // Assuming Australian postcodes
  postcode: string;

  @Field(() => [ServiceType])
  @ArrayMinSize(1)
  interestedServices: ServiceType[];
}