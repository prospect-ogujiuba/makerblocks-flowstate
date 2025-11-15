import {AppProvider, useApp} from './context/AppContext'
import DashboardLayout from './layouts/DashboardLayout'
import Lander from './pages/Lander'
import LoadingSpinner from './components/shared/LoadingSpinner'

function FlowStateContent() {
	const {isAuthenticated, isLoading, loginUrl, registrationUrl} = useApp()

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-950">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	return isAuthenticated
		? <DashboardLayout />
		: <Lander loginUrl={loginUrl} registrationUrl={registrationUrl} />
}

export default function FlowState(props) {
	return (
		<AppProvider {...props}>
			<FlowStateContent />
		</AppProvider>
	)
}
