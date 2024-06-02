async function loginUser(email: string, password: string,){
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return res.json() as Promise<{ 
            id: string
        }>;
}



async function getStudentDetils({ sid }: { sid: string }) {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/studentdata/${sid}`,{
            method: 'GET',
        
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json() as Promise<{
            student_info: {
                student_id: string,
                first_name: string,
                last_name: string,
                email: string,
            }
            enrolled_courses: {
                course_id: string,
                course_name: string,
                description: string,
            }[],
        }>;
}
async function getCourseModules({ cid }: { cid: string }) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/modules/${cid}`,{
        method: 'GET',
    
    });    
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
            module_id: string,
            module_name: string,
            description: string,
            pdfurl: string,
    }[]>;
}

export { loginUser, getStudentDetils, getCourseModules };
