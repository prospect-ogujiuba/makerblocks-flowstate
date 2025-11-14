import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import TrackCard from './TrackCard'
import EmptyState from '../shared/EmptyState'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function TrackList({ tracks, isLoading, onPlay, onDownload, onUpload }) {
	if (isLoading) {
		return <LoadingSpinner size="lg" className="py-12" />
	}

	if (!tracks || tracks.length === 0) {
		return (
			<EmptyState
				icon={MusicalNoteIcon}
				title="No tracks yet"
				description="Upload your first track to get started."
				actionLabel={onUpload ? 'Upload Track' : null}
				onAction={onUpload}
			/>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{tracks.map((track) => (
				<TrackCard key={track.id} track={track} onPlay={onPlay} onDownload={onDownload} />
			))}
		</div>
	)
}
