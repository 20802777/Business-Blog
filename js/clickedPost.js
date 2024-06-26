document.addEventListener("DOMContentLoaded", async () => {
  const postId = new URLSearchParams(window.location.search).get('postId');
  
  if (!postId) {
    document.querySelector('.post-content').innerHTML = '<p>Post not found.</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/posts/${postId}`);
    const post = await response.json();

    if (!post) {
      document.querySelector('.post-content').innerHTML = '<p>Post not found.</p>';
      return;
    }

    document.getElementById('postTitle').textContent = post.title || 'No Title';
    document.getElementById('postDescription').textContent = post.description || 'No Description';

    if (post.image) {
      const postImage = document.getElementById('postImage');
      postImage.style.backgroundImage = `url(${post.image})`;
      postImage.style.backgroundSize = 'cover';
    }

    document.getElementById('postDate').textContent = post.date ? `Written on ${post.date}` : 'No Date Provided';

  } catch (error) {
    console.error('Error fetching post:', error);
    document.querySelector('.post-content').innerHTML = '<p>Error loading post details.</p>';
  }
});
