"use client";

import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

type Props = {
	name: string,
	address: string,
	city: string,
	phoneNumber: string,
	image: string,
	postalCode: string,
}

const UserInfoCard: React.FC<Props> = ({ name, address, city, phoneNumber, postalCode, image }: Props): ReactJSXElement => {
	return (
		<div key={name} className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
			<div className="flex justify-center">
				<div className="rounded-lg shadow-lg bg-white max-w-md">
					<img className="rounded-full scale-50 float-right" src={image as string} />
					<div className="p-6">
						<h2 className="text-gray-900 text-xl font-bold mb-2">{name}</h2>
						{phoneNumber ? <p className="text-gray-700 font-medium text-base mb-4">{phoneNumber}</p> : <p>--</p>}
						{address && city && postalCode && <p className="text-gray-700 text-base mb-4">{address}, {city}. {postalCode}</p>}
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserInfoCard;