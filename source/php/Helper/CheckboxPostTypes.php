<?php 


namespace ModularityLikePosts\Helper;

class CheckboxPostTypes
{
    public function setAcfCheckboxes( $field ) {
        $args = array(
            'public' => true,
            '_builtin' => false
        );

        $postTypes = get_post_types( $args, 'names' );

        $newChoices = [];
        if (!empty($postTypes)) {
            foreach ($postTypes as $postType) {
                $newChoices[$postType] = ucfirst($postType);
            }
        }

        $field['choices'] = array_merge( $field['choices'], $newChoices );

    return $field;
    }
}
