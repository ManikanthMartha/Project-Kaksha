"use client"
import React from 'react'
import { getAvailableDoctors, getAvailableSlots, bookAppointment } from '@/services/data-fetch'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from 'sonner'

const formSchema = z.object({
    patID: z.string(),
    slot_no: z.string(),
    date: z.date(),
    reason_of_appointment: z.string(),
    docID: z.string(),
})


export default function AppointmentBook({pid}: {pid: string}) {
    const [date, setDate] = React.useState<Date>()
    const [open, setOpen] = React.useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patID: "",
            slot_no: "",
            date: new Date(),
            reason_of_appointment: "",
            docID: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await bookAppointment({
            id: pid,
            slot_no: values.slot_no,
            date: values.date.toISOString(), // Assuming date is a Date object, you may need to adjust this
            reason_of_appointment: values.reason_of_appointment,
            docID: values.docID
        })
        setOpen(false);
        toast.success("Appointment Booked")
        console.log(values)
    }
    return (
        <div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>Book Appointment</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Appointment Booking</DialogTitle>
                        <DialogDescription>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="slot_no"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slot Time</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select the department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1">9:00 AM - 10:00 AM</SelectItem>
                                                        <SelectItem value="2">10:00 AM - 11:00 AM</SelectItem>
                                                        <SelectItem value="3">11:00 AM - 12:00 PM</SelectItem>
                                                        <SelectItem value="4">12:00 PM - 1:00 PM</SelectItem>
                                                        <SelectItem value="5">1:00 PM - 2:00 PM</SelectItem>
                                                        <SelectItem value="6">3:00 PM - 4:00 PM</SelectItem>
                                                        <SelectItem value="7">4:00 PM - 5:00 PM</SelectItem>
                                                        <SelectItem value="8">5:00 PM - 6:00 PM</SelectItem>
                                                        <SelectItem value="9">6:00 PM - 7:00 PM</SelectItem>
                                                        <SelectItem value="10">7:00 PM - 8:00 PM</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Date of Appointment</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="reason_of_appointment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reason of Appointment</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

<FormField
          control={form.control}
          name="docID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor for appointment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DOC001">Dr. John Smith - Cardiology</SelectItem>
                  <SelectItem value="DOC002">Dr. Emily Johnson - Pediatrics</SelectItem>
                  <SelectItem value="DOC003">Dr. Michael Brown - Orthopedics</SelectItem>
                  <SelectItem value="DOC004">Dr. Sarah Wilson - Neurology</SelectItem>
                  <SelectItem value="DOC005">Dr. Robert Davis - Dermatology</SelectItem>
                  <SelectItem value="DOC006">Dr. Laura Martinez - Oncology</SelectItem>
                  <SelectItem value="DOC007">Dr. Christopher Lee - Gastroenterology</SelectItem>
                  <SelectItem value="DOC008">Dr. Jennifer Garcia - Psychiatry</SelectItem>
                  <SelectItem value="DOC009">Dr. Daniel Clark - Urology</SelectItem>
                  <SelectItem value="DOC010">Dr. Amanda White - Endocrinology</SelectItem>
                  <SelectItem value="DOC011">Dr. James Johnson - Cardiology</SelectItem>
                  <SelectItem value="DOC012">Dr. Samantha Lee - Cardiology</SelectItem>
                  <SelectItem value="DOC013">Dr. William Rodriguez - Cardiology</SelectItem>
                  <SelectItem value="DOC014">Dr. Sophia Martinez - Pediatrics</SelectItem>
                  <SelectItem value="DOC015">Dr. Ethan Wilson - Pediatrics</SelectItem>
                  <SelectItem value="DOC016">Dr. Olivia Garcia - Pediatrics</SelectItem>
                  <SelectItem value="DOC017">Dr. Benjamin Clark - Dermatology</SelectItem>
                  <SelectItem value="DOC018">Dr. Emma Davis - Dermatology</SelectItem>
                  <SelectItem value="DOC019">Dr. Noah Brown - Dermatology</SelectItem>
                  <SelectItem value="DOC020">Dr. Ava White - Orthopedics</SelectItem>
                  <SelectItem value="DOC021">Dr. Jacob Smith - Orthopedics</SelectItem>
                  <SelectItem value="DOC022">Dr. Mia Johnson - Orthopedics</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />



                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>




        </div>
    )
}