import type { SchemaTypeDefinition } from "sanity";
import { storyType } from "./story";
import { pressMentionType } from "./pressMention";
import { reviewType } from "./review";

export const schemaTypes: SchemaTypeDefinition[] = [
  storyType,
  pressMentionType,
  reviewType,
];
