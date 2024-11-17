import { Roles } from "./Roles";

export interface User{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: Roles;
}