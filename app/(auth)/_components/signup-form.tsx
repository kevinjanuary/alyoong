"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "There was a problem with your request. Please try again.",
        duration: 2000,
      })
    }

    toast({
      title: "Register successful!",
      description: "You have successfully registered. Please wait...",
      duration: 2000,
    })
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
    })
  }

  return (
    <Form {...form}>
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
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  )
}
