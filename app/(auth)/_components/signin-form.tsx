"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { TLoginSchema, loginSchema } from "@/lib/types"
import { SubmitButton } from "@/components/submit-button"

export const SignInForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl: string = searchParams.get("redirect") || "/"
  const { toast } = useToast()
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: TLoginSchema) {
    await new Promise((resolve) => {
      signIn("credentials", {
        ...values,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          toast({
            title: "Logged In!",
            description: "You are now logged in!",
            duration: 2000,
          })
          router.push(redirectUrl)
          router.refresh()
        } else {
          form.setError("password", {
            type: "manual",
            message: "Invalid email or password.",
          })
          form.setError("email", {
            type: "manual",
            message: "Invalid email or password.",
          })
        }
        resolve(true)
      })
    })
  }

  return (
    <Form {...form}>
      <fieldset disabled={isSubmitting}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton submit={isSubmitting} className="w-full" />
        </form>
      </fieldset>
    </Form>
  )
}
