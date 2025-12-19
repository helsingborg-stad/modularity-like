<?php

namespace ModularityLikePosts\Helper;

interface GetOptionFieldsInterface
{
  /**
   * Get the color of the like icon from the options.
   *
   * @return string The color of the like icon in hex format.
   */
  public function getIconColor();

  /**
   * Get the like icon from the options.
   *
   * @return string The name of the like icon.
   */
  public function getIcon();

  /**
   * Get the post types that can be liked from the options.
   *
   * @return array An array of post type names.
   */
  public function getPostTypes(): array;

  /**
   * Get the like counter setting from the options.
   *
   * @return bool The like counter setting.
   */
  public function getCounter();

  /**
   * Get the tooltip text for liking a post from the options.
   *
   * @return string The tooltip text for liking a post.
   */
  public function getTooltipLike();

  /**
   * Get the tooltip text for unliking a post from the options.
   *
   * @return string The tooltip text for unliking a post.
   */
  public function getTooltipUnlike();
}