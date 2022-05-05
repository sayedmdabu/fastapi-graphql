const $localNav = $('[data-local-nav-list]');
const isBlog = document.querySelector('body').classList.contains('page-blog');
let $headings = null;

// Blog has shallow TOC
if (isBlog) {
  $headings = $('[data-local-nav-source] h2');
} else {
  $headings = $('[data-local-nav-source] h2, [data-local-nav-source] h3');
}

// Slugify function by hagemann
// https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
function slugify(string) {
  const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;'
  const b = 'aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}


function highlightLocalNav(slug) {
  $localNav.find('li').removeClass('active');
  $localNav.find('li ul').hide();
  const $a = $localNav.find(`a[href="#${slug}"]`);

  if(!$a) return;
  $a.parent().addClass('active'); // adding active link to parent li element
  $a.next('ul').show() // show the child ul
  $a.closest('ul').show(); // show the submenu
}

// Build local navigation nav items
if ($headings.length > 0) {
  // Setup local nav
  $localNav.empty();

  let counter = 0;
   const $tocLIs = $('.blog-content .toc > ul > li');
   const $tocLIULs = $('.blog-content .toc li ul'); //  nested LI ULs
  
  // multilevel dropdown toggle
  $tocLIULs.each(function (idx) {
    let $ul = $(this);
    $ul.hide();
    let $a = $ul.prev();
    $a.addClass(`dropdown-toggle toggle-toc-${idx}`); // this bootstrap class will add a arrow at the end
    $(document).on('click', `.toggle-toc-${idx}`, function (e) {
      let $ul = $(this).next();
      $ul.toggle('slow');
    });
  });

  // If we're on blog and the Markdown-based TOC is in play, use that.
  if (isBlog && $tocLIs.length > 0) {
    const $localTOC = $('[data-local-nav-list]');

    $localTOC.html($tocLIs.clone()).promise().done(function() {
      // Better calculations when grabbing both components
      const stickyBarHeight =
        $('.blog-sidebar-sticky .card-sidebar').outerHeight() +
        $('.blog-sidebar-sticky .course-card').outerHeight();
      const windowHeight = $(window).outerHeight() - 40;

      // Only show the sticky purchase CTA if it'll fit
      if (stickyBarHeight > windowHeight) {
        $('.blog-sidebar').addClass('blog-sidebar-longTOC');
      }
    });
  } else {
    $headings.each(function() {
      let $heading = $(this);
      let headingText = $heading.text();
      let headingLvl = 'lvl-' + $heading[0].tagName;
      let slugText = 'H-' + counter + '-' + slugify(headingText);

      // Connect our slug to the chapter contents and wire up anchors
      $heading
        .attr('id', slugText)
        .addClass('waypoint-heading')
        .append('<a href="#' + slugText + '" class="heading-anchor" aria-hidden="true">#</a>');

      // Hookup our local navigation items
      $localNav.append('<li><a href="#' + slugText + '" class="' + headingLvl + '">' + headingText + '</a></li>');

      counter++;
    });
  }

  $('#LocalSide').removeClass('minimal');
}

// Setup smooth scrolling on local navs
function smoothScroll(evt) {
  let $navItem = $(this);
  let $target = $($navItem.attr('href'));
  let offset = Math.round($('body > .navbar').outerHeight()) + 20;

  $('html,body').animate({
    scrollTop: $target.offset().top - offset
  });
}



$localNav.find('a').on('click', smoothScroll);

if (isBlog) {
  const $tocAnchors = $('.blog-content .toc a');
  $tocAnchors.on('click', smoothScroll);
}

// Fetch the active TOC item when it crosses half window height
var activeSlug = null;
$(window).on('scroll', function() {
  const scrollPosition = document.documentElement.scrollTop ||
          document.body.scrollTop;
  $headings.each(function() {
    let $heading = $(this);
    let headingPosition = $heading.offset().top;
    let windowHeight = $(window).outerHeight();

    if (scrollPosition >= headingPosition - windowHeight / 2) {
      activeSlug = $heading.attr('id');
      // highlightLocalNav(slug);
    }
  })

})

// Adding custom logic to $ to detect when user stops scrolling 
$.fn.scrollEnd = function(callback, timeout) {          
  $(this).on('scroll', function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

// Highlighting the active TOC when user stops scrolling with a delay of 20ms
// This is to prevent the choppiness in smooth scrolling
$(window).scrollEnd(function(){
  if(activeSlug)
  highlightLocalNav(activeSlug);
},20)

// Smooth scrolling on 'Back to Top'
if(typeof $.fn.scrollEnd === "function")
(document.querySelector('[data-back-to-top]') || missing).addEventListener('click', function(event) {
    event.preventDefault();

    $localNav.find('li').removeClass('active');

    $('html,body').animate({
      scrollTop: $('body').offset().top
    });
});
