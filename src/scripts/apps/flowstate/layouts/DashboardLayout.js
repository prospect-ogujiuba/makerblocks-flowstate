'use client'

import {useState} from 'react'
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	TransitionChild,
} from '@headlessui/react'
import {
	Bars3Icon,
	BellIcon,
	CalendarIcon,
	ChartPieIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
	UsersIcon,
	XMarkIcon,
	MusicalNoteIcon,
	BriefcaseIcon,
	AcademicCapIcon,
	SparklesIcon,
} from '@heroicons/react/24/outline'
import {ChevronDownIcon, MagnifyingGlassIcon} from '@heroicons/react/20/solid'
import {useApp} from '../context/AppContext'
import DashboardPage from '../pages/DashboardPage'
import TracksPage from '../pages/TracksPage'
import PlacementsPage from '../pages/PlacementsPage'
import MasterclassesPage from '../pages/MasterclassesPage'
import WorkshopsPage from '../pages/WorkshopsPage'
import SyncOpportunitiesPage from '../pages/SyncOpportunitiesPage'

const navigation = [
	{name: 'Dashboard', href: 'dashboard', icon: HomeIcon, component: DashboardPage},
	{name: 'Tracks', href: 'tracks', icon: MusicalNoteIcon, component: TracksPage},
	{name: 'Placements', href: 'placements', icon: BriefcaseIcon, component: PlacementsPage},
	{name: 'Masterclasses', href: 'masterclasses', icon: AcademicCapIcon, component: MasterclassesPage},
	{name: 'Workshops', href: 'workshops', icon: UsersIcon, component: WorkshopsPage},
	{name: 'Sync Opportunities', href: 'sync', icon: SparklesIcon, component: SyncOpportunitiesPage},
]

const userNavigation = [
	{name: 'Your profile', href: '/wp-admin'},
	{name: 'Settings', href: '/wp-admin'},
	{name: 'Sign out', href: '#'},
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout() {
	const {currentProfile, currentUser, notifications, removeNotification} = useApp()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [currentPage, setCurrentPage] = useState('dashboard')

	const handleNavigation = (href) => {
		setCurrentPage(href)
		setSidebarOpen(false)
	}

	const currentNavItem = navigation.find((item) => item.href === currentPage)
	const PageComponent = currentNavItem?.component || DashboardPage

	return (
		<>
			<div>
				<Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
					<DialogBackdrop
						transition
						className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
					/>

					<div className="fixed inset-0 flex">
						<DialogPanel
							transition
							className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
						>
							<TransitionChild>
								<div
									className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
									<button type="button" onClick={() => setSidebarOpen(false)}
											className="-m-2.5 p-2.5">
										<span className="sr-only">Close sidebar</span>
										<XMarkIcon aria-hidden="true" className="size-6 text-white"/>
									</button>
								</div>
							</TransitionChild>

							<div
								className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
								<div className="flex h-16 shrink-0 items-center">
									<span className="text-xl font-bold text-white">FlowState</span>
								</div>
								<nav className="flex flex-1 flex-col">
									<ul role="list" className="-mx-2 flex-1 space-y-1">
										{navigation.map((item) => (
											<li key={item.name}>
												<button
													onClick={() => handleNavigation(item.href)}
													className={classNames(
														currentPage === item.href
															? 'bg-gray-800 text-white'
															: 'text-gray-400 hover:bg-gray-800 hover:text-white',
														'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold w-full text-left',
													)}
												>
													<item.icon aria-hidden="true" className="size-6 shrink-0"/>
													{item.name}
												</button>
											</li>
										))}
									</ul>
								</nav>
							</div>
						</DialogPanel>
					</div>
				</Dialog>

				{/* Static sidebar for desktop */}
				<div
					className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
					<div className="relative flex h-16 shrink-0 items-center justify-center">
						<img
							alt={siteData.siteName}
							src={`${siteData.siteUrl}/wp-content/uploads/flowstate-final-white.png`}
							className="h-12 w-auto"
						/>
					</div>
					<nav className="relative mt-8">
						<ul role="list" className="flex flex-col items-center space-y-1">
							{navigation.map((item) => (
								<li key={item.name}>
									<button
										onClick={() => handleNavigation(item.href)}
										className={classNames(
											currentPage === item.href
												? 'bg-white/5 text-white'
												: 'text-gray-400 hover:bg-white/5 hover:text-white',
											'group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold',
										)}
									>
										<item.icon aria-hidden="true" className="size-6 shrink-0"/>
										<span className="sr-only">{item.name}</span>
									</button>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="lg:pl-20">
					<div
						className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
						<button type="button" onClick={() => setSidebarOpen(true)}
								className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
							<span className="sr-only">Open sidebar</span>
							<Bars3Icon aria-hidden="true" className="size-6"/>
						</button>

						{/* Separator */}
						<div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden"/>

						<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
							<form action="#" method="GET" className="grid flex-1 grid-cols-1">
								<input
									name="search"
									placeholder="Search"
									aria-label="Search"
									className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
								/>
								<MagnifyingGlassIcon
									aria-hidden="true"
									className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
								/>
							</form>
							<div className="flex items-center gap-x-4 lg:gap-x-6">
								{/* Notifications */}
								<Menu as="div" className="relative">
									<MenuButton className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
										<span className="sr-only">View notifications</span>
										<BellIcon aria-hidden="true" className="size-6"/>
										{notifications.length > 0 && (
											<span
												className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"/>
										)}
									</MenuButton>
									<MenuItems
										transition
										className="absolute right-0 z-10 mt-2.5 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
									>
										{notifications.length === 0 ? (
											<div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
										) : (
											notifications.map((notification) => (
												<MenuItem key={notification.id}>
													<div
														className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50">
														<div className="font-medium">{notification.title}</div>
														<div className="text-gray-500">{notification.message}</div>
													</div>
												</MenuItem>
											))
										)}
									</MenuItems>
								</Menu>

								{/* Separator */}
								<div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"/>

								{/* Profile dropdown */}
								<Menu as="div" className="relative">
									<MenuButton className="relative flex items-center">
										<span className="absolute -inset-1.5"/>
										<span className="sr-only">Open user menu</span>
										<img
											alt=""
											src={currentProfile.profileImage || `${siteData.siteUrl}/wp-content/plugins/makerblocks/assets/images/extras/placeholder-account-image.png`}
											className="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5"
										/>
										<span className="hidden lg:flex lg:items-center">
											<span aria-hidden="true"
												  className="ml-4 text-sm/6 font-semibold text-gray-900">
												{currentProfile.name || 'User'}
											</span>
											<ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400"/>
										</span>
									</MenuButton>
									<MenuItems
										transition
										className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
									>
										{userNavigation.map((item) => (
											<MenuItem key={item.name}>
												<a
													href={item.href}
													className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
												>
													{item.name}
												</a>
											</MenuItem>
										))}
									</MenuItems>
								</Menu>
							</div>
						</div>
					</div>

					<main className="py-10">
						<div className="px-4 sm:px-6 lg:px-8">
							<PageComponent/>
						</div>
					</main>
				</div>
			</div>
		</>
	)
}


