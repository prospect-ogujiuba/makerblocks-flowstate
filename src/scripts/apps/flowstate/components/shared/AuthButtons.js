import {ArrowRightIcon} from "@heroicons/react/24/outline";

export default function AuthButtons({
	loginUrl,
	registrationUrl,
	className = 'space-x-4',
	variant = 'horizontal'
}) {

	return (
		<div className={`${className}`}>
			<button
				disabled
				className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-slate-400 font-semibold shadow-sm"
			>
				Join <i className="ml-2 bi bi-hourglass-split"></i>
			</button>
			<a
				href={loginUrl}
				className="inline-flex items-center justify-center rounded-lg bg-white/10 border border-white px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-white/15 transition-colors duration-200"
			>
				Log In <i className="ml-2 bi bi-box-arrow-right"></i>
			</a>
		</div>
	)
}
