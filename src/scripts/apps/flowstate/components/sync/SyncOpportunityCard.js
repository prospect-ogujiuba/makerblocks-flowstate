import { CalendarIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline'
import Badge from '../shared/Badge'

export default function SyncOpportunityCard({ opportunity, onSubmit, onView }) {
	const getStatusVariant = (status) => {
		const variants = {
			open: 'success',
			in_review: 'warning',
			closed: 'default',
			awarded: 'info',
		}
		return variants[status] || 'default'
	}

	const getProjectTypeVariant = (type) => {
		const variants = {
			film: 'purple',
			tv: 'info',
			commercial: 'success',
			game: 'warning',
			trailer: 'danger',
			other: 'default',
		}
		return variants[type] || 'default'
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'No deadline'
		return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
	}

	const formatBudget = (budget, currency = 'USD') => {
		if (!budget) return 'Not disclosed'
		return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(budget)
	}

	const isDeadlineSoon = (deadline) => {
		if (!deadline) return false
		const daysUntil = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
		return daysUntil <= 7 && daysUntil > 0
	}

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow">
			<div className="p-5">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<h3 className="text-base font-semibold text-gray-900 line-clamp-2">{opportunity.title}</h3>
						{opportunity.clientName && <p className="text-sm text-gray-500 mt-1">{opportunity.clientName}</p>}
					</div>
					<div className="flex flex-col items-end space-y-2">
						<Badge variant={getStatusVariant(opportunity.status)} size="sm">
							{opportunity.status.replace('_', ' ')}
						</Badge>
						<Badge variant={getProjectTypeVariant(opportunity.projectType)} size="sm">
							{opportunity.projectType}
						</Badge>
					</div>
				</div>

				{opportunity.description && (
					<p className="mt-3 text-sm text-gray-600 line-clamp-2">{opportunity.description}</p>
				)}

				<div className="mt-4 space-y-2">
					{opportunity.budget && (
						<div className="flex items-center text-sm text-gray-500">
							<CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
							<div>
								<span className="text-xs text-gray-500">Budget: </span>
								<span className="font-medium text-gray-900">
									{formatBudget(opportunity.budget, opportunity.budgetCurrency)}
								</span>
							</div>
						</div>
					)}

					<div className="flex items-center text-sm">
						<CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
						<div>
							<span className="text-xs text-gray-500">Deadline: </span>
							<span
								className={classNames(
									'font-medium',
									isDeadlineSoon(opportunity.deadline) ? 'text-red-600' : 'text-gray-900',
								)}
							>
								{formatDate(opportunity.deadline)}
							</span>
						</div>
					</div>

					{opportunity.submissionCount !== undefined && (
						<div className="flex items-center text-sm text-gray-500">
							<ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
							<span>
								{opportunity.submissionCount}
								{opportunity.maxSubmissions && `/${opportunity.maxSubmissions}`} submissions
							</span>
						</div>
					)}
				</div>

				{(opportunity.requiredGenre || opportunity.requiredMood) && (
					<div className="mt-3 flex flex-wrap gap-2">
						{opportunity.requiredGenre && (
							<span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
								{opportunity.requiredGenre}
							</span>
						)}
						{opportunity.requiredMood && (
							<span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
								{opportunity.requiredMood}
							</span>
						)}
					</div>
				)}

				<div className="mt-4 flex space-x-2">
					{onView && (
						<button
							type="button"
							onClick={() => onView(opportunity)}
							className="flex-1 inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							View Details
						</button>
					)}
					{onSubmit && opportunity.status === 'open' && (
						<button
							type="button"
							onClick={() => onSubmit(opportunity)}
							className="flex-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
						>
							Submit Track
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}
