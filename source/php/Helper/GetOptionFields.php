<?php

namespace ModularityLikePosts\Helper;

use AcfService\AcfService;

class GetOptionFields implements GetOptionFieldsInterface
{
    public function __construct(private AcfService $acfService)
    {
    }

    /**
     * @inheritdoc
     */
    public function getIconColor()
    {
        return $this->staticFieldGetter('like_icon_color', '#e84666');
    }

    /**
     * @inheritdoc
     */
    public function getIcon() 
    {
        return $this->staticFieldGetter('like_icon', 'favorite');
    }

    /**
     * @inheritdoc
     */
    public function getPostTypes(): array
    {
        // TODO: Not working corrrectly, returns empty array
        return $this->staticFieldGetter('like_post_types', []);
    }

    /**
     * @inheritdoc
     */
    public function getCounter()
    {
        return $this->staticFieldGetter('like_counter', false);
    }

    /**
     * @inheritdoc
     */
    public function getTooltipLike()
    {
        return $this->staticFieldGetter('like_tooltip_like_text', '');
    }

    /**
     * @inheritdoc
     */
    public function getTooltipUnlike()
    {
        return $this->staticFieldGetter('like_tooltip_unlike_text', '');
    }

    /**
     * Retrieves the liked posts page IDs from the options table.
     * 
     * @return array The liked posts page IDs.
     */
    public function getLikedPostsPageIds(): array
    {
        return get_option('liked_posts_page_ids', []);
    }

    /**
     * Generic static field getter to reduce code duplication.
     *
     * @param string $fieldName The name of the ACF field to retrieve.
     * @return mixed The value of the ACF field.
     */
    private function staticFieldGetter(string $fieldName, mixed $default = null): mixed
    {
        static $fields = [];

        if (array_key_exists($fieldName, $fields)) {
            return $fields[$fieldName];
        }

        $fieldValue = $this->acfService->getField(
            $fieldName,
            'option'
        );

        $fields[$fieldName] = $fieldValue ?? $default;

        return $fields[$fieldName];
    }
}