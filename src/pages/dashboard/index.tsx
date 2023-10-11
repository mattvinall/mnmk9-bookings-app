"use client";

import BookingsCalendar from "../../components/admin/widgets/BookingsCalendar";
import DashboardOverview from "../../components/admin/widgets/DashboardOverview";
import TodoList from "../../components/admin/widgets/TodoList";
import ConfirmBookings from "../../components/admin/widgets/ConfirmBookings";
import { useAuth } from "@clerk/nextjs";
import { getUserById } from "../../api/users";

const Dashboard = () => {
	const { userId, isSignedIn } = useAuth();

	const { data: userData } = getUserById(userId as string);
	return (
		<>
			{userData?.role === "admin" && isSignedIn ? (
				<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
					<h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						MNMK-9  <span className="text-[rgb(238,182,43)]">Dashboard</span>
					</h1>
					<DashboardOverview />
					<BookingsCalendar />
					<div className="flex flex-col lg:flex-row container lg:justify-between items-start px-4 py-16">
						<TodoList />
						<ConfirmBookings />
					</div>
				</div>
			) : (
				<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
					<h3 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Error 403: Forbidden</h3>
				</div>
			)}
		</>
	)
}

export default Dashboard;