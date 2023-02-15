<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_63e9fb49ad0f4',
    'title' => __('Liked posts', 'liked-posts'),
    'fields' => array(
        0 => array(
            'key' => 'field_63e9fb4a67244',
            'label' => __('Display liked posts as', 'liked-posts'),
            'name' => 'display_liked_posts_as',
            'type' => 'radio',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'collection' => __('Collection', 'liked-posts'),
                'card' => __('Card', 'liked-posts'),
                'block' => __('Block', 'liked-posts'),
            ),
            'default_value' => __('collection', 'liked-posts'),
            'return_format' => 'value',
            'allow_null' => 0,
            'other_choice' => 0,
            'layout' => 'horizontal',
            'save_other_choice' => 0,
        ),
        1 => array(
            'key' => 'field_63eb934a4165a',
            'label' => __('Like page', 'liked-posts'),
            'name' => 'like_page',
            'type' => 'post_object',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'post_type' => array(
                0 => 'page',
            ),
            'taxonomy' => '',
            'return_format' => 'object',
            'multiple' => 0,
            'save_custom' => 0,
            'save_post_status' => 'publish',
            'acfe_bidirectional' => array(
                'acfe_bidirectional_enabled' => '0',
            ),
            'allow_null' => 0,
            'ui' => 1,
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'mod-liked-posts',
            ),
        ),
        1 => array(
            0 => array(
                'param' => 'block',
                'operator' => '==',
                'value' => 'all',
            ),
        ),
        2 => array(
            0 => array(
                'param' => 'block',
                'operator' => '==',
                'value' => 'acf/liked-posts',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'left',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => true,
    'description' => '',
    'show_in_rest' => 0,
    'acfe_display_title' => '',
    'acfe_autosync' => '',
    'acfe_form' => 0,
    'acfe_meta' => '',
    'acfe_note' => '',
));
}