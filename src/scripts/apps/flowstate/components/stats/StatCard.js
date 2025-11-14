import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid'

export default function StatCard({ name, value, icon: Icon, change, changeType = 'increase' }) {
	return (
		<div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-xs sm:p-6">
			<div className="flex items-center">
				<div className="flex-shrink-0">
					{Icon && (
						<div className="rounded-md bg-indigo-500 p-3">
							<Icon className="h-6 w-6 text-white" aria-hidden="true" />
						</div>
					)}
				</div>
				<div className="ml-5 w-0 flex-1">
					<dt className="truncate text-sm font-medium text-gray-500">{name}</dt>
					<dd className="flex items-baseline">
						<div className="text-2xl font-semibold text-gray-900">{value}</div>
						{change && (
							<div
								className={`ml-2 flex items-baseline text-sm font-semibold ${
									changeType === 'increase' ? 'text-green-600' : 'text-red-600'
								}`}
							>
								{changeType === 'increase' ? (
									<ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
								) : (
									<ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
								)}
								<span className="sr-only">{changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
								{change}
							</div>
						)}
					</dd>
				</div>
			</div>
		</div>
	)
}
