document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".Button-2");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    console.log("Login attempt:", { username, password });

    fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
      .then(response => response.json())
      .then(data => {
        console.log("Response data:", data);
        if (data.length > 0) {
          const user = data[0];
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("userId", user.id);
          sessionStorage.setItem("username", user.username);
          window.location.href = "../index.html";
        } else {
          alert('Invalid username or password');
        }
      })
      .catch(error => {
        alert('Error logging in. Please try again.');
        console.error('Error:', error);
      });
  });
});
