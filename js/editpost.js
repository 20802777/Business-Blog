document.addEventListener('DOMContentLoaded', () => {
    const editPostForm = document.getElementById('editPostForm');
    const postId = new URLSearchParams(window.location.search).get('id');

    if (!postId) {
        alert('No post selected for editing.');
        window.location.href = '../pages/myPosts.html';
        return;
    }

    // Fetch the post details
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            // Populate the form with post data
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postDescription').value = post.description;
            document.getElementById('postImagePreview').src = post.image; // Display the current image
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });

    // Handle form submission to update the post
    editPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('postTitle').value;
        const description = document.getElementById('postDescription').value;
        const imageFile = document.getElementById('postImage').files[0];

        let imageUrl = document.getElementById('postImagePreview').src; // Default to current image URL

        if (imageFile) {
            // If a new image file is selected, upload it to Firebase
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`images/${Date.now()}-${imageFile.name}`);
            
            try {
                // Upload the file to Firebase Storage
                await imageRef.put(imageFile);
                // Get the URL of the uploaded image
                imageUrl = await imageRef.getDownloadURL();
                console.log('Image uploaded to:', imageUrl);
            } catch (error) {
                console.error('Error uploading file to Firebase:', error);
                alert('Failed to upload image. Please try again.');
                return;
            }
        }

        // Prepare the updated post data
        const updatedPost = {
            title: title,
            description: description,
            image: imageUrl, // Use the new image URL or the existing one if no new file was uploaded
            user: sessionStorage.getItem('userId')
        };

        console.log('Updated post data:', updatedPost);

        // Send the updated data to the API
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPost)
        })
        .then(response => {
            if (response.ok) {
                alert('Post updated successfully.');
                window.location.href = '../pages/myPosts.html';
            } else {
                alert('Failed to update post.');
            }
        })
        .catch(error => {
            console.error('Error updating post:', error);
        });
    });
});
