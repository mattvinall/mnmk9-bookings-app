export const formatTime = (time: string) => {
	const hour = time.split(":")[0] as string;
	const minute = time.split(":")[1] as string;
	const hourAsNumber = parseInt(hour, 10);

	// if hour is less or equal to 12, return the time as is
	if (hourAsNumber <= 11) {
		return `${hour}:${minute} AM`;
	}

	switch (hourAsNumber) {
		case 12:
			return `12:${minute} PM`;
		
		case 13:
			return `1:${minute} PM`;

		case 14:
			return `2:${minute} PM`;

		case 15:
			return `3:${minute} PM`;

		case 16:
			return `4:${minute} PM`;

		case 17:
			return `5:${minute} PM`;

		case 18:
			return `6:${minute} PM`;

		case 19:
			return `7:${minute} PM`;

		case 20:
			return `8:${minute} PM`;

		case 21:
			return `9:${minute} PM`;

		case 22:
			return `10:${minute} PM`;

		case 23:
			return `11:${minute} PM`;

		case 24:
			return `12:${minute} AM`;
	}
}