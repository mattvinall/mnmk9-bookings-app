import { Vaccination } from '@prisma/client'
import Link from 'next/link';
import React from 'react'
import useUploadFileToS3 from './../../../hooks/useUploadFileToS3';


const VaccinationRecordCard = (record: Vaccination, handleDeleteVaccinationRecord: (id: string) => void) => {
    return (
        <div key={record.id} className='my-6'>
            <div className="flex flex-col rounded-lg shadow-lg bg-white max-w-full w-[90%] md:w-[24rem]">
                <div className="p-6 mt-6">
                    <div className="flex justify-betweem items-center border-slate-600 border-b-2 pb-2">
                        <h2 className="text-gray-900 text-3xl font-medium mb-2 w-3/4">{record.name}</h2>
                    </div>
                    <div className="my-4 border-slate-500 border-b-2">
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium text-lg">Valid To - {record.validTo.toLocaleDateString("en")}</p>
                        </div>
                    </div>
                    {record.fileName && (
                        <div className="my-4 border-slate-500 border-b-2">
                            <div className="mb-4">
                                <p className="text-gray-600 font-medium text-lg"><a href={record?.fileName}>View Vaccination Record</a></p>
                            </div>
                        </div>
                    )}
                    <div className="my-4 flex">
                        <Link href={`/pet/vaccinations/${record.id}`} className="mt-6 flex flex-col items-center justify-center w-12 h-12 mr-2 text-gray-900 transition-colors duration-150 bg-red-600 rounded-full focus:shadow-outline hover:bg-red-500">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                        </Link>
                        <button name="delete-vaccination" onClick={() => handleDeleteVaccinationRecord(record.id)} className="mt-6 ml-4 flex flex-col items-center justify-center w-12 h-12 mr-2 text-gray-900 transition-colors duration-150 bg-red-600 rounded-full focus:shadow-outline hover:bg-red-500">
                            <svg className="w-5 h-5" fill="#fff" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VaccinationRecordCard;