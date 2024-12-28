"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { signUp } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { UserRegistrationRequest, UserSignInRequest } from "@/types";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const isSignUp = (event.nativeEvent as any).submitter.name === "sign-up";

    try {
      if (isSignUp) {
        const registrationData: UserRegistrationRequest = {
          userName: formData.get("userName") as string,
          password: formData.get("password") as string,
          mobile: formData.get("mobile") as string,
          emailId: formData.get("email") as string,
        };

        await signUp(registrationData);
        toast({
          title: "Account created successfully",
          description: "Please sign in with your credentials",
        });

        // Switch to sign in tab after successful registration
        const tabsList = document.querySelector(
          '[role="tablist"]'
        ) as HTMLElement;
        const signinTab = tabsList?.querySelector(
          '[value="signin"]'
        ) as HTMLElement;
        signinTab?.click();
      } else {
        const signInData: UserSignInRequest = {
          userName: formData.get("userName") as string,
          password: formData.get("password") as string,
        };

        await login(signInData);
        toast({ title: "Signed in successfully" });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: isSignUp
          ? "Failed to create account. Please try again."
          : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    googleLogin();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In or Sign Up</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-username">Username</Label>
                <Input id="signin-username" name="userName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input id="signup-username" name="userName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-mobile">Mobile</Label>
                <Input
                  id="signup-mobile"
                  name="mobile"
                  type="tel"
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
              <Button
                type="submit"
                name="sign-up"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
