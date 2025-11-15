export default function AuthButtons({
	loginUrl,
	registrationUrl,
	className = '',
	variant = 'horizontal'
}) {
	const containerClasses = variant === 'horizontal'
		? 'flex flex-col sm:flex-row gap-4'
		: 'flex flex-col gap-4'

	return (
		<div className={`${containerClasses} ${className}`}>
			<a
				href={registrationUrl}
				className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
			>
				Get Started
			</a>
			<a
				href={loginUrl}
				className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200"
			>
				Log In
			</a>
		</div>
	)
}
