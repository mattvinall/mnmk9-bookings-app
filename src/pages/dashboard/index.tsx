"use-client";

import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import BookingsCalendar from "../../components/admin/widgets/BookingsCalendar";
import DashboardOverview from "../../components/admin/widgets/DashboardOverview";
import TodoList from "../../components/admin/widgets/TodoList";

const Dashboard = () => {
	// get user session
	const { data: sessionData } = useSession();
	// get the id from the user session
	const id = sessionData?.user?.id as string;
	// fetch user by id 
	const { data: userData } = trpc.user.byId.useQuery({ id });

	return (
		<>
			{userData?.role === "admin" && sessionData ? (
				<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
					<h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						MNMK-9  <span className="text-[hsl(280,100%,70%)]">Dashboard</span>
					</h1>
					<DashboardOverview />
					<BookingsCalendar />
					<div className="flex container justify-between items-center px-4 py-16">
						<TodoList />
					</div>
				</div>
			) : (
				<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Error 403: Forbidden</h1>
				</div>
			)}
		</>
	)
}

export default Dashboard;