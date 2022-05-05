// NOTE: Depends on postId

const drawPost = function(postData) {
  const listingTmpl = `
    <article class="blog-listing">
      <header class="blog-listing-header">
        <h1 class="blog-listing-heading">
          <a href="/blog/${postData.post.slug}">${postData.post.title}</a>
        </h1>
      </header>

      <ul class="blog-listing-meta">
        <li class="blog-listing-author">
          <span class="sr-only">Posted by</span>&nbsp;
          <a href="/authors/${postData.author.slug}" class="author-line">
            <img
              src="/static/images/authors/${postData.author.logo}"
              alt="${postData.author.name}"
              class="author-line-photo rounded-circle">
              ${postData.author.name}
          </a>
        </li>

        <li class="blog-listing-date">
          <span class="sr-only">Last updated on</span>
          <time>${postData.post.last_modified_display}</time>
        </li>
      </ul>

      <div class="blog-listing-body">
        <p>${ postData.post.blurb }</p>
      </div>

      <div class="topics-list">
        <i class="fas fa-tags fa-sm"></i>
        ${postData.post.topics.map((topic, index) =>
          `<a class="btn btn-light btn-xs topic" href="/blog/topics/${topic.fields.slug}/">
            ${topic.fields.name}
          </a>
          `
        ).join('')}
      </div>
    </article>`;

  return listingTmpl;
};

const drawContributors = function (contributors) {
  let authorHTMl = `
    <section class="blog-contributors">
      <h2 class="eyebrow blog-contributors-heading">Contributors</h3>
      <ul class="blog-contributors-list">
  `;
  for (let i = 0; i < contributors.length; i++) {
    let innerHtml = `
       <li>
         <a href="/authors/${contributors[i].slug}/" class="author-line big">
           <img src="/static/images/authors/${contributors[i].image}" alt="${contributors[i].first_name} ${contributors[i].last_name}"
           class="author-line-photo rounded-circle">
            ${contributors[i].first_name} ${contributors[i].last_name}
          </a>
        </li>
    `;
    authorHTMl += innerHtml;
  }

  authorHTMl += `
    </ul>
    </section>
  `;

  return authorHTMl;
};

const drawRevisionHistory = function (history) {
  let revisionHTML = `
    <details class="blog-history">
      <summary>Revision History</summary>
  `;

  for (let i = 0; i < history.length; i++){
    let innerHtml = `
      <h3><time>${history[i]["date"]}</time></h3>
      <ul>
    `;

    let changesList = history[i]['list_of_changes'];

    for (let j = 0; j < changesList.length; j++) {
      let changesHTML = `<li>${changesList[j]}</li>`;
      innerHtml += changesHTML;
    }

    innerHtml += "</ul>";
    revisionHTML += innerHtml;
  }

  revisionHTML += "</details>";

  return revisionHTML;
};

const renderRelatedPosts = function() {
  // Show spinner before related posts load
  document.getElementById('spinner-loader').style.display = 'block';

  const relatedPostsEndpoint = `/blog/metadata/?post_id=${postId}`;

  fetch(relatedPostsEndpoint)
    .then(response => response.json())
    .then(data => {

      let related_posts = data.related_post;
      let contributors = data.contributors;
      let revision_history = data.revision_history;

      // Hide Spinner on related post load
      document.getElementById('spinner-loader').style.display = 'none';

      const listingCols = document.querySelectorAll('#RelatedListingsBody .col');

      for (let i = 0; i < 3; i++) {
        listingCols[i].innerHTML = drawPost(related_posts[i]);
      }

      if (contributors.length) {
        const contributorsListing = document.getElementById('divContributors');
        contributorsListing.innerHTML = drawContributors(contributors);
      }

      if (revision_history) {
        const revisionHistory = document.getElementById('divRevisionHistory');
        revisionHistory.innerHTML = drawRevisionHistory(revision_history);
      }
  });
};
