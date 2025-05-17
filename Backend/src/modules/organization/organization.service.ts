import { Organization } from "./entity/organization.entity";
import { User, UserRole } from "../user/entity/user.entity";
import {
  AddJobPostInput,
  DeleteOrganizationInput,
  OrganizationInput,
  UpdateJobPostInput,
  UpdateOrganizationPasswordInput,
  UpdateOrganizationStatusInput,
  UpdatJobAppliedStatusInput,
} from "./input";
import { UserInput } from "../user/input";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dataSource from "../../database/data-source";
import { Service } from "typedi";
import {
  AddJobPostResponse,
  AllApprovedOrganization,
  DeleteOrganizationResponse,
  GetAllJobPostByOrganizationResponse,
  GetJobAppliedApplicationsResponse,
  UpdateJobPostResponse,
  UpdateOrganizationPasswordResponse,
  UpdateOrganizationStatusResponse,
  UpdatJobAppliedStatusResponse,
} from "./organization.response";
import { JobPost } from "../jobs/entity/jobPost.entity";
import { JobApplied } from "../jobs/entity/jobApplied.entity";
import { generatePassword } from "../../../utils/passwordgenerator";
import { sendEmail } from "../../../utils/emailsender";

@Service()
export class OrganizationService {
  constructor(
    private userRepository = dataSource.getRepository(User),
    private orgRepository = dataSource.getRepository(Organization),
    private jobPostRepository = dataSource.getRepository(JobPost),
    private jobAppliedRepository = dataSource.getRepository(JobApplied)
  ) {}

