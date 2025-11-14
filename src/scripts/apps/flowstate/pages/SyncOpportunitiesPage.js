import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useApp } from '../context/AppContext'
import SyncOpportunityList from '../components/sync/SyncOpportunityList'

export default function SyncOpportunitiesPage() {
	const { currentUser, addNotification } = useApp()
	const [opportunities, setOpportunities] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterStatus, setFilterStatus] = useState('all')
	const [filterType, setFilterType] = useState('all')

	useEffect(() => {
		fetchOpportunities()
	}, [])

	const fetchOpportunities = async () => {
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			const mockOpportunities = [
				{
					id: 1,
					title: 'Action Thriller Film Score',
					clientName: 'Universal Pictures',
					description: 'Looking for intense, high-energy tracks for an upcoming action thriller.',
					projectType: 'film',
					budget: 20000,
					budgetCurrency: 'USD',
					isPaid: true,
					deadline: '2024-12-15T23:59:59',
					requiredGenre: 'Cinematic',
					requiredMood: 'Intense',
					submissionCount: 45,
					maxSubmissions: 100,
					status: 'open',
				},
				{
					id: 2,
					title: 'Nike Commercial Campaign',
					clientName: 'Nike',
					description: 'Upbeat, motivational music for global ad campaign.',
					projectType: 'commercial',
					budget: 35000,
					budgetCurrency: 'USD',
					isPaid: true,
					deadline: '2024-11-30T23:59:59',
					requiredGenre: 'Hip Hop',
					requiredMood: 'Energetic',
					submissionCount: 89,
					maxSubmissions: 100,
					status: 'open',
				},
				{
					id: 3,
					title: 'Indie Game Soundtrack',
					clientName: 'Pixel Studios',
					description: 'Atmospheric electronic music for sci-fi adventure game.',
					projectType: 'game',
					budget: 5000,
					budgetCurrency: 'USD',
					isPaid: true,
					deadline: '2025-01-20T23:59:59',
					requiredGenre: 'Electronic',
					requiredMood: 'Atmospheric',
					submissionCount: 23,
					maxSubmissions: 50,
					status: 'open',
				},
				{
					id: 4,
					title: 'Netflix Series Main Theme',
					clientName: 'Netflix',
					description: 'Original theme music for new drama series.',
					projectType: 'tv',
					budget: 50000,
					budgetCurrency: 'USD',
					isPaid: true,
					deadline: '2024-11-25T23:59:59',
					requiredGenre: 'Cinematic',
					requiredMood: 'Dramatic',
					submissionCount: 100,
					maxSubmissions: 100,
					status: 'in_review',
				},
				{
					id: 5,
					title: 'Movie Trailer Music',
					clientName: 'Warner Bros',
					description: 'Epic trailer music for summer blockbuster.',
					projectType: 'trailer',
					budget: 15000,
					budgetCurrency: 'USD',
					isPaid: true,
					deadline: '2024-12-01T23:59:59',
					requiredGenre: 'Cinematic',
					requiredMood: 'Epic',
					submissionCount: 67,
					maxSubmissions: 75,
					status: 'open',
				},
			]
			setOpportunities(mockOpportunities)
			setIsLoading(false)
		}, 600)
	}

	const handleSubmit = (opportunity) => {
		addNotification({
			type: 'success',
			title: 'Track Submitted',
			message: `Your track has been submitted to: ${opportunity.title}`,
		})
	}

	const handleView = (opportunity) => {
		addNotification({
			type: 'info',
			title: 'View Opportunity',
			message: `Opening details for: ${opportunity.title}`,
		})
	}

	const handleCreate = () => {
		addNotification({
			type: 'info',
			title: 'Post Opportunity',
			message: 'Opportunity creation modal would open here',
		})
	}

	const filteredOpportunities = opportunities.filter((opp) => {
		const matchesSearch =
			opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(opp.clientName && opp.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(opp.description && opp.description.toLowerCase().includes(searchQuery.toLowerCase()))
		const matchesStatus = filterStatus === 'all' || opp.status === filterStatus
		const matchesType = filterType === 'all' || opp.projectType === filterType

		return matchesSearch && matchesStatus && matchesType
	})

	const openCount = opportunities.filter((o) => o.status === 'open').length
	const totalBudget = opportunities
		.filter((o) => o.status === 'open' && o.budget)
		.reduce((sum, o) => sum + o.budget, 0)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Sync Opportunities</h1>
					<p className="mt-1 text-sm text-gray-500">Browse and submit to licensing opportunities</p>
				</div>
				{currentUser?.userType === 'industry_partner' && (
					<button
						type="button"
						onClick={handleCreate}
						className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
					>
						<PlusIcon className="h-5 w-5 mr-1.5" />
						Post Opportunity
					</button>
				)}
			</div>

			{/* Stats */}
			{!isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Open Opportunities</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">{openCount}</dd>
					</div>
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Total Opportunities</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">{opportunities.length}</dd>
					</div>
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Total Budget (Open)</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">
							${totalBudget.toLocaleString()}
						</dd>
					</div>
				</div>
			)}

			{/* Filters and Search */}
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Search */}
				<div className="flex-1">
					<div className="relative">
						<MagnifyingGlassIcon
							className="pointer-events-none absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
						<input
							type="text"
							placeholder="Search opportunities..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
						/>
					</div>
				</div>

				{/* Type Filter */}
				<div className="sm:w-48">
					<select
						value={filterType}
						onChange={(e) => setFilterType(e.target.value)}
						className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
					>
						<option value="all">All Types</option>
						<option value="film">Film</option>
						<option value="tv">TV</option>
						<option value="commercial">Commercial</option>
						<option value="game">Game</option>
						<option value="trailer">Trailer</option>
						<option value="other">Other</option>
					</select>
				</div>

				{/* Status Filter */}
				<div className="sm:w-48">
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
					>
						<option value="all">All Status</option>
						<option value="open">Open</option>
						<option value="in_review">In Review</option>
						<option value="closed">Closed</option>
						<option value="awarded">Awarded</option>
					</select>
				</div>
			</div>

			{/* Opportunities List */}
			<SyncOpportunityList
				opportunities={filteredOpportunities}
				isLoading={isLoading}
				onSubmit={handleSubmit}
				onView={handleView}
				onCreate={handleCreate}
			/>
		</div>
	)
}
