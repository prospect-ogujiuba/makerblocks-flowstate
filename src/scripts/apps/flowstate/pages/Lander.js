import {useState} from 'react'
import {useApp} from '../context/AppContext'
import AuthButtons from '../components/shared/AuthButtons'
import StatCard from '../components/stats/StatCard'
import TrackCard from '../components/tracks/TrackCard'
import MasterclassCard from '../components/masterclasses/MasterclassCard'
import SyncOpportunityCard from '../components/sync/SyncOpportunityCard'
import {
	MusicalNoteIcon,
	BriefcaseIcon,
	AcademicCapIcon,
	SparklesIcon,
	ArrowRightIcon,
	ChartBarIcon,
	UsersIcon, MapPinIcon
} from '@heroicons/react/24/outline'

// Landing page header component
function LandingHeader({isAuthenticated, loginUrl, registrationUrl}) {
	const scrollToSection = (id) => {
		const element = document.getElementById(id)
		if (element) {
			element.scrollIntoView({behavior: 'smooth', block: 'start'})
		}
	}

	return (
		<header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b py-2 border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex items-center space-x-3">
						<img
							alt={siteData.siteName}
							src={`${siteData.siteUrl}/wp-content/uploads/flowstate-txt-wht.png`}
							className="h-6"
						/>
					</div>

					{/* Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<button
							onClick={() => scrollToSection('overview')}
							className="text-sm text-slate-300 hover:text-white transition-colors"
						>
							Overview
						</button>
						<button
							onClick={() => scrollToSection('showcase')}
							className="text-sm text-slate-300 hover:text-white transition-colors"
						>
							Platform
						</button>
						<button
							onClick={() => scrollToSection('features')}
							className="text-sm text-slate-300 hover:text-white transition-colors"
						>
							Features
						</button>
						<button
							onClick={() => scrollToSection('roadmap')}
							className="text-sm text-slate-300 hover:text-white transition-colors"
						>
							Roadmap
						</button>
					</nav>

					{/* Auth Buttons or Dashboard Link */}
					<div className="flex items-center space-x-4">
						{isAuthenticated ? (
							<a
								href="#dashboard"
								onClick={(e) => {
									e.preventDefault()
									window.location.reload()
								}}
								className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors duration-200"
							>
								Go to Dashboard
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</a>
						) : (
							<>
								<div className="flex justify-center">
									<AuthButtons
										loginUrl={loginUrl}
										registrationUrl={registrationUrl}
									/>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}

export default function Lander({loginUrl, registrationUrl}) {
	const {isAuthenticated, currentUser} = useApp()
	const currentYear = new Date().getFullYear()
	const [activeShowcase, setActiveShowcase] = useState('tracks')

	// Sample data for component previews
	const sampleTracks = [
		{
			id: 1,
			title: 'Dark Piano Ballad',
			artistName: 'J. Beats',
			genre: 'R&B',
			bpm: 85,
			keySignature: 'Am',
			durationSeconds: 195,
			status: 'active',
			playCount: 234,
			downloadCount: 47,
			isDownloadable: true,
		},
		{
			id: 2,
			title: 'Uplifting Pop Energy',
			artistName: 'Ray Carter',
			genre: 'Pop',
			bpm: 128,
			keySignature: 'C',
			durationSeconds: 182,
			status: 'active',
			playCount: 512,
			downloadCount: 89,
			isDownloadable: true,
		},
	]

	const sampleMasterclasses = [
		{
			id: 1,
			title: 'Advanced Mixing Techniques for Hip Hop',
			instructorName: 'DJ Premier',
			description: 'Learn professional mixing techniques used in top hip hop productions.',
			difficultyLevel: 'advanced',
			category: 'Mixing',
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
			durationMinutes: 210,
			enrollmentCount: 312,
			status: 'published',
			coverImageUrl: null,
		},
		{
			id: 6,
			title: 'Getting Started with Logic Pro',
			instructorName: 'Mike Thompson',
			description: 'Complete beginner guide to Logic Pro DAW.',
			difficultyLevel: 'beginner',
			category: 'DAW',
			durationMinutes: 180,
			enrollmentCount: 2341,
			status: 'published',
			coverImageUrl: null,
		},
	]

	const sampleSyncOpportunities = [
		{
			id: 1,
			title: 'High-energy Pop for Trailer',
			clientName: 'Epic Films',
			description: 'Looking for uplifting, confident pop tracks for a major film trailer campaign.',
			projectType: 'trailer',
			deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
			requiredGenre: 'Pop',
			requiredMood: 'Uplifting / Confident',
			submissionCount: 1,
			maxSubmissions: 3,
			status: 'open',
		},
		{
			id: 3,
			title: 'Indie Game Soundtrack',
			clientName: 'RapStar',
			description: 'Atmospheric electronic music for sci-fi adventure game.',
			projectType: 'game',
			deadline: '2025-01-20T23:59:59',
			requiredGenre: 'Electronic',
			requiredMood: 'Atmospheric',
			submissionCount: 23,
			maxSubmissions: 50,
			status: 'open',
		},
		{
			id: 5,
			title: 'Movie Trailer Music',
			clientName: 'Dubois Bros',
			description: 'Epic trailer music for summer blockbuster.',
			projectType: 'trailer',
			isPaid: true,
			deadline: '2024-12-01T23:59:59',
			requiredGenre: 'Cinematic',
			requiredMood: 'Epic',
			submissionCount: 67,
			maxSubmissions: 75,
			status: 'open',
		}
	]

	return (
		<main id="main" className="bg-slate-950 text-slate-200 antialiased font-sans selection:bg-emerald-300/30">
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2"
			>
				Skip to content
			</a>

			<LandingHeader isAuthenticated={isAuthenticated} loginUrl={loginUrl} registrationUrl={registrationUrl} />


			<section className="py-24 sm:py-32 flex flex-col justify-center items-center px-6 text-center">
				<div className="mb-8">
					<img
						alt={siteData.siteName}
						src={`${siteData.siteUrl}/wp-content/uploads/flowstate-final-white.png`}
						className="h-64"
					/>
				</div>

				<div className="max-w-[70ch]">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-50">
						Music Management and Artist Development
					</h1>

					<p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
						Manage tracks, placements, artist development, and collaborations in one powerful platform.
					</p>

					<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
						{!isAuthenticated ? (
							<>
								<button
									disabled
									className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-slate-400 font-semibold shadow-sm"
								>
									Registration (Coming Soon)
								</button>
								<a
									href={loginUrl}
									className="inline-flex items-center justify-center rounded-lg bg-white/10 border border-white px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-white/15 transition-colors duration-200"
								>
									Log In
								</a>
							</>
						) : (
							<a
								href="#dashboard"
								onClick={(e) => {
									e.preventDefault()
									window.location.reload()
								}}
								className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all duration-200 hover:scale-105"
							>
								Go to Dashboard
								<ArrowRightIcon className="ml-2 h-5 w-5" />
							</a>
						)}
					</div>
				</div>
			</section>

			{/* Stats Preview */}
			<section className="py-12 sm:py-16 bg-slate-900/50 border-y border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
						<div className="overflow-hidden rounded-lg bg-slate-900/70 px-4 py-5 shadow-xs sm:p-6 ring-1 ring-white/10">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="rounded-md bg-emerald-500/20 p-3">
										<MusicalNoteIcon className="h-6 w-6 text-emerald-300" aria-hidden="true" />
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dt className="truncate text-sm font-medium text-slate-400">Track Uploads</dt>
								</div>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg bg-slate-900/70 px-4 py-5 shadow-xs sm:p-6 ring-1 ring-white/10">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="rounded-md bg-violet-500/20 p-3">
										<BriefcaseIcon className="h-6 w-6 text-violet-300" aria-hidden="true" />
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dt className="truncate text-sm font-medium text-slate-400">Placements</dt>
								</div>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg bg-slate-900/70 px-4 py-5 shadow-xs sm:p-6 ring-1 ring-white/10">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="rounded-md bg-blue-500/20 p-3">
										<MapPinIcon className="h-6 w-6 text-blue-300" aria-hidden="true" />
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dt className="truncate text-sm font-medium text-slate-400">Hub Activations</dt>
								</div>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg bg-slate-900/70 px-4 py-5 shadow-xs sm:p-6 ring-1 ring-white/10">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="rounded-md bg-amber-500/20 p-3">
										<UsersIcon className="h-6 w-6 text-amber-300" aria-hidden="true" />
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dt className="truncate text-sm font-medium text-slate-400">Active Producers</dt>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Platform Showcase */}
			<section id="showcase" className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50">
							See the Platform in Action
						</h2>
						<p className="mt-4 text-lg text-slate-300">
							Real components from the FlowState dashboard—manage your entire music career in one place.
						</p>
					</div>

					{/* Showcase Tabs */}
					<div className="flex flex-wrap justify-center gap-3 mb-12">
						<button
							onClick={() => setActiveShowcase('tracks')}
							className={`inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
								activeShowcase === 'tracks'
									? 'bg-slate-600 text-white border border-white shadow-lg'
									: 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 ring-1 ring-white/10'
							}`}
						>
							<MusicalNoteIcon className="h-5 w-5 mr-2" />
							Track Management
						</button>
						<button
							onClick={() => setActiveShowcase('masterclasses')}
							className={`inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
								activeShowcase === 'masterclasses'
									? 'bg-slate-600 text-white border border-white shadow-lg'
									: 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 ring-1 ring-white/10'
							}`}
						>
							<AcademicCapIcon className="h-5 w-5 mr-2" />
							Masterclasses
						</button>
						<button
							onClick={() => setActiveShowcase('sync')}
							className={`inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
								activeShowcase === 'sync'
									? 'bg-slate-600 text-white border border-white shadow-lg'
									: 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 ring-1 ring-white/10'
							}`}
						>
							<SparklesIcon className="h-5 w-5 mr-2" />
							Sync Opportunities
						</button>
					</div>

					{/* Dynamic Showcase Content */}
					<div className="min-h-[400px]">
						{activeShowcase === 'tracks' && (
							<div className="animate-fadeIn">
								<div className="mb-8 text-center max-w-3xl mx-auto">
									<h3 className="text-2xl font-bold text-slate-50 mb-3">
										Comprehensive Track Management
									</h3>
									<p className="text-slate-300">
										Upload, organize, and track every aspect of your music catalog.
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{sampleTracks.map((track) => (
										<TrackCard key={track.id} track={track} />
									))}
								</div>
							</div>
						)}

						{activeShowcase === 'masterclasses' && (
							<div className="animate-fadeIn">
								<div className="mb-8 text-center max-w-3xl mx-auto">
									<h3 className="text-2xl font-bold text-slate-50 mb-3">
										Education & Professional Development
									</h3>
									<p className="text-slate-300">
										Learn from industry professionals through structured masterclasses, workshops, and sound camps.
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
									{sampleMasterclasses.map((masterclass) => (
										<MasterclassCard key={masterclass.id} masterclass={masterclass} />
									))}
								</div>
							</div>
						)}

						{activeShowcase === 'sync' && (
							<div className="animate-fadeIn">
								<div className="mb-8 text-center max-w-3xl mx-auto">
									<h3 className="text-2xl font-bold text-slate-50 mb-3">
										Licensing & Revenue Opportunities
									</h3>
									<p className="text-slate-300">
										Submit your tracks to licensing opportunities and track placements from vetted industry partners.
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
									{sampleSyncOpportunities.map((opportunity) => (
										<SyncOpportunityCard key={opportunity.id} opportunity={opportunity} />
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-16 sm:py-20 border-t border-white/10 bg-slate-900/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
						A Full-Stack Producer Economy
					</h2>
					<p className="mt-4 max-w-[75ch] text-base leading-relaxed text-slate-300">
						FlowState is a transparent ecosystem where musicians upload tracks, enroll in programs, submit
						to sync opportunities, track placements, and manage financial outcomes. Every step—contribution,
						enrollment, placement, transaction—is logged for clarity and audit.
					</p>

					<div className="mt-10 grid md:grid-cols-3 gap-6">
						<div className="rounded-2xl p-6 ring-1 ring-white/15 bg-slate-900/70">
							<p className="text-[11px] uppercase tracking-widest text-emerald-300 mb-2">Foundation</p>
							<h3 className="text-lg font-semibold text-slate-50">Users &amp; Roles</h3>
							<p className="mt-2 text-sm text-slate-300">
								Producers, artists, partners, investors with role-based permissions and secure authentication.
							</p>
						</div>
						<div className="rounded-2xl p-6 ring-1 ring-white/15 bg-slate-900/70">
							<p className="text-[11px] uppercase tracking-widest text-emerald-300 mb-2">Content</p>
							<h3 className="text-lg font-semibold text-slate-50">Tracks &amp; Metadata</h3>
							<p className="mt-2 text-sm text-slate-300">
								Title, genre, BPM, key, file info, tags, and contribution
								logs—searchable &amp; filterable.
							</p>
						</div>
						<div className="rounded-2xl p-6 ring-1 ring-white/15 bg-slate-900/70">
							<p className="text-[11px] uppercase tracking-widest text-emerald-300 mb-2">Activity</p>
							<h3 className="text-lg font-semibold text-slate-50">Placements &amp; Revenue</h3>
							<p className="mt-2 text-sm text-slate-300">
								Budgets, statuses, media and transactions; all actions appear in audit logs.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id="producers" className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-10 items-start">
						<div>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
								Producer Profiles &amp; Analytics
							</h2>
							<p className="mt-4 text-slate-300">Producers get a profile that showcases:</p>
							<ul className="mt-4 space-y-3 text-slate-300">
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Name, bio, links, location, socials.
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Producer score (calculated from contributions).
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Upload history, track analytics, genre preferences.
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Collaboration roles (producer, engineer, mixing).
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Account status (active / inactive / banned).
								</li>
							</ul>
							<p className="mt-4 text-xs text-slate-400">
								Backed by <em>users</em>, <em>user_analytics</em>, and <em>contributions</em>.
							</p>
						</div>

						<div className="rounded-2xl p-6 bg-slate-900/70 ring-1 ring-white/15">
							<div className="flex items-center gap-3">
								<div
									className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300 to-violet-400"
									aria-hidden="true"
								/>
								<div>
									<h3 className="font-semibold text-slate-50">J. Beats</h3>
									<p className="text-sm text-slate-400">Producer, Engineer</p>
								</div>
							</div>
							<div className="mt-4 grid grid-cols-3 gap-3 text-sm">
								<div className="rounded-lg bg-slate-950 p-3 ring-1 ring-white/10">
									<p className="text-slate-400 text-xs">Uploads</p>
									<p className="font-semibold text-emerald-300">47</p>
								</div>
								<div className="rounded-lg bg-slate-950 p-3 ring-1 ring-white/10">
									<p className="text-slate-400 text-xs">Placements</p>
									<p className="font-semibold text-emerald-300">12</p>
								</div>
								<div className="rounded-lg bg-slate-950 p-3 ring-1 ring-white/10">
									<p className="text-slate-400 text-xs">Score</p>
									<p className="font-semibold text-emerald-300">88</p>
								</div>
							</div>
							<p className="mt-4 text-xs text-slate-400">
								Profile updated daily via <em>calculate_producer_score</em> routine.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id="programs" className="py-16 sm:py-20 bg-slate-900/50 border-y border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-10 items-start">
						<div className="rounded-2xl p-6 bg-slate-900/70 ring-1 ring-white/15">
							<h3 className="mt-2 text-xl font-semibold text-slate-50">
								R&amp;B Production Masterclass
							</h3>
							<p className="mt-2 text-sm text-slate-300">
								Instructor: Ray Carter • Duration: 8 weeks • Status: Open
							</p>
							<div
								className="mt-4 rounded-lg bg-slate-950 p-3 text-xs text-slate-300 ring-1 ring-white/10">
								Enrollments: 32 / 50
							</div>
							<p
								className="mt-4 inline-flex items-center text-sm text-emerald-300"
								aria-label="View details about R&B Production Masterclass"
							>
								View details →
							</p>
							<p className="mt-3 text-xs text-slate-400">
								Backed by <em>programs</em> &amp; <em>program_enrollments</em>.
							</p>
						</div>
						<div>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
								Masterclasses, Workshops &amp; Sound Camps
							</h2>
							<p className="mt-4 text-slate-300">
								Programs allow producers to learn, network, and grow through structured offerings:
							</p>
							<ul className="mt-4 space-y-3 text-slate-300">
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Program types: masterclass, workshop, sound camp.
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Instructors (linked to users), dates, capacity, enrollment status.
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Track enrollments, attendance, participation via JSON metadata.
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Program-specific contributions (e.g., teaching, organizing).
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section id="opps" className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-10 items-start">
						<div>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
								Sync Opportunities &amp; Placements
							</h2>
							<p className="mt-4 text-slate-300">
								Partners create briefs and producers submit tracks for licensing:
							</p>
							<ul className="mt-4 space-y-3 text-slate-300">
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Brief: title, description, budget, deadline, requirements (JSON).
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Privacy: public or invite-only (invite list IDs).
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Status: open → in review → closed/awarded.
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Submission caps per opportunity.
								</li>
								<li className="flex gap-3">
									<span className="w-2 h-2 mt-2 rounded-full bg-emerald-300"/>
									Transparent placement &amp; revenue records.
								</li>
							</ul>
						</div>
						<div className="rounded-2xl p-6 bg-slate-900/70 ring-1 ring-white/15">
							<div className="flex items-center justify-between">
								<span
									className="text-[11px] px-2 py-1 rounded-full bg-emerald-300/15 text-emerald-300 ring-1 ring-emerald-300/30">
									Open
								</span>
							</div>
							<h3 className="mt-3 text-xl font-semibold text-slate-50">
								High-energy Pop for Trailer
							</h3>
							<p className="mt-2 text-sm text-slate-300">
								Budget: $12,000 • Deadline: 14 days • Mood: Uplifting / Confident • Duration: :30 / :60
							</p>
							<div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
								<div className="rounded-lg bg-slate-950 p-3 ring-1 ring-white/10">
									Max submissions: 3
								</div>
								<div className="rounded-lg bg-slate-950 p-3 ring-1 ring-white/10">
									Submitted: 1
								</div>
								<div className="rounded-lg bg-slate-950 p-3 ring-1 ring-white/10">
									Private: No
								</div>
							</div>
							<p className="mt-3 text-xs text-slate-400">
								Backed by <em>sync_opportunities</em> &amp; <em>placements</em>.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id="partners" className="py-16 sm:py-20 bg-slate-900/50 border-y border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-10">
						<div>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
								Industry Partners
							</h2>
							<p className="mt-4 text-slate-300">
								Labels, publishers, agencies, brands, and platforms can open briefs, review talent, and
								track outcomes.
							</p>
							<p className="mt-3 text-xs text-slate-400">
								Backed by <em>industry_partners</em> with partnership tiers and statuses.
							</p>
						</div>
						<div id="investors">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
								Investors
							</h2>
							<p className="mt-4 text-slate-300">
								Structured reporting on placements, enrollments, and revenue events with audit logs and
								role-based access.
							</p>
							<p className="mt-3 text-xs text-slate-400">
								Backed by <em>investors</em>, <em>transactions</em>, and <em>audit_logs</em>.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id="roadmap" className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
						Roadmap
					</h2>
					<ol className="mt-8 relative border-l border-white/15 ml-3">
						<li className="pl-6 pb-8 relative">
							<span
								className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-300"
								aria-hidden="true"
							/>
							<p className="text-[11px] uppercase tracking-widest text-slate-400">Phase 1</p>
							<h3 className="font-semibold text-slate-50">Private Beta (Creators)</h3>
							<p className="text-slate-300">
								Tracks, tagging, search, roles, analytics. Producer profiles &amp; contribution scores.
							</p>
						</li>
						<li className="pl-6 pb-8 relative">
							<span
								className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-violet-400"
								aria-hidden="true"
							/>
							<p className="text-[11px] uppercase tracking-widest text-slate-400">Phase 2</p>
							<h3 className="font-semibold text-slate-50">Programs &amp; Briefs</h3>
							<p className="text-slate-300">
								Masterclasses, workshops, sound camps; sync opportunity flow; placement tracking.
							</p>
						</li>
						<li className="pl-6 relative">
							<span
								className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white/70"
								aria-hidden="true"
							/>
							<p className="text-[11px] uppercase tracking-widest text-slate-400">Phase 3</p>
							<h3 className="font-semibold text-slate-50">Revenue &amp; Partners</h3>
							<p className="text-slate-300">
								Transactions, partner portals, investor reports, advanced audit trails.
							</p>
						</li>
					</ol>
				</div>
			</section>

			<footer>
				<div className="bg-black mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500">
					&copy; {currentYear} FlowState. All rights reserved.
				</div>
			</footer>
		</main>
	)
}
