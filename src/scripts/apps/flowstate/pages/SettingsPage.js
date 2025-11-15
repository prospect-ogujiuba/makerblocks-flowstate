import {useState} from 'react'
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import {useApp} from '../context/AppContext'
import {UserCircleIcon, BellIcon, EnvelopeIcon, LockClosedIcon} from '@heroicons/react/24/outline'
import Badge from '../components/shared/Badge'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function SettingsPage() {
	const {currentProfile, currentUser, addNotification} = useApp()

	// Profile form state
	const [isEditingProfile, setIsEditingProfile] = useState(false)
	const [firstName, setFirstName] = useState(currentProfile?.firstName || '')
	const [lastName, setLastName] = useState(currentProfile?.lastName || '')
	const [email, setEmail] = useState(currentProfile?.email || '')
	const [bio, setBio] = useState(currentUser?.bio || '')

	// Settings state
	const [emailNotifications, setEmailNotifications] = useState(true)
	const [pushNotifications, setPushNotifications] = useState(true)
	const [newsletter, setNewsletter] = useState(false)
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const handleSaveProfile = (e) => {
		e.preventDefault()
		// In production, this would make an API call to update the user profile
		addNotification({
			title: 'Profile Updated',
			message: 'Your profile has been successfully updated.',
			type: 'success'
		})
		setIsEditingProfile(false)
	}

	const handleCancelProfile = () => {
		// Reset form to original values
		setFirstName(currentProfile?.firstName || '')
		setLastName(currentProfile?.lastName || '')
		setEmail(currentProfile?.email || '')
		setBio(currentUser?.bio || '')
		setIsEditingProfile(false)
	}

	const handleSaveNotifications = (e) => {
		e.preventDefault()
		// In production, this would make an API call to update notification settings
		addNotification({
			title: 'Settings Saved',
			message: 'Your notification preferences have been updated.',
			type: 'success'
		})
	}

	const handleChangePassword = (e) => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			addNotification({
				title: 'Password Mismatch',
				message: 'New password and confirmation do not match.',
				type: 'error'
			})
			return
		}

		if (newPassword.length < 8) {
			addNotification({
				title: 'Weak Password',
				message: 'Password must be at least 8 characters long.',
				type: 'warning'
			})
			return
		}

		// In production, this would make an API call to change password
		addNotification({
			title: 'Password Changed',
			message: 'Your password has been successfully updated.',
			type: 'success'
		})
		setCurrentPassword('')
		setNewPassword('')
		setConfirmPassword('')
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Settings</h1>
				<p className="mt-1 text-sm text-gray-500">
					Manage your account settings and preferences
				</p>
			</div>

			{/* Tabs */}
			<TabGroup>
				<TabList className="flex space-x-1 border-b border-gray-200">
					<Tab
						className={({selected}) =>
							classNames(
								'w-full py-2.5 px-4 text-sm font-medium leading-5',
								'border-b-2 focus:outline-none',
								selected
									? 'border-slate-600 text-slate-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							)
						}
					>
						<div className="flex items-center justify-center gap-2">
							<UserCircleIcon className="h-5 w-5"/>
							<span>Profile</span>
						</div>
					</Tab>
					<Tab
						className={({selected}) =>
							classNames(
								'w-full py-2.5 px-4 text-sm font-medium leading-5',
								'border-b-2 focus:outline-none',
								selected
									? 'border-slate-600 text-slate-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							)
						}
					>
						<div className="flex items-center justify-center gap-2">
							<BellIcon className="h-5 w-5"/>
							<span>Settings</span>
						</div>
					</Tab>
				</TabList>

				<TabPanels className="mt-6">
					{/* Profile Tab */}
					<TabPanel>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Current Profile Display */}
							<div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
								<h3 className="text-base font-semibold text-gray-900 mb-6">Current Profile</h3>

								<div className="space-y-6">
									{/* Avatar */}
									<div className="flex items-center gap-4">
										<img
											src={currentProfile?.profileImage || `${siteData.siteUrl}/wp-content/plugins/makerblocks/assets/images/extras/placeholder-account-image.png`}
											alt="Profile"
											className="h-20 w-20 rounded-full bg-gray-50 ring-2 ring-gray-200"
										/>
										<div>
											<p className="text-sm font-medium text-gray-900">
												{currentProfile?.name || 'User'}
											</p>
											<p className="text-sm text-gray-500">{currentProfile?.email}</p>
										</div>
									</div>

									{/* User Details */}
									<div className="space-y-3">
										<div>
											<p className="text-xs font-medium text-gray-500 uppercase">Full Name</p>
											<p className="mt-1 text-sm text-gray-900">
												{currentProfile?.firstName} {currentProfile?.lastName}
											</p>
										</div>

										<div>
											<p className="text-xs font-medium text-gray-500 uppercase">Email</p>
											<p className="mt-1 text-sm text-gray-900">{currentProfile?.email}</p>
										</div>

										<div>
											<p className="text-xs font-medium text-gray-500 uppercase">User Type</p>
											<p className="mt-1 text-sm text-gray-900 capitalize">
												{currentUser?.userType || 'Producer'}
											</p>
										</div>

										{currentUser?.membershipType && (
											<div>
												<p className="text-xs font-medium text-gray-500 uppercase">Membership</p>
												<div className="mt-1">
													<Badge variant={currentUser.isPioneer ? 'pioneer' : 'default'}>
														{currentUser.membershipType}
													</Badge>
												</div>
											</div>
										)}

										{currentUser?.contributionScore !== undefined && (
											<div>
												<p className="text-xs font-medium text-gray-500 uppercase">Contribution Score</p>
												<p className="mt-1 text-sm font-semibold text-slate-600">
													{currentUser.contributionScore}
												</p>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Edit Profile Form */}
							<div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
								<form onSubmit={handleSaveProfile}>
									<div className="px-6 py-6">
										<h3 className="text-base font-semibold text-gray-900 mb-6">Edit Profile</h3>

										<div className="space-y-6">
											{/* First Name */}
											<div>
												<label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
													First Name
												</label>
												<div className="mt-2">
													<input
														type="text"
														id="first-name"
														value={firstName}
														onChange={(e) => {
															setFirstName(e.target.value)
															setIsEditingProfile(true)
														}}
														className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm"
													/>
												</div>
											</div>

											{/* Last Name */}
											<div>
												<label htmlFor="last-name" className="block text-sm font-medium text-gray-900">
													Last Name
												</label>
												<div className="mt-2">
													<input
														type="text"
														id="last-name"
														value={lastName}
														onChange={(e) => {
															setLastName(e.target.value)
															setIsEditingProfile(true)
														}}
														className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm"
													/>
												</div>
											</div>

											{/* Email */}
											<div>
												<label htmlFor="email" className="block text-sm font-medium text-gray-900">
													Email Address
												</label>
												<div className="mt-2">
													<input
														type="email"
														id="email"
														value={email}
														onChange={(e) => {
															setEmail(e.target.value)
															setIsEditingProfile(true)
														}}
														className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm"
													/>
												</div>
											</div>

											{/* Bio */}
											<div>
												<label htmlFor="bio" className="block text-sm font-medium text-gray-900">
													Bio
												</label>
												<div className="mt-2">
													<textarea
														id="bio"
														rows={4}
														value={bio}
														onChange={(e) => {
															setBio(e.target.value)
															setIsEditingProfile(true)
														}}
														placeholder="Tell us about yourself..."
														className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm"
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Form Actions */}
									<div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-6 py-4">
										<button
											type="button"
											onClick={handleCancelProfile}
											disabled={!isEditingProfile}
											className="text-sm font-semibold text-gray-900 disabled:text-gray-400"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={!isEditingProfile}
											className="rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
										>
											Save Changes
										</button>
									</div>
								</form>
							</div>
						</div>
					</TabPanel>

					{/* Settings Tab */}
					<TabPanel>
						<div className="space-y-6">
							{/* App Settings Section */}
							<div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
								<form onSubmit={handleSaveNotifications}>
									<div className="px-6 py-6">
										<div className="flex items-center gap-2 mb-4">
											<BellIcon className="h-5 w-5 text-gray-600"/>
											<h3 className="text-base font-semibold text-gray-900">Notification Preferences</h3>
										</div>

										<div className="space-y-4">
											{/* Email Notifications */}
											<div className="flex items-start">
												<div className="flex h-6 items-center">
													<input
														id="email-notifications"
														type="checkbox"
														checked={emailNotifications}
														onChange={(e) => setEmailNotifications(e.target.checked)}
														className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600"
													/>
												</div>
												<div className="ml-3">
													<label htmlFor="email-notifications" className="text-sm font-medium text-gray-900">
														Email Notifications
													</label>
													<p className="text-sm text-gray-500">
														Receive email notifications about new tracks, placements, and opportunities.
													</p>
												</div>
											</div>

											{/* Push Notifications */}
											<div className="flex items-start">
												<div className="flex h-6 items-center">
													<input
														id="push-notifications"
														type="checkbox"
														checked={pushNotifications}
														onChange={(e) => setPushNotifications(e.target.checked)}
														className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600"
													/>
												</div>
												<div className="ml-3">
													<label htmlFor="push-notifications" className="text-sm font-medium text-gray-900">
														Push Notifications
													</label>
													<p className="text-sm text-gray-500">
														Get instant notifications in your browser.
													</p>
												</div>
											</div>

											{/* Newsletter */}
											<div className="flex items-start">
												<div className="flex h-6 items-center">
													<input
														id="newsletter"
														type="checkbox"
														checked={newsletter}
														onChange={(e) => setNewsletter(e.target.checked)}
														className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600"
													/>
												</div>
												<div className="ml-3">
													<label htmlFor="newsletter" className="text-sm font-medium text-gray-900">
														Newsletter Subscription
													</label>
													<p className="text-sm text-gray-500">
														Receive weekly updates and industry insights.
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-6 py-4">
										<button
											type="submit"
											className="rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-500 transition-colors"
										>
											Save Preferences
										</button>
									</div>
								</form>
							</div>

							{/* Account Settings Section */}
							<div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
								<form onSubmit={handleChangePassword}>
									<div className="px-6 py-6">
										<div className="flex items-center gap-2 mb-4">
											<LockClosedIcon className="h-5 w-5 text-gray-600"/>
											<h3 className="text-base font-semibold text-gray-900">Change Password</h3>
										</div>

										<div className="space-y-4">
											{/* Current Password */}
											<div>
												<label htmlFor="current-password" className="block text-sm font-medium text-gray-900">
													Current Password
												</label>
												<div className="mt-2">
													<input
														type="password"
														id="current-password"
														value={currentPassword}
														onChange={(e) => setCurrentPassword(e.target.value)}
														className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm"
													/>
												</div>
											</div>

											{/* New Password */}
											<div>
												<label htmlFor="new-password" className="block text-sm font-medium text-gray-900">
													New Password
												</label>
												<div className="mt-2">
													<input
														type="password"
														id="new-password"
														value={newPassword}
														onChange={(e) => setNewPassword(e.target.value)}
														className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm"
													/>
												</div>
												<p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long.</p>
											</div>

											{/* Confirm Password */}
											<div>
												<label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
													Confirm New Password
												</label>
												<div className="mt-2">
													<input
														type="password"
														id="confirm-password"
														value={confirmPassword}
														onChange={(e) => setConfirmPassword(e.target.value)}
														className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm"
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 px-6 py-4">
										<button
											type="submit"
											disabled={!currentPassword || !newPassword || !confirmPassword}
											className="rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
										>
											Update Password
										</button>
									</div>
								</form>
							</div>
						</div>
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</div>
	)
}
