document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.querySelector(".rectangle-button");

  signUpButton.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const familyName = document.getElementById("familyName").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`http://localhost:3000/users?username=${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          alert('User already exists');
        } else {
          fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, familyName, email, username, password })
          })
            .then(response => response.json())
            .then(data => {
              alert('Registration successful!');
              window.location.href = "./login.html";
            })
            .catch(error => {
              alert('Error registering user. Please try again.');
              console.error('Error:', error);
            });
        }
      });
  });

  const goBackHomeButton = document.querySelector(".rectangle-button-8");
  goBackHomeButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});
