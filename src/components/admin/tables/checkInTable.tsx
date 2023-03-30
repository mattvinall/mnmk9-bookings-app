"use client";

import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

type Props = {
	checkInBookings: any
	checkInBookingsList: any
}

const CheckInTable = ({ checkInBookings, checkInBookingsList }: Props): ReactJSXElement => {
	return (
		<>
			<h3 className="text-white font-bold text-[2rem] mb-8">Checking In:</h3>
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className={`text-md text-gray-700 uppercase bg-white dark:bg-white dark:text-navy-800`}>
					<tr>
						<th scope="col" className="px-6 py-3">
							Name
						</th>
						<th scope="col" className="px-6 py-3">
							Service
						</th>
						<th scope="col" className="px-6 py-3">
							Date (Check In/Start)
						</th>
						<th scope="col" className="px-6 py-3">
							Date (Check Out/End)
						</th>
						<th scope="col" className="px-6 py-3">
							Time (Start)
						</th>
						<th scope="col" className="px-6 py-3">
							Time (End)
						</th>
					</tr>
				</thead>
				<tbody>
					{checkInBookings && checkInBookings.length > 0 ? checkInBookingsList : <p className="text-white text-[1.2rem] overflow-none mt-4">Nobody checking in this date.</p>}
				</tbody>
			</table>

		</>
	)
}

export default CheckInTable;