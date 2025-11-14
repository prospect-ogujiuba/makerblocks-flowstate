import {AppProvider} from './context/AppContext'
import DashboardLayout from './layouts/DashboardLayout'

export default function FlowState(props) {
	return (
		<AppProvider {...props}>
			<DashboardLayout {...props}/>
		</AppProvider>
	)
}
