import React from 'react'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"
import { cookies } from 'next/headers'

import { getDoctorDetils, getDoctorAppointments, getAppointmentDetails, docAppointmentStatus } from '@/services/data-fetch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PrescribeMed from './prescibemed'
import PrescribeTest from './prescribetest'
import DoneButton from './donebutton'


export default async function Page({ params }: { params: { id: string, patient_id: string } }) {
  const did = params.id;
  // const tokenn = CookieStore.get('jwt');
  // console.log('TOKEN',tokenn);
  const doc_basicinfo = await getDoctorDetils({ did });
  const doc_appointments = await getDoctorAppointments({ did });
  const appointments = doc_appointments.appointments;
  const ids = doc_appointments.IDs; //all ids
  const slot_timings = doc_appointments.slot_timings;


  function formatDate(dateString: Date | string | number) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  return (
    <div className="flex flex-col">
      <header className="border-b">
        <div className="container px-4 md:px-6 my-4">
          <nav className="flex items-center h-14">
            <Link className="flex items-center justify-center" href="#">
              <HotelIcon className="h-6 w-6" />
              <span className="sr-only">Hospital</span>
            </Link>
            <div className="ml-auto flex items-center gap-4 sm:gap-6">
              <Dialog>
                <DialogTrigger className=" text-xl p-2 font-medium hover:underline underline-offset-4">My Profile</DialogTrigger>
                <DialogContent className=" max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Your Details</DialogTitle>
                    <DialogDescription>
                      <div className='flex flex-row p-2 gap-6'>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Name:</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deapartment :</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.department_name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">License Number:</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.license_number}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Contact No:</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.phone}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Specialization:</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.specialization}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Experience:</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.experience}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Awards:</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.awards}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Publications:</TableCell>
                              <TableCell>{doc_basicinfo.doctor_details?.publications}</TableCell>
                            </TableRow>

                          </TableBody>
                        </Table>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Link className=" text-xl p-2 font-medium hover:underline underline-offset-4" href="/">
                Logout
              </Link>

            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12  lg:py-16 xl:py-20">
          <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome, {doc_basicinfo.doctor_details?.name}</h1>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Driven by Precision, Guided by Compassion: <br></br>Together, we raise healthcare standards with dedication and empathy.</p>
            </div>
          </div>
        </section>
        <section className="w-full py-6  bg-gray-100 dark:bg-gray-800 ">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col  max-w-4xl space-y-4">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Upcoming Appointments</h2>
                </div>
                <div className="flex flex-col items-center w-full">
                  {appointments && appointments.length > 0 ? (
                    appointments.map(async (appointment, index) => {
                      // const appointmentSlotTiming = slot_timings[appointment.slot_no];
                      const pid = appointment.patient_id;
                      const aid = appointment.appointment_id;
                      // const appointment_id = ids.find(id => id.patient_id === pid)?.appointment_id;
                      const details = await getAppointmentDetails({ pid });
                      return (
                        <div key={index} className='flex gap-6 flex-row '>
                          <div className='flex items-center gap-4'>
                            <CalendarIcon className="w-8 h-8 rounded-lg bg-gray-200 p-2 dark:bg-gray-800" />
                            <div className="grid gap-1.5">
                              <h3 className="font-semibold">{appointment.patient_name}</h3>
                              <p className="text-sm ">
                                Reason : {appointment.reason}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(appointment.date_of_appointment)}
                              </p>
                            </div>
                          </div>
                          <div className='flex flex-row gap-6'>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button>Info</Button>
                              </DialogTrigger>
                              <DialogContent className='max-w-7xl'>
                                <DialogHeader>
                                  <DialogTitle>Patient Details</DialogTitle>
                                  <DialogDescription>
                                    <div className='flex flex-row p-2 gap-6'>
                                      <Table>
                                        <TableBody>
                                          <TableRow>
                                            <TableCell className="font-medium">Name:</TableCell>
                                            <TableCell>{details.patient_info?.name}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell className="font-medium">Gender:</TableCell>
                                            <TableCell>{details.patient_info?.gender}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell className="font-medium">Email:</TableCell>
                                            <TableCell>{details.patient_info?.email}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell className="font-medium">Contact</TableCell>
                                            <TableCell>{details.patient_info?.contact}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell className="font-medium">Address:</TableCell>
                                            <TableCell>{details.patient_info?.address}</TableCell>
                                          </TableRow>

                                        </TableBody>
                                      </Table>
                                      <Table>
                                        <TableBody>
                                          <TableRow>
                                            <TableCell className="font-medium">Diagnosis:</TableCell>
                                            <TableCell>{details.medical_history?.diagnosis}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell className="font-medium">Date of Diagnosis:</TableCell>
                                            <TableCell>{formatDate(details.medical_history?.date_of_diagnosis)}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell className="font-medium">Treatment Given:</TableCell>
                                            <TableCell>{details.medical_history?.treatment_given}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell className="font-medium">Family History</TableCell>
                                            <TableCell>{details.medical_history?.family_history}</TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </div>
                                    <div className='mt-4'>
                                      Previous Test Results
                                      <Table>
                                        <TableBody>
                                          {details.patient_taken_tests?.map((test, index) => (
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">Test Name:</TableCell>
                                              <TableCell>{test.test_name}</TableCell>
                                              <TableCell>Result :{test.result}</TableCell>
                                              <TableCell>{formatDate(test.date_taken)}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                      Recommended Tests
                                      {details.doctor_recommended_tests ? (
                                        <Table>
                                          <TableBody>
                                            <TableRow key={0}>
                                              <TableCell className="font-medium">Test Name:</TableCell>
                                              <TableCell>{details.doctor_recommended_tests.test_name}</TableCell>
                                              <TableCell>Recommended By :{details.doctor_recommended_tests.doctor_name}</TableCell>
                                              <TableCell>Status :{details.doctor_recommended_tests.test_result}</TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      ) : (
                                        <p className='text-center'>No Data</p>
                                      )}
                                    </div>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>

                            <PrescribeTest pid={pid} did={did} />

                            <PrescribeMed pid={pid} did={did} aid={aid} />

                            <DoneButton appointment_id={appointment.appointment_id} did={did} pid={pid} />
                            


                          </div>

                        </div>
                      )
                    })
                  ) : (
                    <p className='text-center'>No Appointments</p>
                  )}




                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Medical Records</h2>
                </div>
                <div className="grid gap-2 sm:gap-4">
                  {medical_tests.map((test, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <FileIcon className="w-8 h-8 rounded-lg bg-gray-200 p-2 dark:bg-gray-800" />
                      <div className="grid gap-1.5">
                        <h3 className="font-semibold">{test.test_name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Result : {test.result}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(test.date_taken)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section> */}
        {/* <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
              <div className="container px-4 md:px-6">
                <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Billing Information</h2>
                    </div>
                    <div className="grid gap-2 sm:gap-4">
                      <div className="flex items-center gap-4">
                        <DollarSignIcon className="w-8 h-8 rounded-lg bg-gray-200 p-2 dark:bg-gray-800" />
                        <div className="grid gap-1.5">
                          <h3 className="font-semibold">Consultation Fee</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Amount: $50.00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <DollarSignIcon className="w-8 h-8 rounded-lg bg-gray-200 p-2 dark:bg-gray-800" />
                        <div className="grid gap-1.5">
                          <h3 className="font-semibold">Medication</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Amount: $25.00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <DollarSignIcon className="w-8 h-8 rounded-lg bg-gray-200 p-2 dark:bg-gray-800" />
                        <div className="grid gap-1.5">
                          <h3 className="font-semibold">Lab Test</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Amount: $30.00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
      </main>
      {/* <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Acme Inc. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link className="text-xs hover:underline underline-offset-4" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs hover:underline underline-offset-4" href="#">
                Privacy
              </Link>
            </nav>
          </footer> */}
    </div>
  )
}


function CalendarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}


function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}


function HotelIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
      <path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16" />
      <path d="M8 7h.01" />
      <path d="M16 7h.01" />
      <path d="M12 7h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
      <path d="M8 11h.01" />
      <path d="M10 22v-6.5m4 0V22" />
    </svg>
  )
}
