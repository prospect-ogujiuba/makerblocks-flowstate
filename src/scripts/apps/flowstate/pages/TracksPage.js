import {useState, useEffect} from 'react'
import {MagnifyingGlassIcon, FunnelIcon, PlusIcon} from '@heroicons/react/20/solid'
import {useApp} from '../context/AppContext'
import TrackList from '../components/tracks/TrackList'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function TracksPage() {
	const {currentProfile, currentUser, addNotification} = useApp()
	const [tracks, setTracks] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterGenre, setFilterGenre] = useState('all')

	useEffect(() => {
		fetchTracks()
	}, [])

	const fetchTracks = async () => {
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			const mockTracks = [
				{
					id: 1,
					title: 'Summer Vibes',
					artistName: currentUser.displayName,
					genre: 'Hip Hop',
					bpm: 140,
					keySignature: 'C# Minor',
					durationSeconds: 195,
					playCount: 45,
					downloadCount: 12,
					status: 'active',
					isDownloadable: true,
				},
				{
					id: 2,
					title: 'Night Drive',
					artistName: currentUser.displayName,
					genre: 'R&B',
					bpm: 85,
					keySignature: 'A Minor',
					durationSeconds: 210,
					playCount: 32,
					downloadCount: 8,
					status: 'active',
					isDownloadable: true,
				},
				{
					id: 3,
					title: 'Trap Banger',
					artistName: currentUser.displayName,
					genre: 'Trap',
					bpm: 150,
					keySignature: 'G Minor',
					durationSeconds: 180,
					playCount: 67,
					downloadCount: 23,
					status: 'active',
					isDownloadable: true,
				},
				{
					id: 4,
					title: 'Chill Lofi',
					artistName: currentUser.displayName,
					genre: 'Lofi',
					bpm: 75,
					keySignature: 'D Major',
					durationSeconds: 165,
					playCount: 89,
					downloadCount: 34,
					status: 'active',
					isDownloadable: true,
				},
				{
					id: 5,
					title: 'Pop Anthem',
					artistName: currentUser.displayName,
					genre: 'Pop',
					bpm: 128,
					keySignature: 'F Major',
					durationSeconds: 205,
					playCount: 123,
					downloadCount: 45,
					status: 'active',
					isDownloadable: true,
				},
				{
					id: 6,
					title: 'Dark Drill',
					artistName: currentUser.displayName,
					genre: 'Drill',
					bpm: 140,
					keySignature: 'B Minor',
					durationSeconds: 175,
					playCount: 56,
					downloadCount: 19,
					status: 'active',
					isDownloadable: true,
				},
			]
			setTracks(mockTracks)
			setIsLoading(false)
		}, 600)
	}

	const handlePlay = (track) => {
		addNotification({
			type: 'info',
			title: 'Playing track',
			message: `Now playing: ${track.title}`,
		})
	}

	const handleDownload = (track) => {
		addNotification({
			type: 'success',
			title: 'Download started',
			message: `Downloading: ${track.title}`,
		})
	}

	const handleUpload = () => {
		addNotification({
			type: 'info',
			title: 'Upload feature',
			message: 'Track upload modal would open here',
		})
	}

	const filteredTracks = tracks.filter((track) => {
		const matchesSearch =
			track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			track.genre.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesGenre = filterGenre === 'all' || track.genre === filterGenre

		return matchesSearch && matchesGenre
	})

	const genres = ['all', ...new Set(tracks.map((t) => t.genre))]

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">{currentProfile.name}'s Tracks</h1>
					<p className="mt-1 text-sm text-gray-500">Manage and share your music library</p>
				</div>
				<button
					type="button"
					onClick={handleUpload}
					className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
				>
					<PlusIcon className="h-5 w-5 mr-1.5"/>
					Upload Track
				</button>
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
							placeholder="Search tracks..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
						/>
					</div>
				</div>

				{/* Genre Filter */}
				<div className="sm:w-48">
					<select
						value={filterGenre}
						onChange={(e) => setFilterGenre(e.target.value)}
						className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
					>
						{genres.map((genre) => (
							<option key={genre} value={genre}>
								{genre === 'all' ? 'All Genres' : genre}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Stats */}
			{!isLoading && (
				<div className="flex items-center space-x-6 text-sm text-gray-500">
					<span>
						<span className="font-medium text-gray-900">{filteredTracks.length}</span> tracks
					</span>
					<span>
						<span
							className="font-medium text-gray-900">{tracks.reduce((sum, t) => sum + t.playCount, 0)}</span>{' '}
						total plays
					</span>
					<span>
						<span
							className="font-medium text-gray-900">{tracks.reduce((sum, t) => sum + t.downloadCount, 0)}</span>{' '}
						total downloads
					</span>
				</div>
			)}

			{/* Track List */}
			<TrackList tracks={filteredTracks} isLoading={isLoading} onPlay={handlePlay} onDownload={handleDownload}/>
		</div>
	)
}
