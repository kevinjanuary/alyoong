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
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { TRegisterSchema, registerSchema } from "@/lib/types"
import { signIn } from "next-auth/react"
import { SubmitButton } from "@/components/submit-button"
import { InputPassword } from "@/components/InputPassword"

export const SignUpForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl: string = searchParams.get("redirect") || "/"
  const { toast } = useToast()
  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: TRegisterSchema) {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      const errorData = await res.json()
      if (errorData.field === "email") {
        form.setError("email", {
          type: "manual",
          message: errorData.message,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
          duration: 2000,
        })
      }
      return
    }

    toast({
      title: "Register successful!",
      description: "You have successfully registered. Please wait...",
      duration: 2000,
    })

    await new Promise((resolve) => {
      signIn("credentials", {
        ...values,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          router.push(redirectUrl)
          router.refresh()
        } else {
          toast({
            title: "Something went wrong...",
            description: "Please try again.",
            duration: 2000,
            variant: "destructive",
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
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
                  <InputPassword {...field} />
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
