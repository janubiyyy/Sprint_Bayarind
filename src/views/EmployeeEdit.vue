<template>
  <div class="container">
    <h2>{{ isEdit ? "Edit Employee" : "Create Employee" }}</h2>
    <button @click="$router.go(-1)" class="btn btn-back">Back</button>
    <form @submit.prevent="submitForm" class="employee-form">
      <label>Name</label>
      <input v-model="employee.name" required />

      <label>Email</label>
      <input type="email" v-model="employee.email" required />

      <label>Phone</label>
      <input type="text" v-model="employee.phone" required />

      <label>Date of Birth</label>
      <input type="date" v-model="employee.date_of_birth" required />

      <label>Gender</label>
      <select v-model="employee.gender" required>
        <option value="" disabled>Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label>Department</label>
      <select v-model="employee.departement" required>
        <option value="" disabled>Select Department</option>
        <option
          v-for="department in departments"
          :key="department.id"
          :value="department.id"
        >
          {{ department.title }}
        </option>
      </select>

      <label>Job Position</label>
      <select v-model="employee.position" required>
        <option value="" disabled>Select Position</option>
        <option
          v-for="position in positions"
          :key="position.id"
          :value="position.id"
        >
          {{ position.title }}
        </option>
      </select>

      <label>Status</label>
      <select v-model="employee.status" required>
        <option value="" disabled>Select Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button type="submit" class="btn btn-primary">
        {{ isEdit ? "Update" : "Create" }}
      </button>
    </form>
  </div>
</template>
  
  <script>
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert

export default {
  props: ["id"], // id hanya diperlukan untuk edit
  data() {
    return {
      employee: {
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        departement: "",
        position: "",
        status: "",
      },
      isEdit: false,
      departments: [],
      positions: [],
    };
  },
  created() {
    if (this.id) {
      this.isEdit = true;
      this.getEmployeeData();
    }
    this.getDepartments();
    this.getPositions();
  },
  methods: {
    async getEmployeeData() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `https://api-interview-vue.bayarind.id/api/employee/${this.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.employee = response.data.data;
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    },

    async getDepartments() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://api-interview-vue.bayarind.id/api/departement/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.departments = response.data.data;
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    },

    async getPositions() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://api-interview-vue.bayarind.id/api/position/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.positions = response.data.data;
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    },

    async submitForm() {
      const token = localStorage.getItem("token");
      const payload = {
        id: this.id, // ID hanya diperlukan untuk update
        name: this.employee.name,
        email: this.employee.email,
        phone: this.employee.phone,
        date_of_birth: this.employee.date_of_birth,
        gender: this.employee.gender,
        department_id: this.employee.departement,
        job_position_id: this.employee.position,
        status: this.employee.status,
      };

      try {
        if (this.isEdit) {
          await axios.put(
            "https://api-interview-vue.bayarind.id/api/employee", // Adjust endpoint if needed
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee updated successfully!",
          });
        } else {
          await axios.post(
            "https://api-interview-vue.bayarind.id/api/employee",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee created successfully!",
          });
        }

        this.$router.push("/employee-list");
      } catch (error) {
        console.error(
          "Error submitting employee:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error submitting the form. Please try again.",
        });
      }
    },
  },
};
</script>
  
  <style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
  color: #555;
}
input {
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
  border-color: #007bff;
  outline: none;
}

button {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-back {
  background-color: #6c757d;
  color: white;
  margin-bottom: 20px;
}

.btn-back:hover {
  background-color: #5a6268;
}

.employee-form {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
}
</style>
  