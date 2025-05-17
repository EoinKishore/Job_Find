import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Organization } from "./entity/organization.entity";
import { OrganizationService } from "./organization.service";
import { AddJobPostInput,
   DeleteOrganizationInput,
  OrganizationInput, 
  UpdateJobPostInput, 
  UpdateOrganizationPasswordInput, 
  UpdateOrganizationStatusInput, 
  UpdatJobAppliedStatusInput } from "./input";
import { UserInput } from "../user/input";
import { Service } from "typedi";
import { AddJobPostResponse, 
  AllApprovedOrganization, 
  DeleteOrganizationResponse, 
  GetAllJobPostByOrganizationResponse, 
  GetJobAppliedApplicationsResponse, 
  UpdateJobPostResponse, 
  UpdateOrganizationPasswordResponse, 
  UpdateOrganizationStatusResponse, 
  UpdatJobAppliedStatusResponse } from "./organization.response";

@Resolver()
@Service()
export class OrganizationResolver {
  constructor(
    private organizationService = new OrganizationService()
  ) {}

  @Mutation(() => Organization)
  async signUpOrganization(
    @Arg("input") input: OrganizationInput,
    @Arg("signUpUserInput2") userInput: UserInput
  ): Promise<Organization> {
    try {
      console.log('Organization input:', input);
      console.log('User input:', userInput);
      
      const result = await this.organizationService.signUpOrganization(input, userInput);
      
      console.log('Organization created:', result);
      return result;
    } catch (error) {
      console.error('Error in organization resolver:', error);
      throw error;
    }
  }
  // adding job post
  @Mutation(() =>AddJobPostResponse)
  async addJobPost(@Arg("input")input:AddJobPostInput,@Ctx() ctx : any):Promise<AddJobPostResponse>{
    return this.organizationService.addJobPost(input,ctx);
  }
  // get job post posted by organization
  @Query(() => [GetAllJobPostByOrganizationResponse])
  async jobPosts(@Ctx() ctx : any):Promise<GetAllJobPostByOrganizationResponse[]>{
    return  this.organizationService.jobPosts(ctx);
  }
  //Update job post
  @Mutation(() => UpdateJobPostResponse)
  async updateJobPost(@Arg("input")input:UpdateJobPostInput):Promise<UpdateJobPostResponse>{
    return this.organizationService.updateJobPost(input);
  }
  //getting job apllications
  @Query(() => [GetJobAppliedApplicationsResponse])
  async jobApplied(@Ctx() ctx : any):Promise<GetJobAppliedApplicationsResponse[]>{
    return this.organizationService.jobApplied(ctx);
  }
  @Mutation(() => UpdatJobAppliedStatusResponse)
  async updateApplicationStatus(@Arg("input")input:UpdatJobAppliedStatusInput):Promise<UpdatJobAppliedStatusResponse>{
    return this.organizationService.updateApplicationStatus(input);
  }
  @Query(() => Number)
  async countOrganizationJobPosts(@Ctx() ctx : any):Promise<number>{
    return this.organizationService.countOrganizationJobPosts(ctx);
  }
  @Query(() => Number)
  async countOrganizationApplications(@Ctx() ctx : any):Promise<number>{
    return this.organizationService.countOrganizationApplications(ctx);
  }
  @Mutation(() => UpdateOrganizationStatusResponse)
  async updateOrganizationStatus(@Arg("input") input:UpdateOrganizationStatusInput):Promise<UpdateOrganizationStatusResponse>{
      return this.organizationService.updateOrganizationStatus(input);
  }
  @Query(() => Number)
  async countJobPosts():Promise<number>{
      return this.organizationService.countJobPosts();
  }
  @Query(() => Number)
  async countOrganizations():Promise<number>{
      return this.organizationService.countOrganizations();
  }
  @Mutation(() => UpdateOrganizationPasswordResponse)
  async updateOrganizationPassword(@Arg("input") input:UpdateOrganizationPasswordInput,@Ctx() ctx : any):Promise<UpdateOrganizationPasswordResponse>{
      return this.organizationService.updateOrganizationPassword(input,ctx);
  }
  @Mutation(() => DeleteOrganizationResponse)
  async deleteOrganization(@Arg("input")input: DeleteOrganizationInput):Promise<DeleteOrganizationResponse>{
      return this.organizationService.deleteOrganization(input);
  }
  @Query(() => [AllApprovedOrganization])
  async getAllOrganizations(): Promise<AllApprovedOrganization[]>{
    return this.organizationService.getAllOrganizations();
  }
  
}
