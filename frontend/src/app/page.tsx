"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { loginUser } from "@/services/data-fetch"
import { useRouter } from 'next/navigation';
import { useState } from 'react';


import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toaster, toast } from 'sonner'



const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role : z.string()
})


export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: ""
    },
  })
  async function onSubmit(creds: z.infer<typeof formSchema>) {
    try{
      const data = await loginUser(creds.email, creds.password, creds.role)
      console.log(data);
      
     if(data){
      setIsLoggedIn(true);
      toast.success("Login Successful")
      if (creds.role === 'patient') {
        router.push(`/patient/${encodeURIComponent(data.id)}`);
      } else if (creds.role === 'doctor') {
        router.push(`/doctor/${encodeURIComponent(data.id)}`);
      }
     }
     else{
      alert("Login Failed")
     }
      // setOpen(false);
      // toast.success("Student Added Successfully")
      // revalidateClientPath('/') //! revalidate the whole console
  }
  catch(err){
    console.error("Login Failed: ", err);
      // if(err instanceof Error)
      //     toast.error("Student Creation Failed! " + err.message)
      // else
      //     toast.error("Student Creation Failed! ")
  }
  }
  return (
    <div className=" h-screen flex items-center justify-center">
            <Toaster />

      <Card className="w-1/3">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Hospital Management System</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
              </FormDescription> */}
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}/>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selct your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}/>
        {/* Don&apos;t have an account?  <Link href="/signup">Signup here</Link> */}
        <Button className="w-full"type="submit">Login</Button>
      </form>
    </Form>
      </CardContent>
    </Card>
    
    </div>
  )
}