  async signUpOrganization(
    input: OrganizationInput,
    userInput: UserInput
  ): Promise<Organization> {
    try {
      console.log("came to service");

      const {
        website,
        status = "pending",
        description = "",
        location = "",
      } = input;
      const { name, email, phone } = userInput;

      const normalizedEmail = email.toLowerCase();
      const userId = uuidv4();
      const orgId = uuidv4();
      const existingUser = await this.userRepository.findOne({
        where: { email: normalizedEmail },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const defaultPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const user = new User();
      user.id = userId;
      user.name = name;
      user.email = normalizedEmail;
      user.phone = phone;
      user.password = hashedPassword;
      user.role = UserRole.ORGANIZATION;

      await this.userRepository.save(user);

      const organization = new Organization();
      organization.id = orgId;
      organization.user = { id: userId } as User;
      organization.website = website;
      organization.description = description;
      organization.status = status;
      organization.location = location;

      const savedOrganization = await this.orgRepository.save(organization);

      await sendEmail({
        from: process.env.EMAIL,
        to: normalizedEmail,
        subject: "Wait until admin approve",
        text: "Welcome to Job Found, You have signed up, wait until admin accepts",
      });

      console.log("Organization created successfully:", savedOrganization);
      return savedOrganization;
    } catch (error) {
      console.error("Error in signUpOrganization service:", error);
      throw error;
    }
  }
  async addJobPost(input: AddJobPostInput,context : any): Promise<AddJobPostResponse> {
    const id = uuidv4();
    const organizationId = context.user.userId;
    const result : any= await this.jobPostRepository.save({
      id,
      job_title: input.job_title,
      category: input.category,
      openings: input.openings,
      experience: input.experience,
      description: input.description,
      package: input.package,
      language: input.language,
      skills: input.skills,
      organization: {id:organizationId},
      status:'pending',
    });
    return {
      ...result,
      organization_id: result.organization.id
    };
  }
  async jobPosts(context : any): Promise<GetAllJobPostByOrganizationResponse[]> {
    const orgId = context.user.userId;
    const posts = await this.jobPostRepository.find({
      where: { organization: { id: orgId } },
      relations: ["organization"],
    });

    console.log("the posts are ", posts);

    return posts.map((post : any) => ({
      id: post.id,
      job_title: post.job_title,
      category: post.category,
      openings: post.openings,
      experience: post.experience,
      description: post.description,
      package: post.package,
      language: post.language,
      skills: post.skills,
      organization_id: post.organization.id,
      status:post.status,
    }));
  }
  async updateJobPost(input: UpdateJobPostInput): Promise<UpdateJobPostResponse> {
    await this.jobPostRepository.update(
      { id: input.id },
      {
        job_title: input.job_title,
        category: input.category,
        openings: input.openings,
        experience: input.experience,
        description: input.description,
        package: input.package,
        language: input.language,
        skills: input.skills,
      }
    );
    const updatePost = await this.jobPostRepository.findOne({
      where: { id: input.id },
      select: [
        "id",
        "job_title",
        "category",
        "openings",
        "experience",
        "description",
        "package",
        "language",
        "skills",
      ],
    });
    return updatePost as UpdateJobPostResponse;
  }
  async jobApplied(context : any): Promise<GetJobAppliedApplicationsResponse[]> {
    const orgId = context.user.userId;
    const result = await this.jobAppliedRepository.query(
      `SELECT 
        ja.id, ja.jobpost_id, ja.organization_id, ja.user_id, ja.status, ja.created_at, ja.updated_at,
        u.name, u.email,
        jp.job_title, jp.category, jp.openings, jp.skills,
        org.name AS company , ud.resume AS "resumeKey"
       FROM jobapplied ja
       JOIN users u ON ja.user_id = u.id
       JOIN userdetails ud ON ud.user_id = u.id
       JOIN jobposts jp ON ja.jobpost_id = jp.id
       JOIN users org ON ja.organization_id = org.id
       WHERE ja.organization_id = $1 AND ja.deleted_at IS NULL`,
      [orgId]
    );
    return result;
  }
  async updateApplicationStatus(
    input: UpdatJobAppliedStatusInput
  ): Promise<UpdatJobAppliedStatusResponse> {
    await this.jobAppliedRepository.update(
      { id: input.id },
      { status: input.status, updated_at: new Date() }
    );
    const jobApplied = await this.jobAppliedRepository.findOne({
      where: { id: input.id },
      relations: ["user"],
      select: ["id", "status", "user"],
    });

    if (!jobApplied || !jobApplied.user) {
      throw new Error("Job application or user not found");
    }

    
    await sendEmail({
      from: process.env.EMAIL,
      to: jobApplied.user.email,
      subject: `Regarding Application Status`,
      text: `Your Application has got ${input.status}`,
    });

    return { id: input.id, status: input.status };
  }
  async countOrganizationJobPosts(context : any): Promise<number> {
    const orgId = context.user.userId;
    const result = await this.jobPostRepository.count({where:{organization:{id:orgId}}});
    return result;
  }
  async countOrganizationApplications(context : any): Promise<number> {
    const orgId = context.user.userId;
    return await this.jobAppliedRepository.count({where:{organization:{id:orgId}}});
  }
  async updateOrganizationStatus(input : UpdateOrganizationStatusInput):Promise<UpdateOrganizationStatusResponse>{
    
    const result : any = await this.orgRepository.findOne({where:{id:input.id},relations:['user']});
    
    await this.orgRepository.update({id:input.id},{status:input.status});
   
        if (input.status === 'approved' || input.status === 'rejected') {
          let emailSubject = `Application Status Updated: ${input.status}`;
          let emailText = '';
    
          if (input.status === 'approved') {
            const defaultPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
            await this.userRepository.update({id:result?.user?.id},{password:hashedPassword});
           
    
            emailText = `Your organization has been approved. 
            The default password is ${defaultPassword}. After logging in, you can change the password.`;
          } else if (input.status === 'rejected') {
            emailText = `Your application has been rejected.`;
          }
    
          await sendEmail({
            from: process.env.EMAIL,
            to: result?.user?.email,
            subject: emailSubject,
            text: emailText,
          });
        }
    return {id:input.id , status:input.status};
  }
  async countJobPosts():Promise<number>{
    return await this.jobPostRepository.count();
  }
  async countOrganizations():Promise<number>{
    const result = await this.userRepository.count({where:{role:'organization'}});
   

    return result;
  }
  async updateOrganizationPassword(input: UpdateOrganizationPasswordInput,context : any): Promise<UpdateOrganizationPasswordResponse> {
    const organizationId = context.user.userId;
    const newpassword : any = await this.userRepository.findOne({where:{id:organizationId},select:['password']});
  
    console.log('the old password is ',newpassword.password);
    const isOldPassword = await bcrypt.compare(input.oldPassword,newpassword.password);
    if(!isOldPassword){
      throw new Error('Current password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    
    await this.userRepository.update({id:organizationId},{password:hashedPassword})
    await this.orgRepository.update({user:{id:organizationId}},{update_password_state:true});
    

    console.log("the password is ", input.newPassword);

    return {
      update_password_state: true,
    };
  }
  async deleteOrganization(input:DeleteOrganizationInput): Promise<DeleteOrganizationResponse> {
    
    const [organization] = await this.orgRepository.query(
        `SELECT organization_id FROM organizations WHERE id = $1 AND deleted_at IS NULL`,[input.id]
    );
    await this.orgRepository.update({id:input.id},{deleted_at:new Date()});
    
    await this.userRepository.update({id:organization.organization_id},{deleted_at:new Date()});
    
    await this.jobPostRepository.query(
      `UPDATE jobposts SET deleted_at = NOW() WHERE organization_id = $1 AND deleted_at IS NULL`,[organization.organization_id]
    );
    await this.jobAppliedRepository.query(
      `UPDATE jobapplied SET deleted_at = NOW() WHERE organization_id = $1 AND deleted_at IS NULL`,[organization.organization_id]
    );

    return {id:input.id};
  }
  async getAllOrganizations(): Promise<AllApprovedOrganization[]> {
    // const organizations = await this.orgRepository.find({where:{user:{role:'organization'}},relations:['user']})
    const organizations = await this.orgRepository.query(`
            SELECT o.id, o.website, o.description, o.status, o.location, o.created_at, o.updated_at, o.deleted_at, o.organization_id, o.update_password_state,u.id AS "user_id", u.name AS "user_name", u.email AS "user_email", u.phone AS "user_phone",u.role AS "user_role"
            FROM users u
            INNER JOIN organizations o ON u.id = o.organization_id
            WHERE u.role = 'organization' AND u.deleted_at IS NULL
        `);

    return organizations.map(
      (org: any ) => ({
        id: org.id,
        website: org.website,
        description: org.description,
        status: org.status,
        location: org.location,
        created_at: org.created_at,
        updated_at: org.updated_at,
        deleted_at: org.deleted_at,
        organization_id: org.organization_id,
        update_password_state: org.update_password_state,
        user: {
          id: org.user_id,
          name: org.user_name,
          email: org.user_email,
          phone: org.user_phone,
          role: org.user_role,
        },
      })
    );
  }

}
