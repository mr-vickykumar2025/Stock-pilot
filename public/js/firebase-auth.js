// Firebase Authentication + per-user Firestore data.
// Configuration is fetched from /api/config, which reads Vercel Environment Variables.
(async () => {
  let firebaseConfig;
  try {
    const response = await fetch("/api/config", { cache: "no-store" });
    const config = await response.json();
    if (!response.ok) throw new Error(config.error || "Could not load Firebase configuration.");
    firebaseConfig = config;
  } catch (error) {
    console.error("Firebase configuration error:", error);
    alert(`Firebase configuration error: ${error.message}`);
    return;
  }

  if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
    alert("Firebase configuration is incomplete. Check Vercel Environment Variables.");
    return;
  }

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  window.auth = auth;
  window.db = firebase.firestore();

  window.showSignup = function showSignup() {
    document.getElementById("signup-modal").classList.add("open");
  };

  window.closeSignup = function closeSignup() {
    document.getElementById("signup-modal").classList.remove("open");
  };

  window.signupUser = async function signupUser() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!name || !email || !password) {
      alert("Please enter your name, email and password.");
      return;
    }

    try {
      const credential = await auth.createUserWithEmailAndPassword(email, password);
      await credential.user.updateProfile({ displayName: name });
      await credential.user.sendEmailVerification();
      alert("Verification email sent. Please verify your email before signing in.");
      closeSignup();
    } catch (error) {
      alert(error.message);
    }
  };

  window.doLogin = async function doLogin() {
    const email = document.getElementById("login-user").value.trim();
    const password = document.getElementById("login-pass").value;

    try {
      const credential = await auth.signInWithEmailAndPassword(email, password);

      if (!credential.user.emailVerified) {
        await auth.signOut();
        alert("Please verify your email first.");
        return;
      }

      currentUser = {
        uid: credential.user.uid,
        name: credential.user.displayName || credential.user.email,
        email: credential.user.email
      };

      document.getElementById("login-error").style.display = "none";
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("app").style.display = "block";
      document.getElementById("sidebar-name").textContent = currentUser.name;
      document.getElementById("sidebar-avatar").textContent =
        currentUser.name.charAt(0).toUpperCase();

      await loadData();
      refreshDashboard();
      renderInventory();
      renderPOS();
      renderInvoicesList();
      renderAudit();
    } catch (error) {
      console.error("Login failed:", error);
      document.getElementById("login-error").textContent = error.message;
      document.getElementById("login-error").style.display = "block";
    }
  };

  window.forgotPassword = async function forgotPassword() {
    const email = prompt("Enter your registered email");
    if (!email) return;

    try {
      await auth.sendPasswordResetEmail(email.trim());
      alert("Password reset email sent.");
    } catch (error) {
      alert(error.message);
    }
  };

  window.doLogout = async function doLogout() {
    try {
      if (currentUser && typeof addAudit === "function") {
        addAudit("LOGIN", `User "${currentUser.name}" logged out`);
        if (typeof saveData === "function") await saveData();
      }
      await auth.signOut();
      currentUser = null;
      location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Could not sign out. Please try again.");
    }
  };
})();
