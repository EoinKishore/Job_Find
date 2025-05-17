import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class AddJobPostResponse{
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

    @Field()
    organization_id!:string
}
@ObjectType()
export class GetAllJobPostByOrganizationResponse{
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

    @Field()
    organization_id!:string

    @Field()
    status!:string;

}
@ObjectType()
export class UpdateJobPostResponse{
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
@ObjectType()
export class GetJobAppliedApplicationsResponse{
    @Field()
  id!:string

  @Field()
  jobpost_id!:string

  @Field()
  user_id!:string

  @Field()
  organization_id!:string

  @Field()
  status!:string

  @Field()
  name!:string

  @Field()
  email!:string

  @Field()
  job_title!:string

  @Field()
  category!:string

  @Field()
  company!:string

  @Field()
  openings!:string

  @Field()
  skills!:string

  @Field({nullable:true})
  resumeKey!:string
}
@ObjectType()
export class UpdatJobAppliedStatusResponse{
    @Field()
    id!:string
  
    @Field()
    status!:string
  }
  @ObjectType()
export class UpdateOrganizationStatusResponse{
    @Field()
    id!:string

    @Field()
    status!:string
}
@ObjectType()
export class UpdateOrganizationPasswordResponse{
    @Field()
    update_password_state!:boolean
}
@ObjectType()
export class DeleteOrganizationResponse{
    @Field()
    id!:string
}
@ObjectType()
class AdminOganizationUser{
    @Field()
    id!:string

    @Field()
    name!:string

    @Field()
    email!:string

    @Field()
    phone!:string

    @Field()
    role!: string;
}
@ObjectType()
export class AllApprovedOrganization{
    @Field()
    id!:string;

    @Field()
    website!:string;

    @Field()
    description!: string;

    @Field()
    status!:string;

    @Field()
    location!:string;

    @Field()
    created_at!: Date;

    @Field({ nullable: true })
    updated_at?: Date;

    @Field({ nullable: true })
    deleted_at?: Date;

    @Field()
    organization_id!: string;

    @Field()
    update_password_state!: boolean;

    @Field(() => AdminOganizationUser)
    user!: AdminOganizationUser;

}
