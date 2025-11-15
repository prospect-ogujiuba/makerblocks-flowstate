import { PlayIcon, ArrowDownTrayIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import Badge from '../shared/Badge'

export default function TrackCard({ track, onPlay, onDownload }) {
	const formatDuration = (seconds) => {
		if (!seconds) return '--:--'
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	const getStatusVariant = (status) => {
		const variants = {
			active: 'success',
			processing: 'warning',
			archived: 'default',
			rejected: 'danger',
		}
		return variants[status] || 'default'
	}

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow-xs hover:shadow-sm transition-shadow">
			<div className="p-4">
				<div className="flex items-start space-x-4">
					{/* Cover Art */}
					<div className="flex-shrink-0">
						{track.coverArtUrl ? (
							<img src={track.coverArtUrl} alt={track.title} className="h-16 w-16 rounded-md object-cover" />
						) : (
							<div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
								<MusicalNoteIcon className="h-8 w-8 text-gray-400" />
							</div>
						)}
					</div>

					{/* Track Info */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between">
							<div className="flex-1 min-w-0">
								<h3 className="text-sm font-semibold text-gray-900 truncate">{track.title}</h3>
								{track.artistName && <p className="text-sm text-gray-500 truncate">{track.artistName}</p>}
							</div>
							<Badge variant={getStatusVariant(track.status)} size="sm">
								{track.status}
							</Badge>
						</div>

						{/* Metadata */}
						<div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
							{track.genre && <span>{track.genre}</span>}
							{track.bpm && <span>{track.bpm} BPM</span>}
							{track.keySignature && <span>{track.keySignature}</span>}
							{track.durationSeconds && <span>{formatDuration(track.durationSeconds)}</span>}
						</div>

						{/* Stats */}
						<div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
							<span className="flex items-center">
								<PlayIcon className="h-4 w-4 mr-1" />
								{track.playCount || 0} plays
							</span>
							<span className="flex items-center">
								<ArrowDownTrayIcon className="h-4 w-4 mr-1" />
								{track.downloadCount || 0} downloads
							</span>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="mt-4 flex items-center space-x-2">
					{onPlay && (
						<button
							type="button"
							onClick={() => onPlay(track)}
							className="inline-flex items-center rounded-md bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-500"
						>
							<PlayIcon className="h-4 w-4 mr-1" />
							Play
						</button>
					)}
					{onDownload && track.isDownloadable && (
						<button
							type="button"
							onClick={() => onDownload(track)}
							className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<ArrowDownTrayIcon className="h-4 w-4 mr-1" />
							Download
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
