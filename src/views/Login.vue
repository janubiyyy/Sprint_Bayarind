<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>
  
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "https://api-interview-vue.bayarind.id/api/auth/login",
          {
            email: this.email,
            password: this.password,
          }
        );

        if (response.data.status) {
          // Simpan token ke localStorage
          localStorage.setItem("token", response.data.data.token);

          // Tampilkan SweetAlert sukses
          Swal.fire({
            title: "Login Successful!",
            text: "Welcome back!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            // Redirect ke halaman Employee List
            this.$router.push("/employee-list"); // Gunakan router untuk pindah halaman
          });
        } else {
          this.errorMessage = "Login gagal. Periksa email dan password Anda.";
        }
      } catch (error) {
        this.errorMessage = "Login gagal. Periksa email dan password Anda.";
      }
    },
  },
};
</script>

  <style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}
button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
  