import { Arg, Mutation, Query, Resolver , ID, Ctx } from "type-graphql";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import {
  DownloadPdfInput,
  JobApplyInput,
  LoginInput,
  UpdateJobPostStatusInput,
  UpdateUserInput,
  UploadResumeInput,
  UserInput,
  WithdrawApplicationInput,
} from "./input";
import { getRepository } from "typeorm";
import { Service } from "typedi";
import {
  DeleteUserResponse,
  DownloadPdfResponse,
  GetAllUser,
  GetCurrentUserResponse,
  JobAppliedByUserResponse,
  JobApplyResponse,
  JobPostResponse,
  LoginResponse,
  UpdateJobPostStatusResponse,
  UploadResumeResponse,
  UserDetailsResponse,
  WithdrawApplicationResponse,
} from "./response";
import { UploadPdfResponse } from "../user/response";
import { UploadPdfInput } from "../user/input";
import { downloadPdf, uploadPdf } from "../s3/s3service";
console.log("the resolver of user");

@Resolver()
@Service()
export class UserResolver {
  constructor(private userService = new UserService(),
) {}


  @Mutation(() => User)
  async signUpUser(@Arg("input") input: UserInput): Promise<User> {
    console.log("the input in resolver", input);
    return this.userService.signUpUser(input);
  }
  @Mutation(() => LoginResponse)
  async login(@Arg("input") input: LoginInput): Promise<LoginResponse> {
    console.log("the login input", input);
    const token = await this.userService.login(input);
    console.log("the token in resolver", token);
    return token;
  }
  @Query(() => [JobPostResponse])
  async allJobPosts(): Promise<JobPostResponse[]> {
    return this.userService.allJobPosts();
  }
  @Mutation(() => JobApplyResponse)
  async applyForJob(@Arg("input") input: JobApplyInput,@Ctx() ctx : any): Promise<JobApplyResponse> {
    return this.userService.applyForJob(input,ctx);
  }
  @Query(() => [JobAppliedByUserResponse])
  async getUserJobApplied(@Ctx() ctx:any): Promise<JobAppliedByUserResponse[]> {
    return this.userService.getUserJobApplied(ctx);
  }
  @Query(() => Number)
  async countUserApplications(@Ctx() ctx : any): Promise<Number> {
    return this.userService.countUserApplications(ctx);
  }
  @Query(() => UserDetailsResponse)
  async user(@Ctx() ctx: any):Promise<UserDetailsResponse>{
    return this.userService.user(ctx);
  }
  @Mutation(() => UserDetailsResponse)
  async updateUser(@Arg("input")input:UpdateUserInput):Promise<UserDetailsResponse>{
    return this.userService.updateUser(input);
  }
  @Mutation(() => WithdrawApplicationResponse)
  async withdrawApplication(@Arg("input")input:WithdrawApplicationInput,@Ctx() ctx:any):Promise<WithdrawApplicationResponse>{
    return this.userService.withdrawApplication(input,ctx);
  }
  @Mutation(() => UploadResumeResponse)
  async uploadResume(@Arg("input")input:UploadResumeInput,@Ctx() ctx : any):Promise<UploadResumeResponse>{
    return this.userService.uploadResume(input,ctx);
  }
  @Mutation(() => UpdateJobPostStatusResponse)
  async updateJobPostStatus(@Arg('input') input: UpdateJobPostStatusInput) {
    return this.userService.updateStatus(input);
  }
  @Query(() => Number)
  async countUsers():Promise<Number>{
      return this.userService.countUsers();
  }
  @Mutation(() => DeleteUserResponse)
  async deleteUser(@Arg("id", () => ID) id:string) : Promise<DeleteUserResponse>{
      return this.userService.deleteUser(id);
  }
  @Query(() => [GetAllUser])
  async users() : Promise<GetAllUser[]>{
    return this.userService.users();
  }
  @Mutation(() => UploadPdfResponse)
  async generateUploadUrl(
    @Arg("input") input: UploadPdfInput
  ): Promise<UploadPdfResponse> {
    const presignedUrl = await uploadPdf(
      process.env.AWS_S3_BUCKET_NAME as string,
      input.fileName
    );
    return {
      presignedUrl,
      key: input.fileName,
      publicUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${input.fileName}`,
    };
  }

  @Query(() => DownloadPdfResponse)
  async generateDownloadUrl(@Arg("input")input:DownloadPdfInput):Promise<DownloadPdfResponse>{
    const downloadUrl = await downloadPdf(process.env.AWS_S3_BUCKET_NAME as string ,input.key)
    return { 
        downloadUrl,
        expiresAt: new Date(Date.now() + 3600 * 1000)
    }
  }
  @Query(() => GetCurrentUserResponse)
  async currentUser(@Ctx() ctx : any):Promise<GetCurrentUserResponse>{
    return this.userService.currentUser(ctx)
  }
}
