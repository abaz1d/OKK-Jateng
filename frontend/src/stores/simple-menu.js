import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useSimpleMenuStore = defineStore("simpleMenu", {
  state: () => ({
    menu: [
      {
        icon: "HomeIcon",
        pageName: "simple-menu-dashboard",
        title: "Dashboard",
      },
      {
        icon: "SlidersIcon",
        pageName: "simple-menu-pengaturan",
        title: "Pengaturan Data",
        subMenu: [
          {
            icon: "ServerIcon",
            pageName: "simple-menu-data-utama",
            title: "Data Utama",
          },
          {
            icon: "UsersIcon",
            pageName: "simple-menu-semua-akun",
            title: "Semua Akun",
          },
        ],
      },
      {
        icon: "LayoutIcon",
        pageName: "simple-menu-menu-layout",
        title: "Menu Layout",
        subMenu: [
          {
            icon: "CreditCardIcon",
            pageName: "top-menu-dashboard",
            title: "Top Menu",
            ignore: true,
          },
          {
            icon: "ColumnsIcon",
            pageName: "side-menu-dashboard",
            title: "Side Menu",
            ignore: true,
          },
          {
            icon: "SidebarIcon",
            pageName: "simple-menu-dashboard",
            title: "Simple Menu",
            ignore: true,
          },
        ],
      },
    ],
  }),
  getters: {
    items: (state) =>
      state.menu.filter((item) => {
        const Auth = useAuthStore();
        const Role = Auth.items.role;
        const Title = item.title;

        //Jika Role Selain Super Admin Menu Pengaturan Data Tidak Tersedia
        // if (Role !== "Admin") {
        //   return Title !== "Pengaturan Data";
        // } else {
        return item;
        // }
      }),
  },
});
