import {createContext, useContext, useState, useEffect} from 'react'

const AppContext = createContext(undefined)

export function AppProvider({children, currentProfile, loginUrl, registrationUrl, logoutUrl}) {
	const [currentUser, setCurrentUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [notifications, setNotifications] = useState([])

	// Compute authentication state based on currentProfile from WordPress
	const isAuthenticated = !!currentProfile?.email

	useEffect(() => {
		// If user is authenticated (WordPress provided currentProfile), use it
		// Otherwise, set currentUser to null (unauthenticated state)
		setTimeout(() => {
			if (isAuthenticated) {
				// Map WordPress currentProfile to our user structure
				const user = {
					id: currentProfile.id || 1,
					email: currentProfile.email,
					firstName: currentProfile.firstName || '',
					lastName: currentProfile.lastName || '',
					displayName: currentProfile.name || currentProfile.email,
					profileImage: currentProfile.profileImage || '',
					// Additional fields can be added as WordPress provides them
					userType: currentProfile.userType || 'producer',
					isPioneer: currentProfile.isPioneer || false,
					isFounder: currentProfile.isFounder || false,
					isBoardMember: currentProfile.isBoardMember || false,
					contributionScore: currentProfile.contributionScore || 0,
					membershipType: currentProfile.membershipType || 'standard',
				}
				setCurrentUser(user)
			} else {
				setCurrentUser(null)
			}
			setIsLoading(false)
		}, 500)
	}, [currentProfile, isAuthenticated])

	const addNotification = (notification) => {
		const id = Date.now()
		setNotifications((prev) => [...prev, {...notification, id}])

		// Auto-remove after 5 seconds
		setTimeout(() => {
			removeNotification(id)
		}, 5000)
	}

	const removeNotification = (id) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id))
	}

	const value = {
		currentUser,
		setCurrentUser,
		isLoading,
		isAuthenticated,
		notifications,
		addNotification,
		removeNotification,
		currentProfile,
		loginUrl,
		registrationUrl,
		logoutUrl
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
	const context = useContext(AppContext)
	if (context === undefined) {
		throw new Error('useApp must be used within an AppProvider')
	}
	return context
}
