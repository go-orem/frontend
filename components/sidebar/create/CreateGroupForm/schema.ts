import { z } from "zod";

export const CreateGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  avatar: z.string().nullable().optional(),
  category_id: z.string(),
  tags: z.array(z.string()),
  members: z.array(z.string()),
});

export type CreateGroupType = z.infer<typeof CreateGroupSchema>;
