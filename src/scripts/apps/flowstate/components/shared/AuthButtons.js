export default function AuthButtons({
	loginUrl,
	registrationUrl,
	className = 'space-x-4',
	variant = 'horizontal'
}) {

	return (
		<div className={`${className}`}>
			<a
				href={registrationUrl}
				className="justify-center rounded-md bg-stone-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
			>
				Get Started
			</a>
			<a
				href={loginUrl}
				className="justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200"
			>
				Log In
			</a>
		</div>
	)
}
