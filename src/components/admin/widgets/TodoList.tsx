import { trpc } from "../../../utils/trpc";
import { useState } from "react";
import { useSession } from "next-auth/react";

const TodoList = () => {
	const { data: sessionData } = useSession()
	const { data: todos, isLoading, error, refetch } = trpc.todo.getAll.useQuery()

	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: any) => {
		setInputValue(e.target.value);
	};

	const addTodo = trpc.todo.addTodo.useMutation({
		onSuccess: () => refetch()
	});

	const deleteTodo = trpc.todo.deleteTodo.useMutation({
		onSuccess: () => refetch()
	});

	const handleAddTodo = () => {
		if (inputValue.trim() !== "") {
			const newTodo = {
				authorId: sessionData?.user?.id as string,
				title: inputValue,
			};
			addTodo.mutate(newTodo);
			setInputValue("");
		}
	};

	const handleDeleteTodo = (id: string) => {
		deleteTodo.mutate({ id })
	};

	const changeCompleteStatus = trpc.todo.updateCompletedStatus.useMutation({
		onSuccess: () => refetch()
	});

	const handleUpdateCompletedStatus = (id: string, completed: boolean) => {
		changeCompleteStatus.mutate({ id, completed })
	}

	return (
		<div className="w-full lg:w-[50%]">
			<h2 className="text-left text-3xl font-bold mb-8 text-white">Todo List</h2>
			<div className="flex items-start mb-4 w-full">
				<input
					type="text"
					placeholder="Add Todo..."
					value={inputValue}
					onChange={handleInputChange}
					className="w-full border border-gray-400 py-2 px-4 mb-4 rounded-lg"
				/>
				<button onClick={handleAddTodo} type="button" className="w-[100px] bg-teal-500 hover:bg-teal-400 text-black font-bold py-4 px-4 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center ml-2">Add</button>
			</div>
			<ul>
				{todos?.map((todo) => (
					<li key={todo.id} className="flex justify-between items-center py-2">
						<div className="flex items-center">
							<input
								type="checkbox"
								checked={todo.completed}
								className="mr-2"
								onChange={() => handleUpdateCompletedStatus(todo.id, todo.completed)}
							/>
							<span
								className={todo.completed ? "line-through text-gray-100 text-[1.2rem]" : "text-gray-100 text-[1.2rem]"}
							>
								{todo.title}
							</span>
						</div>
						<div className="flex">
							<svg onClick={() => handleDeleteTodo(todo.id)} style={{ color: "#fff", fill: "#fff", height: "20px", cursor: "pointer" }} fill="white" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path strokeLinecap="round" stroke-line-join="round" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TodoList;