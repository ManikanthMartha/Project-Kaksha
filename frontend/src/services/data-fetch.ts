async function loginUser(email: string, password: string, role: string){
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
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



async function getPatientDetils({ pid }: { pid: string }) {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/patientdata/${pid}`,{
            method: 'GET',
        
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json() as Promise<{
            patient_info: {
                patient_id: string,
                name: string,
                gender: string,
                contact: string,
                address: string,
                email: string,
            },
            medical_history: {
                patient_id: string,
                diagnosis: string,
                date_of_diagnosis: string,
                treatment_given: string,
                family_history: string
            },
            patient_taken_tests:{
                test_name: string,
                result: string
                date_taken: string
            }[],
        }>;
}

async function getPatientAppointments({ pid }: { pid: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/dashboard/${pid}`,{
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        appointments: {
            doctor_name: string,
            date_of_appointment: string,
            slot_no: string,
            appointment_id: string,
        }[],
        doctor_recommended_prescription: {
            appointment_id: string,
            medication_name: string,
            dosage: string,
            frequency: string,
            doctor_name: string,
        }[],
        doctor_recommended_tests:{
            test_name: string,
            doctor_name: string
            test_result: string
        },
    }>;
}

async function getPatientAppointmentsOld({ pid }: { pid: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/old/dashboard/${pid}`,{
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        appointments: {
            doctor_name: string,
            date_of_appointment: string,
            slot_no: string,
            appointment_id: string,
        }[],
        doctor_recommended_prescription: {
            appointment_id: string,
            medication_name: string,
            dosage: string,
            frequency: string,
            doctor_name: string,
        }[],
        doctor_recommended_tests:{
            test_name: string,
            doctor_name: string
            test_result: string
        },
    }>;
}

async function getPrescription({ aid }: { aid: number }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/prescription/${aid}`,{
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        doc_prescription: {
            medication_name: string,
            dosage: string,
            frequency: string,
            doctor_name: string,
        }[],
    }>;
}

async function getAvailableDoctors({ department, date }: { department: string, date: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patent/availabledoctors`,{
        method: 'GET',
        body: JSON.stringify({ department, date }),
            headers: {
                'Content-Type': 'application/json',
            },
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        available_doctors: {
            doctor_id: string,
            doctor_name: string,
        }[]
    }>; 
}

async function getAvailableSlots({ docID, date }: { docID: string, date: Date }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/bookappointments`,{
        method: 'GET',
        body: JSON.stringify({ docID, date }),
            headers: {
                'Content-Type': 'application/json',
            },
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        available_slots: number[];
        slot_timings: { [key: string]: string }
    }>
}

async function bookAppointment({ id, slot_no, date, reason_of_appointment, docID }: { id: string, slot_no: string, date: string, reason_of_appointment: string, docID: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/bookappointments/${id}`,{
        method: 'POST',
        body: JSON.stringify({ id, slot_no, date, reason_of_appointment, docID }),
            headers: {
                'Content-Type': 'application/json',
            },
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{}>
}

// doctor part
async function getDoctorDetils({ did }: { did: string }) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/${did}`,{
        method: 'GET',
    
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        doctor_details: {
            doctor_id: string,
            name: string,
            department_name: string,
            email: string,
            license_number: string,
            age: string,
            phone: string,
            specialization: string,
            experience: string,
            awards: string,
            publications: string,
        },
    }>;
}

async function getDoctorAppointments({ did }: { did: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/dashboard/${did}`,{
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }

    return res.json() as Promise<{
        appointments: {
            appointment_id: string,
            patient_id: string,
            patient_name: string,
            date_of_appointment: string,
            slot_no: string,
            reason: string,
        }[],
        IDs: {
            appointment_id: string,
            doctor_id: string,
            patient_id: string,
        }[],
        slot_timings:{
            1: string,
            2: string,
            3: string,
            4: string,
            5: string,
            6: string,
            7: string,
            8: string,
            9: string,
            10: string,
        },
    }>;
}

async function getAppointmentDetails({ pid }: { pid: string }){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/appointment/details/${pid}`,{
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    return res.json() as Promise<{
        patient_info: {
            patient_id: string,
            name: string,
            gender: string,
            contact: string,
            address: string,
            email: string,
        },
        medical_history: {
            patient_id: string,
            diagnosis: string,
            date_of_diagnosis: string,
            treatment_given: string,
            family_history: string
        },
        patient_taken_tests:{
            test_name: string,
            result: string
            date_taken: string
        }[],
        doctor_recommended_tests:{
            test_name: string,
            doctor_name: string
            test_result: string
        }
    }>;
}

async function prescribeMeds(appointment_id:string, doctor_id: string, patient_id: string, medication_name:string, dosage: string, frequency: string ){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/appointment/prescribe/${patient_id}/${doctor_id}`, {
             method: 'POST',
             body: JSON.stringify({ appointment_id, doctor_id, patient_id, medication_name, dosage, frequency }),
             headers: {
                 'Content-Type': 'application/json',
             },
         });
 
         if (!res.ok) {
             throw new Error(res.statusText);
         }
 
         return res.json() as Promise<{ 
         }>;
 }

 async function prescribeTest(doctor_id: string, patient_id: string, test_name:string ){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/appointment/prescribetests`, {
             method: 'POST',
             body: JSON.stringify({ doctor_id, patient_id, test_name }),
             headers: {
                 'Content-Type': 'application/json',
             },
         });
 
         if (!res.ok) {
             throw new Error(res.statusText);
         }
 
         return res.json() as Promise<{ 
         }>;
 }

 async function docAppointmentStatus(appointment_id: string ,doctor_id: string ,patient_id: string ){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/appointment/status`, {
             method: 'POST',
             body: JSON.stringify({ appointment_id, doctor_id, patient_id }),
             headers: {
                 'Content-Type': 'application/json',
             },
         });
         if (!res.ok) {
            throw new Error(res.statusText);
        }

        return res.json() as Promise<{ 
        }>;
 }

export { loginUser, getPatientDetils, getPatientAppointments, getPatientAppointmentsOld, getPrescription, getAvailableDoctors, getAvailableSlots, bookAppointment, getDoctorDetils, getDoctorAppointments, getAppointmentDetails, prescribeMeds, prescribeTest, docAppointmentStatus };
