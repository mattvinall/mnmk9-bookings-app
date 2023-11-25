import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
	<SignUp path="/sign-up" routing="path" signInUrl="/sign-in" appearance={{
		elements: {
			footer: {
				display: 'none',
			},
		},
	}} />
);

export default SignUpPage;