import { db } from "@/lib/prismadb"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

import { OAuthSignIn } from "../_components/oauth-signin"
import { SignInForm } from "../_components/signin-form"

const LoginPage = async () => {
  const users = await db.user.findMany()

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthSignIn />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link
              aria-label="Sign up"
              href="/register"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
