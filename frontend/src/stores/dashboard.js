import { defineStore } from "pinia";
import { request } from "../utils/api";
import { useAuthStore } from "./auth";

export const useDashboardStore = defineStore({
  id: "dashboard-store",
  state: () => ({
    mainData: [],
    childData: [],
    tabelUtama: [],
    rawRegions: [],
    totalAnggota: 0,
  }),
  getters: {
    items: (state) => state.mainData,
    items2: (state) => state.childData,
    tabel: (state) => state.tabelUtama,
    regions: (state) => state.rawRegions,
    total_anggota: (state) => state.totalAnggota,
  },
  actions: {
    async readItem(date_select, data_select) {
      try {
        const Auth = useAuthStore();
        const { data } = await request.get(
          `${
            Auth.items.role == "Operator"
              ? `utama?id_region=${String(
                  Auth.items.id_region
                )}&date_select=${String(date_select)}`
              : `utama?id_region=${String(data_select)}&date_select=${String(
                  date_select
                )}`
          }`
        );
        if (data.success) {
          this.mainData = data.data.mainData;
          this.childData = data.data.childData;
          this.rawRegions = data.data.regions;
          this.totalAnggota = this.totalAnggota =
            data.data?.total?.total_anggota_all;

          return Auth.items;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async readTabel(date_select) {
      try {
        const Auth = useAuthStore();
        const { data } = await request.get(
          `utama/read-table?date_select=${String(date_select)}`
        );
        if (data.success) {
          this.tabelUtama = data.data.tabelUtama;
          this.totalAnggota = data.data?.total?.total_anggota_all;

          return data.data.tabelUtama;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getData(id_region, date_select) {
      try {
        const { data } = await request.get(
          `/utama/main-data?id_region=${String(id_region)}`
        );
        if (data.success) {
          this.mainData = data.data;
          this.getDetail(
            date_select,
            data.data.length > 0 ? data.data[0].id_utama : ""
          );
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getDetail(date_select, id_utama) {
      try {
        const { data } = await request.get(
          `/utama/child-data?date_select=${String(
            date_select
          )}&id_utama=${String(id_utama)}`
        );
        this.childData = [];
        if (data.success) {
          this.childData = data.data;
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async addDetail(
      periode_bulanan,
      jumlah_anggota,
      anggota_kta,
      anggota_non_kta,
      id_utama
    ) {
      try {
        const { data } = await request.post("utama/child/add", {
          periode_bulanan,
          jumlah_anggota,
          anggota_kta,
          anggota_non_kta,
          id_utama,
        });
        if (data.success) {
          this.childData = data.data;
          return data.data[0].periode_bulanan;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async removeDetail(id_detail) {
      request
        .delete(`utama/child/delete/${id_detail}`)
        .then(({ data }) => {
          if (data.success) {
            this.childData = [];
            return data.success;
          }
        })
        .catch((error) => console.error(error));
    },
    async updateDetail(
      periode_bulanan,
      jumlah_anggota,
      anggota_kta,
      anggota_non_kta
    ) {
      try {
        const { data } = await request.put(
          `utama/child/edit/${String(this.childData[0].id_tabel_anggota)}`,
          {
            periode_bulanan,
            jumlah_anggota,
            anggota_kta,
            anggota_non_kta,
          }
        );
        if (data.success) {
          this.childData = data.data;
          return data.data[0].periode_bulanan;
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async addData(
      id_region,
      alamat,
      no_telepon,
      gambar_depan,
      gambar_dalam,
      gambar_papan,
      file_sk,
      periode_mulai,
      periode_selesai,
      nama_web,
      nama_fb,
      nama_ig
    ) {
      const formData = new FormData();
      formData.append("id_region", id_region);
      formData.append("alamat", alamat);
      formData.append("no_telepon", no_telepon);
      formData.append("gambar_depan", gambar_depan);
      formData.append("gambar_dalam", gambar_dalam);
      formData.append("gambar_papan", gambar_papan);
      formData.append("file_sk", file_sk);
      formData.append("periode_mulai", periode_mulai);
      formData.append("periode_selesai", periode_selesai);
      formData.append("nama_web", nama_web);
      formData.append("nama_fb", nama_fb);
      formData.append("nama_ig", nama_ig);

      const headers = { "Content-Type": "multipart/form-data" };

      try {
        const { data } = await request.post(
          "utama/data/add",
          formData,
          headers
        );
        if (data.success) {
          this.mainData = data.data;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async removeData(id_utama, lama_depan, lama_dalam, lama_papan, lama_sk) {
      request
        .delete(`utama/data/delete/${id_utama}`, {
          data: {
            lama_depan,
            lama_dalam,
            lama_papan,
            lama_sk,
          },
        })
        .then(({ data }) => {
          if (data.success) {
            this.mainData = [];
            return data.success;
          }
        })
        .catch((error) => console.error(error));
    },
    async updateData(
      id_utama,
      id_region,
      alamat,
      no_telepon,
      gambar_depan,
      gambar_dalam,
      gambar_papan,
      file_sk,
      lama_depan,
      lama_dalam,
      lama_papan,
      lama_sk,
      periode_mulai,
      periode_selesai,
      nama_web,
      nama_fb,
      nama_ig
    ) {
      const formData = new FormData();
      formData.append("id_region", id_region);
      formData.append("alamat", alamat);
      formData.append("no_telepon", no_telepon);
      formData.append("gambar_depan", gambar_depan);
      formData.append("gambar_dalam", gambar_dalam);
      formData.append("gambar_papan", gambar_papan);
      formData.append("file_sk", file_sk);
      formData.append("lama_depan", lama_depan);
      formData.append("lama_dalam", lama_dalam);
      formData.append("lama_papan", lama_papan);
      formData.append("lama_sk", lama_sk);
      formData.append("periode_mulai", periode_mulai);
      formData.append("periode_selesai", periode_selesai);
      formData.append("nama_web", nama_web);
      formData.append("nama_fb", nama_fb);
      formData.append("nama_ig", nama_ig);

      const headers = { "Content-Type": "multipart/form-data" };

      try {
        const { data } = await request.put(
          `utama/data/edit/${String(id_utama)}`,
          formData,
          headers
        );
        if (data.success) {
          this.mainData = data.data;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
});
