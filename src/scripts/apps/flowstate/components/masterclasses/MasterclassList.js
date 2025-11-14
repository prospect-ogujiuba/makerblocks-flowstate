import { AcademicCapIcon } from '@heroicons/react/24/outline'
import MasterclassCard from './MasterclassCard'
import EmptyState from '../shared/EmptyState'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function MasterclassList({ masterclasses, isLoading, onEnroll, onView, onCreate }) {
	if (isLoading) {
		return <LoadingSpinner size="lg" className="py-12" />
	}

	if (!masterclasses || masterclasses.length === 0) {
		return (
			<EmptyState
				icon={AcademicCapIcon}
				title="No masterclasses available"
				description="Check back soon for new learning opportunities."
				actionLabel={onCreate ? 'Create Masterclass' : null}
				onAction={onCreate}
			/>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{masterclasses.map((masterclass) => (
				<MasterclassCard key={masterclass.id} masterclass={masterclass} onEnroll={onEnroll} onView={onView} />
			))}
		</div>
	)
}
