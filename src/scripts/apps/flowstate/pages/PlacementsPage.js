import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useApp } from '../context/AppContext'
import PlacementList from '../components/placements/PlacementList'

export default function PlacementsPage() {
	const { currentUser, addNotification } = useApp()
	const [placements, setPlacements] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [filterStatus, setFilterStatus] = useState('all')

	useEffect(() => {
		fetchPlacements()
	}, [])

	const fetchPlacements = async () => {
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			const mockPlacements = [
				{
					id: 1,
					projectName: 'Netflix Original Series',
					clientName: 'Netflix',
					placementType: 'sync',
					value: 15000,
					currency: 'USD',
					placementDate: '2024-11-01',
					status: 'confirmed',
					trackTitle: 'Summer Vibes',
					territory: 'Worldwide',
					royaltyPercentage: 50,
				},
				{
					id: 2,
					projectName: 'Nike Commercial',
					clientName: 'Nike Inc.',
					placementType: 'sync',
					value: 25000,
					currency: 'USD',
					placementDate: '2024-10-15',
					status: 'released',
					trackTitle: 'Night Drive',
					territory: 'North America',
					royaltyPercentage: 50,
				},
				{
					id: 3,
					projectName: 'Artist Album',
					clientName: 'Drake',
					placementType: 'artist',
					value: 10000,
					currency: 'USD',
					placementDate: '2024-09-20',
					status: 'released',
					trackTitle: 'Trap Banger',
					territory: 'Worldwide',
					royaltyPercentage: 25,
				},
				{
					id: 4,
					projectName: 'Video Game Soundtrack',
					clientName: 'EA Sports',
					placementType: 'sync',
					value: 8000,
					currency: 'USD',
					placementDate: null,
					status: 'pending',
					trackTitle: 'Dark Drill',
					territory: 'Worldwide',
					royaltyPercentage: 50,
				},
			]
			setPlacements(mockPlacements)
			setIsLoading(false)
		}, 600)
	}

	const handleCreate = () => {
		addNotification({
			type: 'info',
			title: 'Create Placement',
			message: 'Placement creation modal would open here',
		})
	}

	const filteredPlacements = placements.filter((placement) => {
		if (filterStatus === 'all') return true
		return placement.status === filterStatus
	})

	const totalValue = placements.reduce((sum, p) => sum + (p.value || 0), 0)
	const confirmedCount = placements.filter((p) => p.status === 'confirmed' || p.status === 'released').length

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">My Placements</h1>
					<p className="mt-1 text-sm text-gray-500">Track your music placements and deals</p>
				</div>
				<button
					type="button"
					onClick={handleCreate}
					className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
				>
					<PlusIcon className="h-5 w-5 mr-1.5" />
					Add Placement
				</button>
			</div>

			{/* Stats Summary */}
			{!isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Total Placements</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">{placements.length}</dd>
					</div>
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">{confirmedCount}</dd>
					</div>
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">
							${totalValue.toLocaleString()}
						</dd>
					</div>
				</div>
			)}

			{/* Status Filter */}
			<div className="flex items-center space-x-4">
				<label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
					Filter by status:
				</label>
				<select
					id="status-filter"
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
					className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
				>
					<option value="all">All Statuses</option>
					<option value="pending">Pending</option>
					<option value="confirmed">Confirmed</option>
					<option value="released">Released</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>

			{/* Placements List */}
			<PlacementList placements={filteredPlacements} isLoading={isLoading} onCreate={handleCreate} />
		</div>
	)
}
