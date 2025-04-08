import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import EmployeeList from "../views/EmployeeList.vue";
import EmployeeEdit from "../views/EmployeeEdit.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/employee-list",
    name: "EmployeeList",
    component: EmployeeList,
  },
  {
    path: "/employee-create",
    name: "EmployeeCreate",
    component: EmployeeEdit,
  },
  {
    path: "/employee-edit/:id",
    name: "EmployeeEdit",
    component: EmployeeEdit,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  mode: "hash",
  routes,
});

export default router;
