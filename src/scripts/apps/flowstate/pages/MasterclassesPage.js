import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useApp } from '../context/AppContext'
import MasterclassList from '../components/masterclasses/MasterclassList'

export default function MasterclassesPage() {
	const { currentUser, addNotification } = useApp()
	const [masterclasses, setMasterclasses] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterDifficulty, setFilterDifficulty] = useState('all')

	useEffect(() => {
		fetchMasterclasses()
	}, [])

	const fetchMasterclasses = async () => {
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			const mockMasterclasses = [
				{
					id: 1,
					title: 'Advanced Mixing Techniques for Hip Hop',
					instructorName: 'DJ Premier',
					description: 'Learn professional mixing techniques used in top hip hop productions.',
					difficultyLevel: 'advanced',
					category: 'Mixing',
					price: 149.99,
					isFree: false,
					durationMinutes: 240,
					enrollmentCount: 234,
					status: 'published',
					coverImageUrl: null,
				},
				{
					id: 2,
					title: 'Trap Production Masterclass',
					instructorName: 'Metro Boomin',
					description: 'Create chart-topping trap beats from scratch.',
					difficultyLevel: 'intermediate',
					category: 'Production',
					price: 199.99,
					isFree: false,
					durationMinutes: 360,
					enrollmentCount: 567,
					status: 'published',
					coverImageUrl: null,
				},
				{
					id: 3,
					title: 'Music Theory Fundamentals',
					instructorName: 'Sarah Johnson',
					description: 'Essential music theory every producer should know.',
					difficultyLevel: 'beginner',
					category: 'Theory',
					price: 0,
					isFree: true,
					durationMinutes: 120,
					enrollmentCount: 1023,
					status: 'published',
					coverImageUrl: null,
				},
				{
					id: 4,
					title: 'Sound Design for Producers',
					instructorName: 'Flume',
					description: 'Create unique sounds and textures for your productions.',
					difficultyLevel: 'intermediate',
					category: 'Sound Design',
					price: 179.99,
					isFree: false,
					durationMinutes: 300,
					enrollmentCount: 445,
					status: 'published',
					coverImageUrl: null,
				},
				{
					id: 5,
					title: 'Vocal Production & Comping',
					instructorName: 'Serban Ghenea',
					description: 'Professional vocal recording and editing techniques.',
					difficultyLevel: 'advanced',
					category: 'Recording',
					price: 169.99,
					isFree: false,
					durationMinutes: 210,
					enrollmentCount: 312,
					status: 'published',
					coverImageUrl: null,
				},
				{
					id: 6,
					title: 'Getting Started with FL Studio',
					instructorName: 'Mike Thompson',
					description: 'Complete beginner guide to FL Studio DAW.',
					difficultyLevel: 'beginner',
					category: 'DAW',
					price: 0,
					isFree: true,
					durationMinutes: 180,
					enrollmentCount: 2341,
					status: 'published',
					coverImageUrl: null,
				},
			]
			setMasterclasses(mockMasterclasses)
			setIsLoading(false)
		}, 600)
	}

	const handleEnroll = (masterclass) => {
		addNotification({
			type: 'success',
			title: 'Enrolled Successfully',
			message: `You've enrolled in: ${masterclass.title}`,
		})
	}

	const handleView = (masterclass) => {
		addNotification({
			type: 'info',
			title: 'View Masterclass',
			message: `Opening details for: ${masterclass.title}`,
		})
	}

	const filteredMasterclasses = masterclasses.filter((mc) => {
		const matchesSearch =
			mc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			mc.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			mc.category.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesDifficulty = filterDifficulty === 'all' || mc.difficultyLevel === filterDifficulty

		return matchesSearch && matchesDifficulty
	})

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Masterclasses</h1>
				<p className="mt-1 text-sm text-gray-500">Learn from industry professionals and level up your skills</p>
			</div>

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
							placeholder="Search masterclasses..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
						/>
					</div>
				</div>

				{/* Difficulty Filter */}
				<div className="sm:w-48">
					<select
						value={filterDifficulty}
						onChange={(e) => setFilterDifficulty(e.target.value)}
						className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
					>
						<option value="all">All Levels</option>
						<option value="beginner">Beginner</option>
						<option value="intermediate">Intermediate</option>
						<option value="advanced">Advanced</option>
						<option value="all_levels">All Levels</option>
					</select>
				</div>
			</div>

			{/* Stats */}
			{!isLoading && (
				<div className="flex items-center space-x-6 text-sm text-gray-500">
					<span>
						<span className="font-medium text-gray-900">{filteredMasterclasses.length}</span> masterclasses
					</span>
					<span>
						<span className="font-medium text-gray-900">
							{masterclasses.filter((mc) => mc.isFree).length}
						</span>{' '}
						free courses
					</span>
				</div>
			)}

			{/* Masterclasses List */}
			<MasterclassList
				masterclasses={filteredMasterclasses}
				isLoading={isLoading}
				onEnroll={handleEnroll}
				onView={handleView}
			/>
		</div>
	)
}
