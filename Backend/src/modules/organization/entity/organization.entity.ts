import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { JobPost } from "../../jobs/entity/jobPost.entity";

@Entity({ name: "organizations" })
@ObjectType()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Column()
  @Field()
  website!: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  status?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  location?: string;

  @CreateDateColumn({ name: "created_at" })
  @Field()
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Field()
  updated_at!: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  @Field({ nullable: true })
  deleted_at?: Date;

  @Column({ name: "update_password_state", default: false })
  @Field()
  update_password_state!: boolean;

  
  @OneToOne(() => User)
  @JoinColumn({ name: "organization_id" })
  user?: User;

  @OneToMany(() => JobPost, jobPost => jobPost.organization)
  @Field(() => [JobPost], { nullable: true })
  jobPosts?: JobPost[];
}
