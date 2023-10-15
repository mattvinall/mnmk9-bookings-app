import { Pet, User } from "@prisma/client";

export interface UserDetail extends User {
    pets: Pet[]
}

interface AddWaiverFormProps {
    userDetail: UserDetail,
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    fileName: string
    handleWaiverDocumentFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const AddWaiverForm = ({ userDetail, handleChange, handleSubmit, fileName, handleWaiverDocumentFileChange }: AddWaiverFormProps) => {
    return (
        <form style={{ position: "relative" }} className="w-[90%] md:w-[90%] mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center md:grid-cols-1 md:gap-6">
                <div className="relative z-0 mb-6 w-[80%] md:w-40% group">
                    <label
                        htmlFor="pet-select"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Select Pet
                    </label>
                    <select
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        id="pet-select"
                        onChange={handleChange}
                    >
                        {userDetail?.pets && userDetail?.pets.map((pet: Pet) => {
                            const { name } = pet;
                            return (
                                <option key={name} className="!text-gray-900 w-[10%]" value={name}>{name}</option>
                            )
                        })}
                    </select>
                    <svg
                        style={{ fill: "#fff", position: "absolute", right: "0", bottom: "15px", height: "20px" }}
                        className="ml-2 w-4 h-4"
                        aria-hidden="true"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2" d="M19 9l-7 7-7-7">
                        </path>
                    </svg>
                </div>
                <div className="relative z-0 mb-6">
                    <input
                        style={{ cursor: "pointer !important" }}
                        type="file"
                        accept=".pdf, .docx, image/*, .png, .jpg, .jpeg"
                        id="waiver-document"
                        className="hidden"
                        onChange={handleWaiverDocumentFileChange}
                    />
                    <label
                        htmlFor="waiver-document"
                        className="cursor-pointer inline-block bg-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-gray-700 mr-2 mb-5">
                        Upload Waiver
                    </label>
                    {fileName && <p className="font-medium text-white text-center">Waiver Document Selected: {fileName}. <br />Click Submit to upload.</p>}
                </div>
                <button
                    type="submit"
                    className="mt-[25px] rounded-full bg-gradient-to-l from-[#A70D0E] to-[#EEB62B] hover:bg-gradient-to-r from-[#EEB62B] to-[#A70D0E] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Submit
                </button>
            </div >
        </form>
    )
}