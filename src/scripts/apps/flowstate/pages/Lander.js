export default function Lander() {
	const currentYear = new Date().getFullYear()

	return (
		<main id="main" className="bg-slate-950 text-slate-200 antialiased font-sans selection:bg-emerald-300/30">
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2"
			>
				Skip to content
			</a>

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
				</div>
			</section>

			<section id="about" className="py-16 sm:py-20 border-t border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
						A Full-Stack Producer Economy
					</h2>
					<p className="mt-4 max-w-[75ch] text-base leading-relaxed text-slate-300">
						FlowState is a transparent ecosystem where producers upload tracks, enroll in programs, submit
						to sync opportunities, track placements, and manage financial outcomes. Every step—contribution,
						enrollment, placement, transaction—is logged for clarity and audit.
					</p>

					<div className="mt-10 grid md:grid-cols-3 gap-6">
						<div className="rounded-2xl p-6 ring-1 ring-white/15 bg-slate-900/70">
							<p className="text-[11px] uppercase tracking-widest text-emerald-300 mb-2">Foundation</p>
							<h3 className="text-lg font-semibold text-slate-50">Users &amp; Roles</h3>
							<p className="mt-2 text-sm text-slate-300">
								Producers, artists, partners, investors with role-based permissions and secure auth
								(OAuth + JWT).
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
									Name, bio, links, location, socials (JSON).
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
							<a
								className="mt-4 inline-flex items-center text-sm text-emerald-300 hover:underline"
								href="#"
								aria-label="View details about R&B Production Masterclass"
							>
								View details →
							</a>
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

			<section className="py-16 sm:py-20">
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
