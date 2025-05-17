import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class OrganizationInput {
  @Field()
  website!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  location?: string;
}

@InputType()
export class UserInput {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  phone!: string;
}

@InputType()
export class AddJobPostInput{
  @Field()
  job_title!:string

  @Field()
  category!:string

  @Field()
  openings!:string

  @Field()
  experience!:string

  @Field()
  description!:string

  @Field()
  package!:string

  @Field()
  language!:string

  @Field()
  skills!:string

}
@InputType()
export class GetAllJobPostByOrganizationInput{
  @Field()
  id!:string
}
@InputType()
export class UpdateJobPostInput{
  @Field()
  id!:string

  @Field()
  job_title!:string

  @Field()
  category!:string

  @Field()
  openings!:string

  @Field()
  experience!:string

  @Field()
  description!:string

  @Field()
  package!:string

  @Field()
  language!:string

  @Field()
  skills!:string

}
@InputType()
export class GetJobAppliedApplicationsInput{
  @Field()
  id!:string
}
@InputType()
export class UpdatJobAppliedStatusInput{
  @Field()
  id!:string

  @Field()
  status!:string
}
@InputType()
export class OrganizationIdInput{
  @Field()
  id!:string
}
@InputType()
export class UpdateOrganizationStatusInput{
    @Field()
    id!:string

    @Field()
    status!:string
}
@InputType()
export class UpdateOrganizationPasswordInput{

    @Field()
    oldPassword!:string

    @Field()
    newPassword!:string
}
@InputType()
export class DeleteOrganizationInput{
    @Field()
    id!:string
}
