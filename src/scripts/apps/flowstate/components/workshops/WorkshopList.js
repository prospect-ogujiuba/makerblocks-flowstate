import { UsersIcon } from '@heroicons/react/24/outline'
import WorkshopCard from './WorkshopCard'
import EmptyState from '../shared/EmptyState'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function WorkshopList({ workshops, isLoading, onJoin, onView, onCreate }) {
	if (isLoading) {
		return <LoadingSpinner size="lg" className="py-12" />
	}

	if (!workshops || workshops.length === 0) {
		return (
			<EmptyState
				icon={UsersIcon}
				title="No workshops available"
				description="Join a workshop to collaborate with other producers."
				actionLabel={onCreate ? 'Create Workshop' : null}
				onAction={onCreate}
			/>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{workshops.map((workshop) => (
				<WorkshopCard
					key={workshop.id}
					workshop={workshop}
					onJoin={onJoin}
					onView={onView}
				/>
			))}
		</div>
	)
}
