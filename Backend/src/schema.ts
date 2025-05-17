import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/user/user.resolver";
import { OrganizationResolver } from "./modules/organization/organization.resolver";
// import { AdminResolver } from "./modules/admin/admin.resolver";
// import { S3Resolver } from "./modules/s3/s3.resolver";

console.log('the user create schema',UserResolver);

export const createSchema = () =>
  buildSchema({
    resolvers:[UserResolver, OrganizationResolver],
    validate: false,
  });
  