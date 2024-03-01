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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { ProfilePhotoUploader } from "../shared/FileUploader";
import { ProfileValidation } from "@/lib/validation";
import { Models } from "appwrite";
import {
  useCreatePost,
  useUpdatePost,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";

type PostFormProps = {
  userData?: Models.Document;
};

const PostForms = ({ userData }: PostFormProps) => {

  const { mutateAsync: updateUser, isPending: isLoadingupdate } =
    useUpdateUser();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: userData ? userData?.name : "",
      username: userData ? userData?.username : "",
      isAccountPrivate: userData ? userData?.isAccountPrivate : "",
      bio: userData ? userData?.bio : "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    if (userData) {
      const updatedPost = await updateUser({
        ...values,
        id: userData?.$id,
        imageId: userData?.image_id,
        imageUrl: userData?.image_url,
      });

      if (!updatedPost) {
        toast({ title: "Please try again." });
      }
      else{
        toast({ title: "Profile Updated." });
      }

      return navigate(`/profile/${userData.$id}`);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ProfilePhotoUploader
                  fieldChange={field.onChange}
                  mediaUrl={userData?.image_url}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAccountPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Private Account</FormLabel>
                <FormDescription>
                  Nobody can view your photos until they follow you
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className="bg-primary-500"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add Bio here"
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isLoadingupdate}
            className="shad-button_primary whitespace-nowrap"
          >
            {"Update Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForms;
