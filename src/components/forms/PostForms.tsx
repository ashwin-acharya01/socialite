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
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";

type PostFormProps = {
    posts?: Models.Document;
    action: "Update" | "Create"
}

const PostForms = ( {posts, action} : PostFormProps ) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingupdate } = useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: posts ? posts?.caption : "",
      file: [],
      location: posts ? posts?.location : "",
      tags: posts ? posts?.tags.join(',') : ''
    },
  });

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if(posts && action === 'Update'){
        const updatedPost = await updatePost({
            ...values,
            postId: posts?.$id,
            imageId: posts?.imageId,
            imageUrl: posts?.imageUrl,
        })

        if(!updatedPost){
            toast({title: 'Please try again.'})
        }

        return navigate(`/posts/${posts.$id}`)
    } 
    
    const newPost = await createPost({
        ...values,
        userId: user.id,
     })

     if(!newPost){
        toast({
            title: "Please try again,"
        })
     }
     else{
        toast({
            title: "New Post Added!"
        })
     }
     navigate('/');
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add a Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="Add Caption here" className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={posts?.image_url}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">{`Add Tags (separated by comma " , ")`}</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
            <Button type="button" className="shad-button_dark_4">Cancel</Button>
            <Button type="submit" disabled={isLoadingCreate || isLoadingupdate} className="shad-button_primary whitespace-nowrap">{action === "Update" ? "Update" : "Submit"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForms;
