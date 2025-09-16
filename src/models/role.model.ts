import { Schema, model, Document } from "mongoose";

export interface IRole extends Document {
  roleName: string;
  accessModules: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    roleName: { type: String, required: true, unique: true, trim: true },
    accessModules: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Role = model<IRole>("Role", RoleSchema);
