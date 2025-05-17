import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "userdetails" })
@ObjectType()
export class UserDetails {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  age?: number;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  experience?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  skills?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  resume?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  description?: string;

  @CreateDateColumn({ name: "created_at" })
  @Field()
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Field()
  updated_at!: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  @Field({ nullable: true })
  deleted_at?: Date;

  @OneToOne(() => User, user => user.details)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
