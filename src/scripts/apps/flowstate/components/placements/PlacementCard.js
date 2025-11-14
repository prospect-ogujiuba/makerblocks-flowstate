import { CalendarIcon, CurrencyDollarIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Badge from '../shared/Badge'

export default function PlacementCard({ placement }) {
	const getStatusVariant = (status) => {
		const variants = {
			pending: 'warning',
			confirmed: 'info',
			released: 'success',
			cancelled: 'danger',
		}
		return variants[status] || 'default'
	}

	const getTypeVariant = (type) => {
		const variants = {
			sync: 'purple',
			artist: 'info',
			label: 'success',
			publishing: 'warning',
			other: 'default',
		}
		return variants[type] || 'default'
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'TBD'
		return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
	}

	const formatCurrency = (value, currency = 'USD') => {
		if (!value) return 'N/A'
		return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
	}

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow">
			<div className="p-5">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<h3 className="text-base font-semibold text-gray-900 truncate">{placement.projectName}</h3>
						{placement.clientName && <p className="text-sm text-gray-500 mt-1">{placement.clientName}</p>}
					</div>
					<div className="flex flex-col items-end space-y-2">
						<Badge variant={getStatusVariant(placement.status)} size="sm">
							{placement.status}
						</Badge>
						<Badge variant={getTypeVariant(placement.placementType)} size="sm">
							{placement.placementType}
						</Badge>
					</div>
				</div>

				{placement.trackTitle && (
					<div className="mt-3 text-sm text-gray-600">
						<span className="font-medium">Track:</span> {placement.trackTitle}
					</div>
				)}

				<div className="mt-4 grid grid-cols-2 gap-4">
					<div className="flex items-center text-sm text-gray-500">
						<CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
						<div>
							<div className="text-xs text-gray-500">Value</div>
							<div className="font-medium text-gray-900">{formatCurrency(placement.value, placement.currency)}</div>
						</div>
					</div>

					<div className="flex items-center text-sm text-gray-500">
						<CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
						<div>
							<div className="text-xs text-gray-500">Date</div>
							<div className="font-medium text-gray-900">{formatDate(placement.placementDate)}</div>
						</div>
					</div>
				</div>

				{placement.territory && (
					<div className="mt-3 flex items-center text-sm text-gray-500">
						<GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
						<span>{placement.territory}</span>
					</div>
				)}

				{placement.royaltyPercentage && (
					<div className="mt-3 text-sm text-gray-600">
						<span className="font-medium">Royalty:</span> {placement.royaltyPercentage}%
					</div>
				)}
			</div>
		</div>
	)
}
