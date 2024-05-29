"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const formSchema = z.object({
    personal_info: z.object({
        name: z.string(),
        gender: z.string(),
        age: z.string(),
        contact: z.string(),
        address: z.string(),
        email: z.string(),
        password: z.string(),
    }),
    medical_history: z.object({
        diagnosis: z.string(),
        date_of_diagnosis: z.string(),
        treatment_given: z.string(),
        family_history: z.string(),
    }),
    tests_taken: z.object({
        test_name: z.string(),
        result: z.string(),
        date_taken: z.string(),
    })
  })

export default function Page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            personal_info: {
                name: '',
                gender: '',
                age: '',
                contact: '',
                address: '',
                email: '',
                password: ''
            },
            medical_history: {
                diagnosis: '',
                date_of_diagnosis: '',
                treatment_given: '',
                family_history: ''
            },
            tests_taken: {
                test_name: '',
                result: '',
                date_taken: ''
            }
        },
      })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        
        console.log(values)
      }
  return (
    <div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="personal_info.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal_info.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Input placeholder="gender" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal_info.age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input placeholder="Enter your age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal_info.contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Contact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal_info.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal_info.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal_info.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medical_history.diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Diagnosis</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Previous Diagnosis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medical_history.date_of_diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Diagnosis</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Date of Diagnosis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medical_history.treatment_given"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment given</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Treatment given" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medical_history.family_history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family History</FormLabel>
              <FormControl>
                <Input placeholder="Enter your family history" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tests_taken.test_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test name</FormLabel>
              <FormControl>
                <Input placeholder="Enter test name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tests_taken.result"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Result</FormLabel>
              <FormControl>
                <Input placeholder="Enter the result" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tests_taken.date_taken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date taken</FormLabel>
              <FormControl>
                <Input placeholder="Enter your date taken" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}
