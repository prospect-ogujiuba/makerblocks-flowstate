import { useState, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useApp } from '../context/AppContext'
import WorkshopList from '../components/workshops/WorkshopList'

export default function WorkshopsPage() {
	const { currentUser, addNotification } = useApp()
	const [workshops, setWorkshops] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterStatus, setFilterStatus] = useState('all')

	useEffect(() => {
		fetchWorkshops()
	}, [])

	const fetchWorkshops = async () => {
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			const mockWorkshops = [
				{
					id: 1,
					title: 'Hip Hop Production Workshop',
					projectName: 'Beat Making Intensive',
					description: 'Learn advanced hip hop production techniques in this hands-on workshop.',
					startDate: '2024-12-01',
					endDate: '2024-12-03',
					location: 'Los Angeles, CA',
					isVirtual: false,
					maxParticipants: 15,
					participantCount: 12,
					status: 'planned',
				},
				{
					id: 2,
					title: 'Virtual Mixing Masterclass',
					projectName: null,
					description: 'Online workshop covering professional mixing techniques.',
					startDate: '2024-11-20',
					endDate: '2024-11-20',
					location: null,
					isVirtual: true,
					maxParticipants: 50,
					participantCount: 34,
					status: 'planned',
				},
				{
					id: 3,
					title: 'Songwriting Camp',
					projectName: 'Summer Sessions',
					description: 'Collaborative songwriting with top artists and producers.',
					startDate: '2024-10-15',
					endDate: '2024-10-20',
					location: 'Miami, FL',
					isVirtual: false,
					maxParticipants: 20,
					participantCount: 20,
					status: 'completed',
				},
				{
					id: 4,
					title: 'Trap Production Bootcamp',
					projectName: 'Bass Heavy',
					description: 'Intensive trap production workshop focusing on 808s and hard-hitting drums.',
					startDate: '2024-11-18',
					endDate: '2024-11-19',
					location: 'Atlanta, GA',
					isVirtual: false,
					maxParticipants: 12,
					participantCount: 8,
					status: 'planned',
				},
			]
			setWorkshops(mockWorkshops)
			setIsLoading(false)
		}, 600)
	}

	const handleJoin = (workshop) => {
		addNotification({
			type: 'success',
			title: 'Joined Workshop',
			message: `You've joined: ${workshop.title}`,
		})
	}

	const handleView = (workshop) => {
		addNotification({
			type: 'info',
			title: 'View Workshop',
			message: `Opening details for: ${workshop.title}`,
		})
	}

	const handleCreate = () => {
		addNotification({
			type: 'info',
			title: 'Create Workshop',
			message: 'Workshop creation modal would open here',
		})
	}

	const filteredWorkshops = workshops.filter((workshop) => {
		const matchesSearch =
			workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(workshop.projectName && workshop.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(workshop.description && workshop.description.toLowerCase().includes(searchQuery.toLowerCase()))
		const matchesStatus = filterStatus === 'all' || workshop.status === filterStatus

		return matchesSearch && matchesStatus
	})

	const upcomingCount = workshops.filter((w) => w.status === 'planned').length
	const activeCount = workshops.filter((w) => w.status === 'active').length

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Workshops</h1>
					<p className="mt-1 text-sm text-gray-500">Collaborate with other producers in focused sessions</p>
				</div>
				<button
					type="button"
					onClick={handleCreate}
					className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
				>
					<PlusIcon className="h-5 w-5 mr-1.5" />
					Create Workshop
				</button>
			</div>

			{/* Stats */}
			{!isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Total Workshops</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">{workshops.length}</dd>
					</div>
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">{upcomingCount}</dd>
					</div>
					<div className="bg-white rounded-lg shadow-xs px-5 py-4">
						<dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
						<dd className="mt-1 text-3xl font-semibold text-gray-900">{activeCount}</dd>
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
							placeholder="Search workshops..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
						/>
					</div>
				</div>

				{/* Status Filter */}
				<div className="sm:w-48">
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
					>
						<option value="all">All Status</option>
						<option value="planned">Planned</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
			</div>

			{/* Workshops List */}
			<WorkshopList
				workshops={filteredWorkshops}
				isLoading={isLoading}
				onJoin={handleJoin}
				onView={handleView}
				onCreate={handleCreate}
			/>
		</div>
	)
}
