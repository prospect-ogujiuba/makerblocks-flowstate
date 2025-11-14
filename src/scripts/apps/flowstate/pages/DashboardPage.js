import { useEffect, useState } from 'react'
import {
	MusicalNoteIcon,
	BriefcaseIcon,
	AcademicCapIcon,
	UserGroupIcon,
	ChartBarIcon,
	ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import StatCard from '../components/stats/StatCard'
import ContributionScore from '../components/stats/ContributionScore'
import TrackList from '../components/tracks/TrackList'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function DashboardPage() {
	const { currentUser, isLoading: userLoading } = useApp()
	const [stats, setStats] = useState(null)
	const [recentTracks, setRecentTracks] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!userLoading && currentUser) {
			fetchDashboardData()
		}
	}, [userLoading, currentUser])

	const fetchDashboardData = async () => {
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			setStats({
				totalTracks: 24,
				totalPlacements: 8,
				totalDownloads: 156,
				enrolledMasterclasses: 3,
			})

			// Mock recent tracks
			setRecentTracks([
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
			])

			setIsLoading(false)
		}, 800)
	}

	if (userLoading || isLoading) {
		return <LoadingSpinner size="lg" className="py-12" />
	}

	const scoreBreakdown = {
		tracks: { count: stats.totalTracks, points: stats.totalTracks * 5 },
		placements: { count: stats.totalPlacements, points: stats.totalPlacements * 20 },
		masterclasses: { count: 2, points: 100 },
	}

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.firstName}!</h1>
				<p className="mt-1 text-sm text-gray-500">Here's what's happening with your music today.</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard name="Total Tracks" value={stats.totalTracks} icon={MusicalNoteIcon} change="+3 this month" />
				<StatCard name="Placements" value={stats.totalPlacements} icon={BriefcaseIcon} change="+2 this month" />
				<StatCard name="Total Downloads" value={stats.totalDownloads} icon={ArrowTrendingUpIcon} change="+12%" />
				<StatCard
					name="Masterclasses"
					value={stats.enrolledMasterclasses}
					icon={AcademicCapIcon}
					change="+1 this week"
				/>
			</div>

			{/* Contribution Score */}
			<ContributionScore
				score={currentUser?.contributionScore || 0}
				breakdown={scoreBreakdown}
				membershipType={currentUser?.membershipType}
			/>

			{/* Recent Activity */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900">Recent Tracks</h2>
					<a href="#/tracks" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
						View all
					</a>
				</div>
				<TrackList tracks={recentTracks} isLoading={false} onPlay={(track) => console.log('Play:', track)} />
			</div>

			{/* Quick Actions */}
			<div className="rounded-lg bg-indigo-50 p-6">
				<h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
					<a
						href="#/tracks/upload"
						className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
					>
						Upload New Track
					</a>
					<a
						href="#/placements/new"
						className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>
						Record Placement
					</a>
					<a
						href="#/masterclasses"
						className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>
						Browse Masterclasses
					</a>
				</div>
			</div>
		</div>
	)
}
