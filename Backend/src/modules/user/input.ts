import { Field, InputType, } from "type-graphql";

@InputType()
export class UserInput {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  phone!: string;

  @Field()
  password!: string;

  @Field()
  role!: string;
}
@InputType()
export class LoginInput {
  @Field()
  email!:string

  @Field()
  password!:string
}
@InputType()
export class JobApplyInput{
  @Field()
  jobpost_id!:string

  @Field()
  organization_id!:string
}
@InputType()
export class JobAppliedByUserInput{
  @Field()
  id!:string
}
@InputType()
export class UserIdInput{
  @Field()
  id!:string
}
@InputType()
export class UpdateUserInput{
  @Field()
  id!:string

  @Field()
  name!:string

  @Field()
  email!:string

  @Field()
  phone?: string;

  @Field()
  age?: string;

  @Field()
  experience?: string;

  @Field()
  skills?:string

  @Field()
  description?:string


}
@InputType()
export class WithdrawApplicationInput{
  @Field()
  id!:string
}
@InputType()
export class UploadResumeInput{

  @Field()
  resumeKey!:string
}
@InputType()
export class UpdateJobPostStatusInput {
    @Field()
    id!: string;

    @Field()
    status!:string;
  }
  @InputType()
  export class UploadPdfInput{
      @Field()
      fileName!:string
  
      @Field()
      fileType!:string
  }
  @InputType()
  export class DownloadPdfInput{
      @Field()
      key!:string
  }

