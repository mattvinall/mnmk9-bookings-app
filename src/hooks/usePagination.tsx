import { useState } from 'react';

const usePagination = (data: [unknown], itemsPerPage: number) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemCount: number = data?.length;

	const getCurrentData = () => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;

		return data?.slice(start, end);
	};

	const pageCount = Math.ceil(itemCount / itemsPerPage);

	const changePage = (page: number) => {
		setCurrentPage(page)
	}

	return {
		currentPage, getCurrentData, setCurrentPage, pageCount, changePage
	};
};

export default usePagination;