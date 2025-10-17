/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { OctagonAlertIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import{FaGithub, FaGoogle} from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";


const formSchema = z.object({
    email: z.string().min(2, {message: "Email is required"}).email({message: "Not a valid email"}),
    password: z.string().min(1, {message: "Password is Required"}),
});

export const SignInView = () => {
    const router = useRouter();   
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);
        try {
            const res = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL:"/"
            });
            if (res?.error) {
                setError(res.error.message || "An error occurred");
                return;
            }
            // on success navigate (adjust target as needed)
            router.push("/");
        } catch (err: any) {
            setError(err?.message || "An unexpected error occurred");
        } finally {
            setPending(false);
        }
    };
    const onSocial = async (provider: "google" | "github") => {
            setError(null);
            setPending(true);
            try {
                const res = await authClient.signIn.social({
                    provider: provider,
                    callbackURL:"/"
    
                });
                if (res?.error) {
                    setError(res.error.message || "An error occurred");
                    return;
                }
                // on success navigate (adjust target as needed)
                
            } catch (err: any) {
                setError(err?.message || "An unexpected error occurred");
            } finally {
                setPending(false);
            }
        };
    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 ">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome Back
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>    
                                                <FormControl>
                                                    <Input type="email" placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>    
                                                <FormControl>
                                                    <Input type="password" placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                  <Alert className="bg-destructive/10 border-none">
                                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                    <AlertTitle className="">{error}</AlertTitle>
                                  </Alert>
                                )}
                                <Button type="submit" className="w-full " disabled={pending}>
                                    {pending ? "Signing in..." : "Sign In"}
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:insert-0 after:top-1/2 after:z-0 after:flex after:item-center after:border-t">
                                 <span className="bg-card text-muted-foreground relative z-10 px-2 "> 
                                    or continue with
                                 </span>
                                </div>
                                <div className="grid  grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => onSocial("google")}
                                        disabled={pending}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <FaGoogle/>
                                    </Button>
                                    <Button
                                        onClick={() => onSocial("github")}
                                        disabled={pending}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <FaGithub/>
                                    </Button>
                                </div>
                                <div className="text-center text-sm text-muted-foreground">
                                    Don&apos;t have an account? <Link href="/sign-up" className="underline underline-offset-4">Sign Up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    
                    <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img
                            src="/logo.svg"
                            alt="Meet.AI Logo"
                            className="h-[92px] w-[92px]"
                        />
                        <p className="text-2xl font-semibold text-white"> 
                            Meet AI
                        </p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.

            </div>
        </div>
        
    );
}