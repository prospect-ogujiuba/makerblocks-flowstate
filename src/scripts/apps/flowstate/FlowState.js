import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {AppProvider, useApp} from './context/AppContext'
import DashboardLayout from './layouts/DashboardLayout'
import Lander from './pages/Lander'
import LoadingSpinner from './components/shared/LoadingSpinner'
import DashboardPage from './pages/DashboardPage'
import TracksPage from './pages/TracksPage'
import PlacementsPage from './pages/PlacementsPage'
import MasterclassesPage from './pages/MasterclassesPage'
import WorkshopsPage from './pages/WorkshopsPage'
import SyncOpportunitiesPage from './pages/SyncOpportunitiesPage'
import SettingsPage from './pages/SettingsPage'

function FlowStateContent() {
	const {isAuthenticated, isLoading, loginUrl, registrationUrl} = useApp()

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-950">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Lander loginUrl={loginUrl} registrationUrl={registrationUrl} />
	}

	return (
		<BrowserRouter basename="/">
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route element={<DashboardLayout />}>
					<Route path="/" element={<DashboardPage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/tracks" element={<TracksPage />} />
					<Route path="/placements" element={<PlacementsPage />} />
					<Route path="/masterclasses" element={<MasterclassesPage />} />
					<Route path="/workshops" element={<WorkshopsPage />} />
					<Route path="/sync" element={<SyncOpportunitiesPage />} />
					<Route path="/profile" element={<SettingsPage />} />
					<Route path="*" element={<Navigate to="/dashboard" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default function FlowState(props) {
	return (
		<AppProvider {...props}>
			<FlowStateContent />
		</AppProvider>
	)
}
