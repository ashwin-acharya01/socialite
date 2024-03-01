import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginFormSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useSignInMutation } from "@/lib/react-query/queriesAndMutations";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: CreateUserSession, isPending: isCreatingSession } =
    useSignInMutation();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      // create a session
      const session = await CreateUserSession({
        email: values.email,
        password: values.password,
      });

      // toast on session fail
      if (!session) {
        return toast({
          title: "Error while login. Please try again.",
        });
      }

      // Verify whether the user is logged in
      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        toast({
          title: "Login Successful",
        });
        navigate("/");
      } else {
        return toast({
          title: "Login Failed. Please try again",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center justify-center w-[80%]">
        <h1 className="h1-bold">Socialite</h1>
        <h3 className="h3-bold mt-5">Welcome back !</h3>
        {/* <p className="text-off-white text-center text-['1rem']">Enter your Username and Password and let's resume our journey</p> */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[90%]"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    type="email"
                    placeholder="Enter Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full shad-button_primary">
            {isCreatingSession ? (
              <span className="inline-flex gap-3 items-center">
                <Loader />
                &nbsp;Loading
              </span>
            ) : (
              "Submit"
            )}
          </Button>
          <span className="inline-block w-full text-center mt-8">
            Don't have an account?{" "}
            <a href="/register" className="text-primary-500">
              Sign-up
            </a>
          </span>
        </form>
      </div>
    </Form>
  );
};

export default Login;
