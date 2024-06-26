document.addEventListener("DOMContentLoaded", () => {
    const createPostLink = document.querySelector(".text-4");
    const loginLink = document.querySelector(".text-3");
    const signupLink = document.querySelector(".text-2");
    const myPostsLink = document.getElementById("myposts-link");
  
    function updateUIBasedOnLogin() {
      if (sessionStorage.getItem("isLoggedIn") === "true") {
        if (createPostLink) createPostLink.style.display = "list-item";
        if (loginLink) {
          loginLink.textContent = "Logout";
          loginLink.addEventListener("click", handleLogout);
          loginLink.href = "#";
        }
        if (signupLink) signupLink.style.display = "none";
        if (myPostsLink) myPostsLink.style.display = "inline";
      } else {
        if (createPostLink) createPostLink.style.display = "none";
        if (loginLink) {
          loginLink.textContent = "Login";
          loginLink.removeEventListener("click", handleLogout);
          loginLink.href = "../pages/login.html";
        }
        if (signupLink) signupLink.style.display = "inline";
        if (myPostsLink) myPostsLink.style.display = "none";
      }
    }
  
    function handleLogout() {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("username");
      window.location.href = "../index.html";
    }
  
    updateUIBasedOnLogin();
  });
  