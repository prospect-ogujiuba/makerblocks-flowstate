<?php
// --- Helpers: build menu data for a classic nav menu (term_id) ---
function makerblocks_get_menu_tree_by_id(int $menu_id, string $current_path): array
{
	$items = wp_get_nav_menu_items($menu_id, ['update_post_term_cache' => false]);
	if (!$items) {
		return [];
	}

	// Normalize items
	$norm = [];
	foreach ($items as $it) {
		$url_path = (string)(wp_parse_url($it->url ?? '', PHP_URL_PATH));
		$classes = is_array($it->classes) ? array_values(array_filter($it->classes)) : [];

		$norm[$it->ID] = [
			'id' => (int)$it->ID,
			'parentId' => (int)($it->menu_item_parent ?: 0),
			'title' => $it->title ?? '',
			'url' => $it->url ?? '',
			'path' => $url_path ?: '/',
			'target' => $it->target ?? '',
			'rel' => $it->xfn ?? '',
			'attrTitle' => $it->attr_title ?? '',
			'classes' => $classes,
			'current' => false,
			'currentAncestor' => false,
			'children' => [],
		];
	}

	// Mark current by comparing paths (exact match; tweak if you want starts-with)
	foreach ($norm as &$n) {
		$n['current'] = rtrim($n['path'], '/') === rtrim($current_path, '/');
	}
	unset($n);

	// Propagate currentAncestor up the tree
	$byParent = [];
	foreach ($norm as $n) {
		$byParent[$n['parentId']][] = $n['id'];
	}
	// For quick upward traversal
	$parentOf = [];
	foreach ($norm as $n) {
		if ($n['parentId']) $parentOf[$n['id']] = $n['parentId'];
	}
	foreach ($norm as $n) {
		if ($n['current']) {
			$p = $n['parentId'];
			while ($p && isset($norm[$p])) {
				$norm[$p]['currentAncestor'] = true;
				$p = $norm[$p]['parentId'];
			}
		}
	}

	// Build tree
	foreach ($norm as $id => $n) {
		$pid = $n['parentId'];
		if ($pid && isset($norm[$pid])) {
			$norm[$pid]['children'][] = &$norm[$id];
		}
	}
	// Return only roots
	$roots = [];
	foreach ($norm as $id => $n) {
		if ($n['parentId'] === 0) {
			$roots[] = $n;
		}
	}
	return array_values($roots);
}

// --- Your current path & component data ---
$current_path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
$current_path = $current_path === '' ? '/' : $current_path;

// // Build menu (menu term ID = 7)
$main_menu = makerblocks_get_menu_tree_by_id(7, $current_path);
$registration_url = wp_registration_url();
$login_url = wp_login_url();
$logoUrl = site_url('wp-content/uploads/flowstate-final-white.png');

// Only populate currentProfile if user is logged in
$current_profile = null;
if (is_user_logged_in()) {
	$current_user = wp_get_current_user();
	$profile_image = get_avatar_url($current_user);
	$current_profile = [
		'id' => $current_user->ID,
		'name' => $current_user->display_name ? $current_user->display_name : $current_user->user_nicename,
		'email' => $current_user->user_email,
		'profileImage' => $profile_image
	];
}

$component_data = [
	'currentPath' => $current_path,
	'mainMenu' => $main_menu,
	'currentProfile' => $current_profile,
	'registrationUrl' => $registration_url,
	'loginUrl' => $login_url,
	'logoUrl' => $logoUrl,
];
?>

<header
	<?php
	echo get_block_wrapper_attributes([
		'id' => 'flowstate-app',
		// You can also put other attributes here if needed
	]);
	?>
	component-data="<?php echo esc_attr(wp_json_encode($component_data, JSON_UNESCAPED_SLASHES)); ?>">
</header>
