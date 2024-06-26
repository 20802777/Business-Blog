document.addEventListener('DOMContentLoaded', () => {
  const createPostForm = document.getElementById('createPostForm');

  createPostForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('postTitle').value;
    const description = document.getElementById('postDescription').value;
    const imageFile = document.getElementById('postImage').files[0];
    const userID= sessionStorage.getItem('userId')
    const postInfo=document.getElementById("description").value;

    if (!title || !description || !imageFile || !userID || !postInfo ) {
      alert('Please fill in all inputs and select an image');
      return;
    }
    

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('user',userID);
    formData.append('postInfo',postInfo);

    // Assuming you handle the image upload separately and get an image URL
    const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`images/${Date.now()}-${imageFile.name}`);
      await imageRef.put(imageFile);
      const imageUrl = await imageRef.getDownloadURL();

    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          image: imageUrl,
          user:userID,
          postInfo
        })
      });

      if (response.ok) {
        alert('Post created successfully!');
        window.location.href = '../index.html';
      } else {
        const data = await response.json();
        alert('Failed to create post: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating post. Please try again.');
    }
  });
});
