<?php

/**
 * Blocks.
 *
 * @package makerblocks
 */

function makerblocks_get_custom_blocks()
{
	return [
		'flowstate',
	];
}

function makerblocks_get_wp_core_blocks()
{
	return [
		// 'core/paragraph',
		// 'core/heading',
		// 'core/list',
		// 'core/list-item',
		// 'core/quote',
		// 'core/preformatted',
		// 'core/pullquote',
		// 'core/table',
		// 'core/gallery',
		// 'core/image',
		// 'core/video',
		// 'core/spacer',
		// 'core/separator',
		// 'core/shortcode',
		// 'core/archives',
		// 'core/audio',
		// 'core/avatar',
		// 'core/pattern',
		// 'core/button',
		// 'core/buttons',
		// 'core/calendar',
		// 'core/categories-list',
		// 'core/code',
		// 'core/column',
		// 'core/columns',
		// // 'core/comment-author-avatar', // deprecated
		// 'core/comment-author-name',
		// 'core/comment-content',
		// 'core/comment-date',
		// 'core/comment-edit-link',
		// 'core/comment-reply-link',
		// 'core/comment-template',
		// 'core/comments',
		// 'core/comments-pagination',
		// 'core/comments-next-page',
		// 'core/comments-page-numbers',
		// 'core/comments-previous-page',
		// 'core/comments-title',
		// 'core/cover',
		// 'core/details',
		// 'core/embed',
		// 'core/file',
		// 'core/footnotes',
		// 'core/form',
		// 'core/input-field',
		// 'core/form-submission-notification',
		// 'core/form-submit-button',
		// 'core/classic',
		// 'core/group',
		// 'core/home-link',
		// 'core/custom-html',
		// 'core/latest-comments',
		// 'core/latest-posts',
		// 'core/login-out',
		// 'core/media-text',
		// 'core/unsupported',
		// 'core/more',
		// 'core/navigation',
		// 'core/custom-link',
		// 'core/submenu',
		// 'core/page-break',
		// 'core/page-list',
		// 'core/page-list-item',
		// 'core/pattern-placeholder',
		// 'core/author',
		// 'core/author-biography',
		// 'core/author-name',
		// // 'core/comment', // deprecated
		// 'core/comments-count',
		// 'core/comments-form',
		// 'core/comments-link',
		// 'core/content',
		// 'core/date',
		// 'core/excerpt',
		// 'core/featured-image',
		// 'core/post-navigation-link',
		// 'core/post-template',
		// 'core/post-terms',
		// 'core/time-to-read',
		// 'core/title',
		// 'core/query-loop',
		// 'core/no-results',
		// 'core/pagination',
		// 'core/next-page',
		// 'core/page-numbers',
		// 'core/previous-page',
		// 'core/query-title',
		// 'core/rss',
		// 'core/search',
		// 'core/site-logo',
		// 'core/site-tagline',
		// 'core/site-title',
		// 'core/social-icon',
		// 'core/social-icons',
		// 'core/tag-cloud',
		// 'core/template-part',
		// 'core/term-description',
		// // 'core/text-columns', // deprecated
		// 'core/table-of-contents',
		// 'core/verse',
	];
}

function makerblocks_blocks_init()
{
	$blocks = makerblocks_get_custom_blocks();
	foreach ($blocks as $block) {
		register_block_type(MAKERBLOCKS_PLUGIN_DIR . '/blocks/' . $block);
	}
}

add_action('init', 'makerblocks_blocks_init');

// Custom Block Categories
function makerblocks_custom_block_category($categories, $post)
{
	return array_merge(
		[
			[
				'slug' => 'makerblocks-templates',
				'title' => __('Maker Blocks Templates', 'makerblocks'),
			],
			[
				'slug' => 'makerblocks-layout',
				'title' => __('Maker Blocks Layout', 'makerblocks'),
			],
			[
				'slug' => 'makerblocks',
				'title' => __('Maker Blocks', 'makerblocks'),
			],
		],
		$categories
	);
}

add_filter('block_categories_all', 'makerblocks_custom_block_category', 10, 2);

function makerblocks_allowed_block_types($allowed_block_types, $block_editor_context)
{
	// Get core WordPress blocks that we want to allow
	$core_blocks = makerblocks_get_wp_core_blocks();

	// Prefix each custom block with 'makerblocks/'
	$custom_blocks = array_map(function ($block) {
		return 'makerblocks/' . $block;
	}, makerblocks_get_custom_blocks());

	// Merge custom blocks with allowed core blocks
	return array_merge($custom_blocks, $core_blocks);
}

// add_filter('allowed_block_types_all', 'makerblocks_allowed_block_types', 10, 2);
