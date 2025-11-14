import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(undefined)

export function AppProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [notifications, setNotifications] = useState([])

	useEffect(() => {
		// Simulate fetching current user
		// In production, this would be an API call
		const mockUser = {
			id: 1,
			uuid: '123e4567-e89b-12d3-a456-426614174000',
			email: 'tom@example.com',
			firstName: 'Tom',
			lastName: 'Cook',
			displayName: 'Tom Cook',
			userType: 'producer',
			isPioneer: true,
			isFounder: false,
			isBoardMember: false,
			contributionScore: 245,
			membershipType: 'pioneer',
		}

		setTimeout(() => {
			setCurrentUser(mockUser)
			setIsLoading(false)
		}, 500)
	}, [])

	const addNotification = (notification) => {
		const id = Date.now()
		setNotifications((prev) => [...prev, { ...notification, id }])

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
		notifications,
		addNotification,
		removeNotification,
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
