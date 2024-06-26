document.addEventListener("DOMContentLoaded", async () => {
  const createPostLink = document.getElementById("createPostLink");
  const loginLink = document.querySelector(".text-3");
  const postsSection = document.querySelector('.group');
  const signupLink = document.getElementById('signUpLink');
  const myPostsLink = document.getElementById('myposts-link');
  
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');
  
  const postsPerPage = 3;
  let currentPage = 1;
  let totalPages = 1;

  function updateUIBasedOnLogin() {
    if (sessionStorage.getItem("isLoggedIn") === "true") {
      createPostLink.style.display = "list-item";
      loginLink.textContent = "Logout";
      loginLink.addEventListener("click", handleLogout);
      loginLink.href = "#";
      signupLink.style.display = 'none';
      myPostsLink.style.display = 'inline';
    } else {
      createPostLink.style.display = "none";
      loginLink.textContent = "Login";
      loginLink.removeEventListener("click", handleLogout);
      loginLink.href = "./pages/login.html";
      if (signupLink) signupLink.style.display = 'inline';
      if (myPostsLink) myPostsLink.style.display = 'none';
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    window.location.href = "./index.html";
  }

  async function fetchPosts() {
    try {
      const response = await fetch('http://localhost:3000/posts');
      const posts = await response.json();
      return posts.reverse();
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async function displayPosts(page) {
    const posts = await fetchPosts();
    totalPages = Math.ceil(posts.length / postsPerPage);

    // Calculate start and end indices for the current page
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToDisplay = posts.slice(start, end);

    // Clear the posts section
    postsSection.innerHTML = '';

    // Add posts to the section
    postsToDisplay.forEach(post => {
      const postElement = createPostElement(post);
      postsSection.appendChild(postElement);
    });

    // Update pagination controls
    pageInfo.textContent = `Page ${page} of ${totalPages}`;
    prevPageButton.disabled = (page === 1);
    nextPageButton.disabled = (page === totalPages);
  }

  function createPostElement(post) {
    const postContainer = document.createElement('div');
    postContainer.className = 'section-2';

    const postLink = document.createElement('a');
    postLink.href = `../pages/clickedPost.html?postId=${post.id}`;

    const postImage = document.createElement('div');
    postImage.className = 'pic';
    if (post.image) {
      postImage.style.backgroundImage = `url(${post.image})`;
      postImage.style.backgroundSize = 'cover';
    }

    const postTitle = document.createElement('span');
    postTitle.textContent = post.title;
    postTitle.className = 'text-a';

    const postDescription = document.createElement('span');
    postDescription.textContent = post.postInfo;
    postDescription.className = 'text-b';

    postLink.appendChild(postImage);
    postLink.appendChild(postTitle);
    postLink.appendChild(postDescription);
    postContainer.appendChild(postLink);

    return postContainer;
  }

  // Event listeners for pagination buttons
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayPosts(currentPage);
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayPosts(currentPage);
    }
  });

  updateUIBasedOnLogin();

  // Initial fetch and display
  displayPosts(currentPage);
});
