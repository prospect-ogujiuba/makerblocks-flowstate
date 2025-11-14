import { AcademicCapIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Badge from '../shared/Badge'

export default function MasterclassCard({ masterclass, onEnroll, onView }) {
	const getDifficultyVariant = (level) => {
		const variants = {
			beginner: 'success',
			intermediate: 'warning',
			advanced: 'danger',
			all_levels: 'info',
		}
		return variants[level] || 'default'
	}

	const formatPrice = (price, isFree) => {
		if (isFree) return 'Free'
		if (!price) return 'Free'
		return `$${price}`
	}

	const formatDuration = (minutes) => {
		if (!minutes) return 'Variable'
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		if (hours > 0) {
			return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
		}
		return `${mins}m`
	}

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow">
			{/* Cover Image */}
			{masterclass.coverImageUrl && (
				<div className="aspect-video w-full">
					<img src={masterclass.coverImageUrl} alt={masterclass.title} className="h-full w-full object-cover" />
				</div>
			)}

			<div className="p-5">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<h3 className="text-base font-semibold text-gray-900 line-clamp-2">{masterclass.title}</h3>
						{masterclass.instructorName && (
							<p className="text-sm text-gray-500 mt-1">by {masterclass.instructorName}</p>
						)}
					</div>
					{masterclass.difficultyLevel && (
						<Badge variant={getDifficultyVariant(masterclass.difficultyLevel)} size="sm">
							{masterclass.difficultyLevel.replace('_', ' ')}
						</Badge>
					)}
				</div>

				{masterclass.description && (
					<p className="mt-3 text-sm text-gray-600 line-clamp-2">{masterclass.description}</p>
				)}

				<div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
					{masterclass.durationMinutes && (
						<div className="flex items-center">
							<ClockIcon className="h-4 w-4 mr-1" />
							{formatDuration(masterclass.durationMinutes)}
						</div>
					)}
					{masterclass.enrollmentCount !== undefined && (
						<div className="flex items-center">
							<UserGroupIcon className="h-4 w-4 mr-1" />
							{masterclass.enrollmentCount} enrolled
						</div>
					)}
					{masterclass.category && <span className="text-xs">{masterclass.category}</span>}
				</div>

				<div className="mt-4 flex items-center justify-between">
					<span className="text-lg font-bold text-gray-900">
						{formatPrice(masterclass.price, masterclass.isFree)}
					</span>
					<div className="flex space-x-2">
						{onView && (
							<button
								type="button"
								onClick={() => onView(masterclass)}
								className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								View
							</button>
						)}
						{onEnroll && masterclass.status === 'published' && (
							<button
								type="button"
								onClick={() => onEnroll(masterclass)}
								className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
							>
								<AcademicCapIcon className="h-4 w-4 mr-1" />
								Enroll
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
