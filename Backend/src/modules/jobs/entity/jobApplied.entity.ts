import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { JobPost } from "./jobPost.entity";

@Entity({ name: "jobapplied" })
@ObjectType()
export class JobApplied {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  status?: string;

  @CreateDateColumn({ name: "created_at" })
  @Field()
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Field()
  updated_at!: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  @Field({ nullable: true })
  deleted_at?: Date;

  @ManyToOne(() => JobPost, jobPost => jobPost.applications)
  @JoinColumn({ name: "jobpost_id" })
  @Field(() => JobPost)
  jobPost!: JobPost;

  @ManyToOne(() => User, user => user.jobApplications)
  @JoinColumn({ name: "user_id" })





  
  @Field(() => User)
  user!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "organization_id" })
  @Field(() => User)
  organization!: User;
}
