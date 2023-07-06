import { Pet } from "@prisma/client";

export const PetDetailCard = (pet: Pet, defaultImage: string) => {
    return (
        <div key={pet.id} className="flex justify-center">
            <div className="rounded-lg shadow-lg bg-white max-w-full w-[90%] md:w-[32rem]">
                <div className="p-6">
                    <div className="flex justify-betweem items-center border-slate-600 border-b-2 pb-2">
                        <h2 className="text-gray-900 text-3xl font-medium mb-2 w-3/4">{pet.name} - {pet.breed}</h2>
                        <figure className="w-1/4 flex justify-end align-center">
                            <img src={pet.profileImage ? pet.profileImage : defaultImage} alt="pet profile image" className="w-10 h-10 rounded-full border-2 border-gray-300" />
                        </figure>
                    </div>
                    <div className="my-4 border-slate-500 border-b-2">
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium text-lg">Sex: {pet.sex.toLowerCase()}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium text-lg">Age: {pet.age} years old</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium text-lg">Weight: {pet.weight} lbs</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium text-lg">Temperament: {pet.temperament.toLocaleLowerCase()}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center border-slate-500 border-b-2">
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium text-lg">{pet?.sex === "MALE" ? "Neutered: " : "Spayed: "}  <span className="inline-block ml-2">{pet?.ovariohysterectomy === false ? "❌" : "✅"}</span></p>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium text-lg">Waiver Form Signed:  <span className="inline-block ml-2">{pet?.ovariohysterectomy === false ? "❌" : "✅"}</span></p>
                        </div>
                        {/* <p className="text-gray-600 font-medium text-lg">}</span></p> */}
                    </div>
                    <div className="my-4">
                        {pet?.medicalNotes && (
                            <p className="text-gray-600 font-medium text-lg">Medical Notes: <br /> {pet.medicalNotes}</p>
                        )}
                    </div>
                    <div className="my-4 border-slate-500 border-b-2 pb-4">
                        {pet?.feedingNotes && (
                            <p className="text-gray-600 font-medium text-lg">Feeding Notes: <br /> {pet.feedingNotes}</p>
                        )}
                    </div>
                    {pet?.microchipNumber && (
                        <div className="mt-8 flex justify-end items-end">
                            <p className="py-4 px-2 justify-center text-gray-600 font-bold text-sm  border-[rgb(103,163,161)] border-2 rounded-md">Microchip #: {pet.microchipNumber}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}