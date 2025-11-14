import { SparklesIcon } from '@heroicons/react/24/outline'
import SyncOpportunityCard from './SyncOpportunityCard'
import EmptyState from '../shared/EmptyState'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function SyncOpportunityList({ opportunities, isLoading, onSubmit, onView, onCreate }) {
	if (isLoading) {
		return <LoadingSpinner size="lg" className="py-12" />
	}

	if (!opportunities || opportunities.length === 0) {
		return (
			<EmptyState
				icon={SparklesIcon}
				title="No sync opportunities available"
				description="Check back soon for new licensing opportunities."
				actionLabel={onCreate ? 'Post Opportunity' : null}
				onAction={onCreate}
			/>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{opportunities.map((opportunity) => (
				<SyncOpportunityCard
					key={opportunity.id}
					opportunity={opportunity}
					onSubmit={onSubmit}
					onView={onView}
				/>
			))}
		</div>
	)
}
