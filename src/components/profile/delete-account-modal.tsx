import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  password: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

// Mock data for the form
const defaultValues: Partial<FormValues> = {
  password: "",
};
const DeleteAccountModal = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="warning"
          className="flex items-center gap-2 font-medium"
        >
          <Trash2 />
          Xoá tài khoản
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <div>XÁC NHẬN XOÁ TÀI KHOẢN</div>
        <div>
          Bạn có chắc xoá tài khoản? Vui lòng nhập mật khẩu để xác nhận xoá tài
          khoản
        </div>
        <Form {...form}>
          <form id="account-form" className="mt-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    Mật khẩu
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
