<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_63ecfd0993f44',
    'title' => __('Like', 'modularity-like'),
    'fields' => array(
        0 => array(
            'key' => '26827',
            'label' => __('Select post types', 'modularity-like'),
            'name' => 'select_post_type',
            'aria-label' => '',
            'type' => 'posttype_select',
            'instructions' => __('Post types that the user should be able to like posts from.', 'modularity-like'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'allow_null' => 0,
            'multiple' => 1,
            'placeholder' => '',
            'disabled' => 0,
            'readonly' => 0,
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