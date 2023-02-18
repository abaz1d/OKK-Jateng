import { defineStore } from "pinia";
import { request } from "../utils/api";
import { useAuthStore } from "./auth";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    rawItems: [],
    rawOutlets: [],
  }),
  getters: {
    items: (state) => state.rawItems,
    regions: (state) => state.rawOutlets,
  },
  actions: {
    async readItem() {
      try {
        const Auth = useAuthStore();
        // const { data } = await request.get("users");
        const { data } = await request.get(
          `${
            Auth.items.role !== "Admin"
              ? `users?id_region=${String(Auth.items.id_region)}`
              : `users`
          }`
        );
        if (data.success) {
          this.rawItems = data.data.rows;
          this.rawOutlets = data.data.regions;
          return this.rawItems;
        }
      } catch (error) {
       throw new Error(error)
      }
    },
    async addItem(username, role, region, email_user, password) {
      const id_user = Date.now();
      if (role === 'Admin') {
      region = 'id_region';
      }
      this.rawItems.push({
        id_user,
        username,
        role,
        id_region: region,
        email_user,
        password,
      });
      try {
        const { data } = await request.post("users/add", {
          id_user,
          username,
          role,
          id_region: region,
          email_user,
          password,
        });
        if (data.success) {
          this.rawItems = this.rawItems.map((item) => {
            if (item.id_user === id_user) {
              return data.data.data;
            }
            return item;
          });
        }
      } catch (error) {
       throw new Error(error)
      }
    },
    async removeItem(id_user) {
      try {
        this.rawItems = this.rawItems.filter(
          (item) => item.id_user !== id_user
        );
        request
          .delete(`users/delete/${id_user}`)
          .then((data) => {
            if (data.success) {
              return data.success;
            }
          })
          .catch((error) => console.error(error));
      } catch (error) {
       throw new Error(error)
      }
    },
    async updateItem(user) {
      try {
        let item;
        let id_user = user.id_user;
        let username = user.username;
        let role = user.role;
        let id_region = user.id_region;
        let email_user = user.email_user;
        let password = user.password;

        if (password === "") {
          item = { username, role, id_region, email_user };
        } else {
          item = { username, role, id_region, email_user, password };
        }
        const { data } = await request.put(`users/edit/${id_user}`, item);
        if (data.success) {
          this.rawItems = this.rawItems.map((item) => {
            if (item.id_user === id_user) {
              return data.data.data;
            }
            return item;
          });
        }
      } catch (error) {
       throw new Error(error)
      }
    },
  },
});
