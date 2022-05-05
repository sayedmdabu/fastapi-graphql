const $blogSidebarTopWaypoint = document.getElementById('BlogSidebarStickyTop');
const $blogSidebarBotWaypoint = document.getElementById('BlogSidebarStickyBot');
const $courseCard = $('.blog-sidebar-sticky .course-card');

const showCard = () => {
  if (!$courseCard.is(':visible')) {
    $courseCard.fadeIn('fast');
  }
}

const hideCard = () => {
  if ($courseCard.is(':visible')) {
    $courseCard.fadeOut('fast');
  }
}

const blogSidebarWaypointBot = new Waypoint({
  element: $blogSidebarBotWaypoint,
  handler: function(direction) {
    if (direction === 'down') {
      showCard();

      // Only show related posts if the user scrolls a bit
      // and only on detail pages.
      const blogDetailCheck = document.querySelector('.page-blog-detail');
      if (blogDetailCheck && !relatedShown) {
        renderRelatedPosts();
        relatedShown = true;
      }
    }
  },
  offset: 220
});

const blogSidebarWaypointTop = new Waypoint({
  element: $blogSidebarTopWaypoint,
  handler: function(direction) {
    if (direction === 'up') {
      hideCard();
    }
  },
  offset: -10
})
