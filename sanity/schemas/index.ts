import type { SchemaTypeDefinition } from "sanity";
import { storyType } from "./story";
import { pressMentionType } from "./pressMention";

export const schemaTypes: SchemaTypeDefinition[] = [storyType, pressMentionType];
