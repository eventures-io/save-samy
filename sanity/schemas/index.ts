import type { SchemaTypeDefinition } from "sanity";
import { storyType } from "./story";
import { pressMentionType } from "./pressMention";
import { reviewType } from "./review";
import { petitionType } from "./petition";

export const schemaTypes: SchemaTypeDefinition[] = [
  storyType,
  pressMentionType,
  reviewType,
  petitionType,
];
