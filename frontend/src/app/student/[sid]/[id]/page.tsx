import Link from 'next/link';
import React from 'react';

import { getCourseModules } from '@/services/data-fetch';
import { DialogHeader } from '@/components/ui/dialog';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PdfViewer from '@/components/PdfViewer';


export default async function Page({ params }: { params: { id: string } }) {
    const courseId = params.id;
    const modules = await getCourseModules({ cid: courseId });

    return (
        <div className='px-10'>
            <div className='flex flex-row justify-between'>
                <div className='text-lg'>
                    {/* {courseDetails.name} <br /> */}
                    ID : {courseId}
                </div>
                <div className=' mx-4'>
                    <Link href='../courses'>back</Link>
                </div>

            </div>

            <div className='flex flex-col'>
                {modules?.map((module) => (
                    <div className='flex flex-row justify-between' key={module.module_id}>
                        <div className='text-lg'>{module.module_name}</div>
                        <div className=' mx-4'>
                            {/* <a href={module.pdfurl} target="_blank">View</a>
                              */}

                            <Dialog>
                                <DialogTrigger>Open</DialogTrigger>
                                <DialogContent>
                                    <PdfViewer url={module.pdfurl} />
                                </DialogContent>
                            </Dialog>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}