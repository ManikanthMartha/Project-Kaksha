"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { docAppointmentStatus } from '@/services/data-fetch';
import { toast as toastFn } from 'react-hot-toast';

export interface DoneProps {
    appointment_id: string
    did: string
    pid: string
}
export default function DoneButton({ appointment_id, did, pid }: DoneProps) {
    return (
        <Button onClick={() => {
            docAppointmentStatus(appointment_id, did, pid).then(() => {
                toastFn.success("done")
            })
        }}>Mark as Done</Button>
    )
}
