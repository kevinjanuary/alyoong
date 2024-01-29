"use client"

import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DiscussionSchema, discussionSchema } from "@/lib/types"
import { SubmitButton } from "@/components/submit-button"
import { useState } from "react"
import { addDiscussion } from "@/actions/discussion"

const DiscussionForm = ({
  productId,
  currentUserId,
}: {
  productId: string
  currentUserId: string
}) => {
  const [submit, setSubmit] = useState(false)
  const form = useForm<DiscussionSchema>({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = async (data: DiscussionSchema) => {
    setSubmit(true)
    await addDiscussion({ ...data, productId, currentUserId })
    setSubmit(false)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full space-y-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Tulis pertanyaanmu..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton submit={submit} text="Submit" />
      </form>
    </Form>
  )
}

export default DiscussionForm
