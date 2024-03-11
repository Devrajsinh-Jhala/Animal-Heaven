import { blockContent } from "./schemaTypes/blockContent";
import { category } from "./schemaTypes/category";
import { post } from "./schemaTypes/post";
import { author } from "./schemaTypes/author";
import { course } from "./schemaTypes/course";

export const schema = {
  types: [post, author, category, blockContent, course],
};
