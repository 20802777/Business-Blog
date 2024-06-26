document.addEventListener('DOMContentLoaded', () => {
    const userPostsContainer = document.getElementById('user-posts');
    const loggedInUser = sessionStorage.getItem('username'); // Assuming username is unique and used as identifier

    if (!loggedInUser) {
        alert('You need to log in to view your posts.');
        window.location.href = '../pages/login.html';
        return;
    }

    // Fetch all posts
    fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(posts => {
            // Fetch all users to get their IDs
            return fetch('http://localhost:3000/users')
                .then(response => response.json())
                .then(users => {
                    // Find the logged-in user ID
                    const user = users.find(user => user.username === loggedInUser);
                    if (user) {
                        displayUserPosts(posts, user.id);
                    } else {
                        alert('User not found.');
                    }
                });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });

    // Function to display user's posts
    function displayUserPosts(posts, user) {
        const userPosts = posts.filter(post => post.user === user);
        if (userPosts.length === 0) {
            userPostsContainer.innerHTML = '<p>You have no posts yet.</p>';
            return;
        }

        userPostsContainer.innerHTML = '';
        userPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.description}</p>
                <br/>
                <img src="${post.image}" alt="${post.title}">
                <button class="edit-post" data-id="${post.id}">Edit</button>
                <button class="delete-post" data-id="${post.id}">Delete</button>
            `;

            userPostsContainer.appendChild(postElement);
        });

        // Attach event listeners for edit and delete buttons
        document.querySelectorAll('.delete-post').forEach(button => {
            button.addEventListener('click', deletePost);
        });

        document.querySelectorAll('.edit-post').forEach(button => {
            button.addEventListener('click', editPost);
        });
    }

    // Function to delete a post
    function deletePost(event) {
        const postId = event.target.dataset.id;

        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Post deleted successfully.');
                location.reload(); // Reload the page to reflect the changes
            } else {
                alert('Failed to delete post.');
            }
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
    }

    // Function to edit a post
    function editPost(event) {
        const postId = event.target.dataset.id;
        // Redirect to an edit page or open a modal to edit the post
        window.location.href = `./editpost.html?id=${postId}`;
    }
});
