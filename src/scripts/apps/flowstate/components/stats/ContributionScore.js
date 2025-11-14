import { TrophyIcon } from '@heroicons/react/24/outline'
import Badge from '../shared/Badge'

export default function ContributionScore({ score, breakdown, membershipType }) {
	const getMembershipVariant = (type) => {
		const variants = {
			pioneer: 'pioneer',
			elite: 'purple',
			board: 'success',
			regular: 'default',
		}
		return variants[type] || 'default'
	}

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow-xs">
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div className="rounded-md bg-yellow-500 p-3">
							<TrophyIcon className="h-6 w-6 text-white" aria-hidden="true" />
						</div>
						<div className="ml-4">
							<h3 className="text-sm font-medium text-gray-500">Contribution Score</h3>
							<p className="text-3xl font-bold text-gray-900">{score}</p>
						</div>
					</div>
					{membershipType && <Badge variant={getMembershipVariant(membershipType)}>{membershipType}</Badge>}
				</div>

				{breakdown && (
					<div className="mt-6 space-y-3">
						<div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Score Breakdown</div>
						{breakdown.tracks && (
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Tracks Uploaded ({breakdown.tracks.count})</span>
								<span className="font-medium text-gray-900">{breakdown.tracks.points} pts</span>
							</div>
						)}
						{breakdown.placements && (
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Placements ({breakdown.placements.count})</span>
								<span className="font-medium text-gray-900">{breakdown.placements.points} pts</span>
							</div>
						)}
						{breakdown.masterclasses && (
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Masterclasses ({breakdown.masterclasses.count})</span>
								<span className="font-medium text-gray-900">{breakdown.masterclasses.points} pts</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
