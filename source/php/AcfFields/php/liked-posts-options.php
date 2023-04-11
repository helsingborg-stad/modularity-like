<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_63ecfd0993f44',
    'title' => __('Like', 'liked-posts'),
    'fields' => array(
        0 => array(
            'key' => '26827',
            'label' => __('Select post types', 'liked-posts'),
            'name' => 'select_post_type',
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
                'post' => __('Post', 'liked-posts'),
                'event' => __('Event', 'liked-posts'),
                'local-events' => __('Local-events', 'liked-posts'),
                'test' => __('Test', 'liked-posts'),
                'place' => __('Place', 'liked-posts'),
                'guide' => __('Guide', 'liked-posts'),
                'custompost' => __('Custompost', 'liked-posts'),
            ),
            'default_value' => array(
                0 => __('post', 'liked-posts'),
            ),
            'return_format' => 'value',
            'allow_custom' => 0,
            'layout' => 'vertical',
            'toggle' => 0,
            'save_custom' => 0,
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'modularity_like',
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
    'acfe_display_title' => 'Liked posts',
    'acfe_autosync' => '',
    'acfe_form' => 0,
    'acfe_meta' => '',
    'acfe_note' => '',
));
}