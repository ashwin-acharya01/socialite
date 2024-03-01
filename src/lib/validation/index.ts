import { z } from "zod";

export const LoginFormSchema = z.object({
    email: z.string().regex(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), {
        message: "Invalid Email Address"
    }),
    password: z.string().min(8, {
        message: "Password should be at least 8 characters"
    }).max(20, {
        message: "Password cannot be longer than 20 characters"
    })
})

export const SignupFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long"
    }),
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().regex(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), {
        message: "Invalid Email Address"
    }),
    password: z.string().min(8, {
        message: "Password should be at least 8 characters"
    }).max(20, {
        message: "Password cannot be longer than 20 characters"
    })
})

export const PostValidation = z.object({
    caption: z.string().min(5, {
        message: "Caption too short. Atleast 5 charcters expected"
    }).max(2200, {
        message: "Caption too long. Shouldn't exceed 2200 characters"
    }),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
})

export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string(),
    username: z.string(),
    isAccountPrivate: z.boolean(),
    bio: z.string().max(100),
})