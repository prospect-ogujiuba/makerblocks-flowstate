import { CalendarIcon, MapPinIcon, UsersIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import Badge from '../shared/Badge'

export default function WorkshopCard({ workshop, onJoin, onView }) {
	const getStatusVariant = (status) => {
		const variants = {
			planned: 'info',
			active: 'success',
			completed: 'default',
			cancelled: 'danger',
		}
		return variants[status] || 'default'
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'TBD'
		return new Date(dateString).toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'short', 
			day: 'numeric' 
		})
	}

	const isFull = workshop.maxParticipants && workshop.participantCount >= workshop.maxParticipants
	const spotsLeft = workshop.maxParticipants 
		? workshop.maxParticipants - workshop.participantCount 
		: null

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow">
			<div className="p-5">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<h3 className="text-base font-semibold text-gray-900 line-clamp-2">{workshop.title}</h3>
						{workshop.projectName && (
							<p className="text-sm text-gray-500 mt-1">{workshop.projectName}</p>
						)}
					</div>
					<Badge variant={getStatusVariant(workshop.status)} size="sm">
						{workshop.status}
					</Badge>
				</div>

				{workshop.description && (
					<p className="mt-3 text-sm text-gray-600 line-clamp-2">{workshop.description}</p>
				)}

				<div className="mt-4 space-y-2">
					{workshop.startDate && (
						<div className="flex items-center text-sm text-gray-500">
							<CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
							<span>
								{formatDate(workshop.startDate)}
								{workshop.endDate && ` - ${formatDate(workshop.endDate)}`}
							</span>
						</div>
					)}

					<div className="flex items-center text-sm text-gray-500">
						{workshop.isVirtual ? (
							<>
								<VideoCameraIcon className="h-5 w-5 mr-2 text-gray-400" />
								<span>Virtual</span>
							</>
						) : (
							<>
								<MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
								<span>{workshop.location || 'Location TBD'}</span>
							</>
						)}
					</div>

					<div className="flex items-center text-sm text-gray-500">
						<UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
						<span>
							{workshop.participantCount || 0}
							{workshop.maxParticipants && ` / ${workshop.maxParticipants}`} participants
						</span>
					</div>
				</div>

				{spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
					<div className="mt-3 text-sm font-medium text-orange-600">
						Only {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left!
					</div>
				)}

				<div className="mt-4 flex space-x-2">
					{onView && (
						<button
							type="button"
							onClick={() => onView(workshop)}
							className="flex-1 inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							View Details
						</button>
					)}
					{onJoin && workshop.status === 'planned' && !isFull && (
						<button
							type="button"
							onClick={() => onJoin(workshop)}
							className="flex-1 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
						>
							Join Workshop
						</button>
					)}
					{isFull && workshop.status === 'planned' && (
						<button
							type="button"
							disabled
							className="flex-1 inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
						>
							Full
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
