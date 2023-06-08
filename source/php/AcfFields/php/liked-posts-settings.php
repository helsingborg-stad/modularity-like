<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_63e9fb49ad0f4',
    'title' => __('Liked posts', 'modularity-like'),
    'fields' => array(
        0 => array(
            'key' => 'field_63ee48da2d607',
            'label' => __('Liked post types to show', 'modularity-like'),
            'name' => 'liked_post_types_to_show',
            'type' => 'checkbox',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'post' => __('Post', 'modularity-like'),
                'event' => __('Event', 'modularity-like'),
                'place' => __('Place', 'modularity-like'),
                'guide' => __('Guide', 'modularity-like'),
            ),
            'default_value' => array(
            ),
            'return_format' => 'value',
            'allow_custom' => 0,
            'layout' => 'vertical',
            'toggle' => 0,
            'save_custom' => 0,
        ),
        1 => array(
            'key' => 'field_643685be6d8ea',
            'label' => __('Columns', 'modularity-like'),
            'name' => 'liked_posts_columns',
            'type' => 'select',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'grid-md-12' => __('1', 'modularity-like'),
                'grid-md-6' => __('2', 'modularity-like'),
                'grid-md-4' => __('3', 'modularity-like'),
                'grid-md-3' => __('4', 'modularity-like'),
            ),
            'default_value' => __('grid-md-12', 'modularity-like'),
            'return_format' => 'value',
            'multiple' => 0,
            'allow_null' => 0,
            'ui' => 0,
            'ajax' => 0,
            'placeholder' => '',
        ),
        2 => array(
            'key' => 'field_64817c32631dc',
            'label' => __('Display share button', 'modularity-like'),
            'name' => 'liked_posts_share_button',
            'type' => 'true_false',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'message' => '',
            'default_value' => 0,
            'ui_on_text' => '',
            'ui_off_text' => '',
            'ui' => 0,
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