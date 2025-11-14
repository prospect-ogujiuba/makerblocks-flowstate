import { BriefcaseIcon } from '@heroicons/react/24/outline'
import PlacementCard from './PlacementCard'
import EmptyState from '../shared/EmptyState'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function PlacementList({ placements, isLoading, onCreate }) {
	if (isLoading) {
		return <LoadingSpinner size="lg" className="py-12" />
	}

	if (!placements || placements.length === 0) {
		return (
			<EmptyState
				icon={BriefcaseIcon}
				title="No placements yet"
				description="Record your first placement to track your success."
				actionLabel={onCreate ? 'Add Placement' : null}
				onAction={onCreate}
			/>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{placements.map((placement) => (
				<PlacementCard key={placement.id} placement={placement} />
			))}
		</div>
	)
}
