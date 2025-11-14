import { PlusIcon } from '@heroicons/react/24/outline'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
	return (
		<div className="text-center py-12">
			<div className="mx-auto h-12 w-12 text-gray-400">
				{Icon ? <Icon className="h-12 w-12" /> : null}
			</div>
			<h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
			<p className="mt-1 text-sm text-gray-500">{description}</p>
			{actionLabel && onAction && (
				<div className="mt-6">
					<button
						type="button"
						onClick={onAction}
						className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						<PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
						{actionLabel}
					</button>
				</div>
			)}
		</div>
	)
}
