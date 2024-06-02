import Link from 'next/link';
import React from 'react';

import { getCourse, getCourseModules } from '@/services/data-fetch';
import { DialogHeader } from '@/components/ui/dialog';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PdfViewer from '@/components/PdfViewer';
import { Card, CardContent } from '@/components/ui/card';


export default async function Page({ params }: { params: { id: string } }) {
    const courseId = params.id;
    const modules = await getCourseModules({ cid: courseId });
    const cname = await getCourse({ cid: courseId });

    return (
        <div className='px-10 bg-gray-100 dark:bg-gray-800'>
            <div className="w-full max-w-6xl mx-auto py-8 px-4 md:px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">{cname?.courseName}</h1>
                </header>
                <div className=' text-2xl text-gray-600'>PDF Resources</div>
                <br></br>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {modules?.map((module) => (
                        <div className='flex flex-row justify-between' key={module.module_id}>
                            <Dialog>
                                <DialogTrigger>
                                    <Card>
                                        <CardContent className="flex flex-col gap-4">
                                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
                                                PDF
                                            </div>
                                            <h3 className="text-lg font-semibold">{module.module_name}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                {module.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent>
                                    <PdfViewer url={module.pdfurl} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>
                <br></br>
                <br></br>
                <br></br>
                <div className=' text-2xl text-gray-600'>Video Resources</div>
                <br></br>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {modules?.map((module) => (
                        <div className='flex flex-row justify-between' key={module.module_id}>
                            <Dialog>
                                <DialogTrigger>
                                    <Card>
                                        <CardContent className="flex flex-col gap-4">
                                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Video
                                            </div>
                                            <h3 className="text-lg font-semibold">{module.module_name}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                {module.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent>
                                    <PdfViewer url={module.pdfurl} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}