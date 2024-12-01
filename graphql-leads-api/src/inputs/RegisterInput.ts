import { InputType, Field } from "type-graphql";
import { 
  IsEmail, 
  IsPostalCode, 
  Matches, 
  ArrayMinSize, 
  Length,
  Validate 
} from "class-validator";
import { ServiceType } from "../enums/ServiceType";

@InputType()
export class RegisterInput {
  @Field()
  @Length(2, 100, { message: "Name must be between 2 and 100 characters" })
  name: string;

  @Field()
  @IsEmail({}, { message: "Please provide a valid email address" })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: "Email format is invalid" }
  )
  email: string;

  @Field()
  @Matches(
    /^(\+61|0)[4][0-9]{8}$/,
    { message: "Mobile number must be a valid Australian mobile number" }
  )
  mobile: string;

  @Field()
  @IsPostalCode("AU", { message: "Please provide a valid Australian postcode" })
  @Length(4, 4, { message: "Postcode must be exactly 4 digits" })
  @Matches(/^[0-9]{4}$/, { message: "Postcode must contain only numbers" })
  postcode: string;

  @Field(() => [ServiceType])
  @ArrayMinSize(1, { message: "At least one service must be selected" })
  interestedServices: ServiceType[];
}