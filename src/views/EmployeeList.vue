<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Employee List</h2>
    <div class="flex justify-between mb-4">
      <button @click="createEmployee" class="btn-primary">
        Create New Employee
      </button>
      <button @click="logout" class="btn-secondary">Logout</button>
    </div>

    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100 text-gray-700">
          <th class="py-2 px-4 border-b">No</th>
          <th class="py-2 px-4 border-b">Name</th>
          <th class="py-2 px-4 border-b">Department</th>
          <th class="py-2 px-4 border-b">Job Position</th>
          <th class="py-2 px-4 border-b">Status</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(employee, index) in paginatedEmployees"
          :key="employee.id"
          class="hover:bg-gray-50"
        >
          <td class="py-2 px-4 border-b">
            {{ index + 1 + (currentPage - 1) * employeesPerPage }}
          </td>
          <!-- Numbering -->
          <td class="py-2 px-4 border-b">{{ employee.name }}</td>
          <td class="py-2 px-4 border-b">{{ employee.departement }}</td>
          <td class="py-2 px-4 border-b">{{ employee.position }}</td>
          <td class="py-2 px-4 border-b">{{ employee.status }}</td>
          <td class="py-2 px-4 border-b">
            <button @click="editEmployee(employee.id)" class="btn-action">
              Edit
            </button>
            <button
              style="background-color: #dc3545"
              @click="deleteEmployee(employee.id)"
              class="btn-action"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <!-- Pagination Controls -->
    <div class="pagination-container">
      <!-- Previous Button -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="btn-action"
      >
        Previous
      </button>

      <!-- Pagination Number Buttons -->
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="['btn-page', { 'btn-active': page === currentPage }]"
      >
        {{ page }}
      </button>

      <!-- Next Button -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn-action"
      >
        Next
      </button>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      employees: [],
      currentPage: 1,
      employeesPerPage: 5, // Number of employees to show per page
    };
  },
  computed: {
    totalPages() {
      // Jika tidak ada data, set total pages ke 1
      return Math.ceil(this.employees.length / this.employeesPerPage) || 1;
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.employeesPerPage;
      const end = start + this.employeesPerPage;
      return this.employees.slice(start, end);
    },
  },
  created() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/");
    } else {
      this.getEmployees();
    }
  },
  methods: {
    async getEmployees() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://api-interview-vue.bayarind.id/api/employee",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.employees = response.data.data.list;
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    createEmployee() {
      this.$router.push("/employee-create");
    },
    editEmployee(id) {
      this.$router.push(`/employee-edit/${id}`);
    },
    async deleteEmployee(id) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authorization token not found.");
        return;
      }

      // Tampilkan konfirmasi SweetAlert sebelum menghapus
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (isConfirmed) {
        try {
          await axios.delete(
            "https://api-interview-vue.bayarind.id/api/employee",
            {
              data: { id },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          this.getEmployees();
          Swal.fire("Deleted!", "Employee has been deleted.", "success");
        } catch (error) {
          console.error(
            "Error deleting employee:",
            error.response ? error.response.data : error.message
          );
          Swal.fire(
            "Error!",
            "There was a problem deleting the employee.",
            "error"
          );
        }
      }
    },
    async logout() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authorization token not found.");
        return;
      }

      // Tampilkan konfirmasi SweetAlert sebelum logout
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, logout!",
      });

      if (isConfirmed) {
        try {
          await axios.post(
            "https://api-interview-vue.bayarind.id/api/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          localStorage.removeItem("token");
          this.$router.push("/");
          Swal.fire("Logged out!", "You have been logged out.", "success");
        } catch (error) {
          console.error(
            "Error logging out:",
            error.response ? error.response.data : error.message
          );
          Swal.fire("Error!", "There was a problem logging out.", "error");
        }
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
};
</script>

  <style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px 15px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

.btn-primary,
.btn-secondary,
.btn-action {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-secondary {
  margin-left: 10px;
  background-color: #dc3545;
}

.btn-action {
  margin-right: 10px;
  background-color: #28a745;
  padding: 5px 10px;
}

.btn-action:hover {
  background-color: #218838;
}

.pagination-container {
  display: flex;
  justify-content: center; /* Ensures the pagination is centered */
  align-items: center;
  margin-top: 20px;
  gap: 10px; /* Adds space between the buttons */
}

.btn-action {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-action:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.btn-page {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-page:hover {
  background-color: #007bff;
}

.btn-active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
  