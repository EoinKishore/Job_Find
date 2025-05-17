import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { JobApplied } from "./jobApplied.entity";

@Entity({ name: "jobposts" })
@ObjectType()
export class JobPost {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Column()
  @Field()
  job_title!: string;

  @Column()
  @Field()
  category!: string;

  @Column({ length: 10 })
  @Field()
  openings!: string;

  @Column({ length: 100 })
  @Field()
  experience!: string;

  @Column({ type: "text" })
  @Field()
  description!: string;

  @Column({ length: 100 })
  @Field()
  package!: string;

  @Column()
  @Field()
  language!: string;

  @Column({ type: "text" })
  @Field()
  skills!: string;

  @Column()
  @Field({nullable:true})
  status?:string;

  @CreateDateColumn({ name: "created_at" })
  @Field()
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Field()
  updated_at!: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  @Field({ nullable: true })
  deleted_at?: Date;

  
  @ManyToOne(() => User, user => user.jobPosts)
  @JoinColumn({ name: "organization_id" })
  @Field(() => User)
  organization!: User;

  @OneToMany(() => JobApplied, application => application.jobPost)
  @Field(() => [JobApplied], { nullable: true })
  applications?: JobApplied[];
}
