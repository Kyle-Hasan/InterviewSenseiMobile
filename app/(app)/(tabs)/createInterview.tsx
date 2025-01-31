import InterviewForm from '@/components/InterviewForm'
import { resume } from '@/types/resume'
import React from 'react'

export default function createInterview() {

    const initialData = {
        resume:null,
        numberOfBehavioral:0,
        numberOfTechnical:0,
        jobDescription:"",
        name: "",
        secondsPerAnswer:120,
        additionalDescription:"",
        resumeUrl: ""
      }
      const allResumes: resume[] | undefined = []
  

      return ( <InterviewForm allResumes={allResumes} initialResumeUrl={""} initialResumeName={""}  initialData={initialData} disabled={false}></InterviewForm>
      )
}
