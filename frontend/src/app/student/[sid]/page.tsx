import React from 'react'
import Link from "next/link"
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { JSX, SVGProps } from "react"
import { cookies } from 'next/headers'
import Image from 'next/image'

// import { getPatientAppointments, getStudentDetils, getPrescription, getPatientAppointmentsOld } from '@/services/data-fetch'
import { getStudentDetils } from '@/services/data-fetch'
import { fetchCourseImage } from '@/services/unsplash';
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

const HandDetection = dynamic(() => import('@/components/HandDetection'), { ssr: false });


export default async function Page({ params }: { params: { sid: string } }) {
  const sid = params.sid;

  const student_data = await getStudentDetils({ sid });
  const courses = student_data.enrolled_courses;

  const courseImages = await Promise.all(
    courses.map(async (course) => {
      const imageUrl = await fetchCourseImage(course.course_name);
      return { ...course, imageUrl };
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between h-16 px-6 bg-slate-800 text-white shadow">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <BookIcon className="h-6 w-6" />
          <span>LMS</span>
        </Link>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger className=" text-xl p-2 font-medium hover:underline underline-offset-4">Sign Language Translation</DialogTrigger>
            <DialogContent className=" max-w-4xl h-[650px] content-around">
              <DialogHeader>
                <DialogTitle>Sign Language Translation</DialogTitle>
                  <HandDetection />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        <Dialog>
            <DialogTrigger className=" text-xl p-2 font-medium hover:underline underline-offset-4">My Profile</DialogTrigger>
            <DialogContent className=" max-w-xl h-[300px]  content-center">
              <DialogHeader>
                <DialogTitle>Your Details</DialogTitle>
                <DialogDescription>
                  <div className='flex flex-row p-2 gap-6'>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Name:</TableCell>
                          <TableCell>{student_data.student_info?.first_name} {student_data.student_info?.last_name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Email:</TableCell>
                          <TableCell>{student_data.student_info?.email}</TableCell>
                        </TableRow>

                        <p className=' font-bold text-xl'>Enrolled Courses</p>
                        <TableRow>
                          {/* <TableCell className="font-medium">Enrolled Courses:</TableCell> */}
                          <TableCell>
                            <ul >
                              {courses.map((course) => (
                                <li key={course.course_name}>
                                  {course.course_name}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>

                      </TableBody>
                    </Table>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Link href="#" className="hover:underline" prefetch={false}>
            Log Out
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-8">
      <section className="w-full py-12  lg:py-16 xl:py-20">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome, {student_data.student_info.first_name}</h1>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Empowering your learning journey with accessibility in mind. Access your courses, resources, and support services.

          </p>
        </div>
      </div>
    </section>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Courses</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courseImages?.map((course) => (
              <Link
              key={course.course_id}
              href={`/student/${encodeURIComponent(sid)}/${encodeURIComponent(course.course_id)}`}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
                prefetch={false}
              >
                <Image width={300} height={200} src={course.imageUrl} alt="Course Image" className="w-full h-48 object-cover" />                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{course.course_name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
    </div>
    
  )
}

function BookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}
