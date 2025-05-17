import { getRepository, IsNull } from "typeorm";
import { User, UserRole } from "./entity/user.entity";
import { UserDetails } from "./entity/userDetails.entity";
import {  JobApplyInput, LoginInput, UpdateJobPostStatusInput, UpdateUserInput, UploadResumeInput, UserInput, WithdrawApplicationInput } from "./input";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Service } from "typedi";
import dataSource from "../../database/data-source";
import { Organization } from "../organization/entity/organization.entity";
import * as jwt from "jsonwebtoken";
import {  DeleteUserResponse, GetCurrentUserResponse, JobAppliedByUserResponse, JobApplyResponse, JobPostResponse, LoginResponse, UpdateJobPostStatusResponse, UploadResumeResponse, UserDetailsResponse, WithdrawApplicationResponse } from "./response";
import { GetAllUser } from "../user/response";
import { JobPost } from "../jobs/entity/jobPost.entity";
import { JobApplied } from "../jobs/entity/jobApplied.entity";

@Service()
export class UserService {
   constructor(
    private userRepository = dataSource.getRepository(User),
  private userDetailsRepository = dataSource.getRepository(UserDetails),
  private orgRepository = dataSource.getRepository(Organization),
  private jobPostRepository = dataSource.getRepository(JobPost),
  private jobAppliedRepository = dataSource.getRepository(JobApplied)
  ) {}
  

  
  async signUpUser(input: UserInput): Promise<User> {
    try {
      console.log("Service received input:", input);
      const { name, email, phone, password } = input;
      const normalizedEmail = email.toLowerCase();

      const existingUser = await this.userRepository.findOne({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();

      const savedUser = await this.userRepository.save( {id:id,
        name : name,
        email : normalizedEmail,
        phone : phone,
        password : hashedPassword,
        role : UserRole.USER});

      console.log('the saved user ',savedUser);
      
      const userdetails = await this.userDetailsRepository.save({
        id: uuidv4(),
        user: {id:id},
        age: 18,
        experience : "",
        skills: "",
        description:"",
      })
      console.log('the userdetails ',userdetails);
      
      console.log("User created successfully:", savedUser);
      return savedUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    try {
      const {email, password} = input;
      console.log('the service in the login',input);
      
      const normalizedEmail = email.toLowerCase();

      const user = await this.userRepository.findOne({where:{email:normalizedEmail,deleted_at:IsNull()},select:['id','name','email','password','role']});
  
      if (!user) {
        throw new Error('User Not found');
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid Password');
      }
      let updatePasswordState = false
      if (user.role === 'organization') {
         const [organization] = await this.orgRepository.query(
          `SELECT update_password_state FROM organizations WHERE organization_id = $1 AND deleted_at IS NULL`,
          [user.id]
        );
        
        if (organization) {
          updatePasswordState = organization.update_password_state;
        }
      }
  
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret not configured');
      }
  
      const token = jwt.sign(
        {
          userId: user.id,
          name: user.name,
          role: user.role,
          update_password_state: updatePasswordState
        },
        process.env.JWT_SECRET,
        {expiresIn: '1hr'}
      );
      console.log('the token datas ',user.id, " ",user.name , " ",user.role, " ",updatePasswordState);
      
      console.log('the service of token ',token);
      
      return {token : token};
    } catch(error) {
      console.error('Login Error', error);
      throw error;
    }
  }
  async allJobPosts():Promise<JobPostResponse[]>{
    const posts : any  = await this.jobPostRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['organization'],});
      console.log('the post are',posts);
      
      return posts.map((post:any) => ({
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
        organization_name: post.organization.name,
        status: post.status,
      }));
  }
  //applying for job
  async applyForJob(input: JobApplyInput,context : any): Promise<JobApplyResponse> {
    try {
      const userId = context.user.userId;
        const [existingApplication] = await this.jobAppliedRepository.query(
            `SELECT * FROM jobapplied 
             WHERE jobpost_id = $1 AND user_id = $2 AND deleted_at IS NULL`,
            [input.jobpost_id, userId]
        );

        if (existingApplication) {
            throw new Error('You have already applied for this job');
        }

     
        const [checking] = await this.userDetailsRepository.query(`
            SELECT age, experience, skills, description FROM userdetails WHERE user_id = $1
        `, [userId]);

        
        if (!checking || checking.age === null || checking.experience === null || 
            !checking.skills || !checking.description) {
            throw new Error('Please complete your profile before applying for a job');
        }

        console.log('it is working untill us details ',checking);
        
        const id = uuidv4();
        
        const [result] = await this.jobAppliedRepository.query(
            `INSERT INTO jobapplied (
                id, jobpost_id, user_id, organization_id, status
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [id, input.jobpost_id, userId, input.organization_id, 'applied']
        );
        console.log('the job applied ',result);
        
        return result;

    } catch (error: any) {
        if (error.message === 'You have already applied for this job' || 
            error.message === 'Please complete your profile before applying for a job') {
            throw error;
        }
        throw new Error('Failed to apply for job');
    }
}
  //getting user applie jobs
  async getUserJobApplied(context : any):Promise<JobAppliedByUserResponse[]>{
    const userId = context.user.userId;
    const result = await this.jobAppliedRepository.query(
      `SELECT 
        ja.id, ja.jobpost_id, ja.organization_id, ja.user_id, ja.status,ja.created_at, ja.updated_at,
        u.name, u.email,
        jp.job_title, jp.category, jp.openings, jp.skills,
        org.name AS company
       FROM jobapplied ja
       JOIN users u ON ja.user_id = u.id
       JOIN jobposts jp ON ja.jobpost_id = jp.id
       JOIN users org ON ja.organization_id = org.id
       WHERE ja.user_id = $1 AND ja.deleted_at IS NULL`,
      [userId]
    );
    console.log('the user applied job',result);
    return result;
  }
  async countUserApplications(context : any):Promise<Number>{
    const userId = context.user.userId;
    const result : any = await this.jobAppliedRepository.count({where:{
      user:{id:userId},deleted_at:IsNull()
    }});
    console.log('the result',result);
    return result;
  }
  async user(context : any):Promise<UserDetailsResponse>{
    const userId = context.user.userId;
    const result = await this.userRepository.query(`
      SELECT u.id , u.name ,u.email , u.phone , ud.age , ud.experience , ud.skills , ud.description, ud.resume AS "resumeKey" FROM users u
INNER JOIN userdetails ud ON u.id = ud.user_id
WHERE u.id = $1
      `,[userId]);
      console.log('the user details ',result[0]);
      
    return result[0];
  }
  async updateUser(input:UpdateUserInput):Promise<UserDetailsResponse>{
    
    await this.userRepository.update({id:input.id},{name:input.name,email:input.email,phone:input.phone,updated_at:new Date()})

    await this.userDetailsRepository.update({user:{id:input.id}},{age:Number(input.age),experience:input.experience,skills:input.skills,description:input.description,updated_at:new Date()})

    const result : any = await this.userRepository.findOne({where:{id:input.id},relations:['details']});
    return {
      id: result?.id,
      name : result?.name,
      email:result?.email,
      phone:result?.phone,
      age: result?.details?.age,
      experience: result?.details?.experience,
      skills : result?.details?.skills,
      description:result?.details?.description,
    }
    

  }
  //withdraw application 
  async withdrawApplication(input:WithdrawApplicationInput,context : any):Promise<WithdrawApplicationResponse>{
    const userId = context.user.userId;
    const result = await this.jobAppliedRepository.update({id:input.id,deleted_at:IsNull(),user:{id:userId}},{deleted_at:new Date()});
    
    return {
      id: userId
    };
  }
  async uploadResume(input:UploadResumeInput,context : any):Promise<UploadResumeResponse>{
    const userId = context.user.userId;
    await this.userDetailsRepository.update({user:{id:userId},deleted_at:IsNull()},{resume:input.resumeKey});
    console.log('the resume updated successfully',input.resumeKey);
    
    return {
      id:userId,
      resumeKey:input.resumeKey
    }
  }
  async updateStatus(input: UpdateJobPostStatusInput,): Promise<UpdateJobPostStatusResponse> {
    await this.jobPostRepository.update(input.id, { status: input.status });
    
    const updatedPost = await this.jobPostRepository.findOne({
      where: { id: input.id },
    });
    return {
      id: input.id,
      status: input.status,
    };
  }
  async countUsers():Promise<Number>{
  const result = await this.userRepository.count({where:{role:'user'}});
  
  return result;
  }
  async deleteUser(id: string): Promise<DeleteUserResponse> {
    try {
      const user = await this.userRepository.findOne({where:{id:id},select:['id','name']});
  
      if (!user) {
        throw new Error('User not found or already deleted');
      }
      await this.userRepository.query('BEGIN');
  
      try {
        await this.userRepository.update({id:id},{deleted_at:new Date()});
        await this.userDetailsRepository.update({user:{id:id}},{deleted_at:new Date()});
       
        await this.jobAppliedRepository.update({user:{id:id}},{deleted_at:new Date()});
       
        await this.userRepository.query('COMMIT');
  
        return { id: user.id, name: user.name };
  
      } catch (error) {
        await this.userRepository.query('ROLLBACK');
        throw new Error('Failed to delete user');
      }
  
    } catch (error: any) {
      if (error.message === 'User not found or already deleted') {
        throw error;
      }
      throw new Error('Failed to delete user');
    }
  }
  async users(): Promise<GetAllUser[]> {
    const user = await this.userRepository.find({where:{role:'user'}});
    return user;
  }
  async currentUser(context : any) : Promise<GetCurrentUserResponse>{
    const userId = context.user.userId;
    const userType = context.user.role;
    const userName = context.user.name;
    console.log('the current user',userId," ",userType," ",userName);
    console.log('the context is ',context);
    return {
      userId,userType,userName
    }
  }
  
}
