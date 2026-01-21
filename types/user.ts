import { Role } from "@/lib/definitions";

export type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
};
