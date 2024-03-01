import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupFormSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";
import { useCreateUserAccountMutation, useSignInMutation } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading : isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccountMutation();
  const { mutateAsync: signInUser, isPending: isSigningIn } = useSignInMutation();

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email:"",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    // create a user account and add the user data to DB
    const newUser = await createUserAccount(values);

    if(!newUser){
      toast({
        title: "SignUp Failed. Please try again.",
      })
    }

    // if user account creation was successful, create a new session
    console.log(values);
    const session = await signInUser({
      email: values.email,
      password: values.password,
    });

    if(!session){
      return toast({ title: "SignIn Failed. Please try again."});
    }

    // check whether the user has logged in sucessfully. Check Auth user is fetched from the global context
    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn){
      form.reset();
      navigate('/');
    }
    else{
      return toast({ title: "Something went wrong. Please try again"});
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center justify-center w-[70%]">
        <h1 className="h1-bold">Socialite</h1>
        <h3 className="h3-bold mt-2">Create a new Account</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="shad-input" placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input className="shad-input" placeholder="Enter Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="shad-input" placeholder="Enter Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /><FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input className="shad-input" placeholder="Enter Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit" className="w-full shad-button_primary">{isCreatingAccount ? (<span className="inline-flex gap-3 items-center"><Loader />&nbsp;Loading</span>) :"Submit"}</Button>
          <span className="inline-block w-full text-center mt-8">
            Already have an account?{" "}
            <a href="/login" className="text-primary-500">
              Login
            </a>
          </span>
        </form>
      </div>
    </Form>
  );
};

export default Signup;
