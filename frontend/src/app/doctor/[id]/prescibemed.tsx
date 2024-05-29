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
import { prescribeMeds } from '@/services/data-fetch';
import { toast } from 'sonner';

const formSchema = z.object({
    medication_name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
})


export interface PrescribeMedProps {
    pid: string
    did: string
    aid: string
}

export default function PrescribeMed({ pid, did, aid }: PrescribeMedProps) {
    const [open, setOpen] = React.useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            medication_name: "",
            dosage: "",
            frequency: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        await prescribeMeds(aid, did, pid, values.medication_name, values.dosage, values.frequency)
        setOpen(false);
        toast.success("Medication Prescribed")
        console.log(pid, did, values)
    }
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Prescribe Medicines</Button>
                    {/* Prescribe Medicines */}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Prescribe Medicines</DialogTitle>
                        <DialogDescription>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="medication_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Medicine Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="dosage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dosage</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="frequency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency</FormLabel>
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

