"use client"
import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { prescribeTest } from '@/services/data-fetch';
import { toast } from 'sonner';

const formSchema = z.object({
    test_name: z.string(),
})


export interface PrescribeTestProps {
    pid: string
    did: string
}

export default function PrescribeTest({ pid, did }: PrescribeTestProps) {
    const [open, setOpen] = React.useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            test_name: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        await prescribeTest(did, pid, values.test_name )
        setOpen(false);
        toast.success("Test Prescribed")
        // console.log(pid, did, values)
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Prescribe Test</Button>
                    {/* Prescribe Test */}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Prescribe Test</DialogTitle>
                        <DialogDescription>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="test_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Test Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Prescribe</Button>
                                </form>
                            </Form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

