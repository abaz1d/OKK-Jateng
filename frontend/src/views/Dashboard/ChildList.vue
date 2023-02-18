<template>
  <div class="mt-5 intro-x">
    <div class="box zoom-in">
      <div class="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
        <div class="box">
          <div class="p-5">
            <div
              class="h-20 2xl:h-26 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-cyan-500 before:to-blue-500">
              <!-- <img alt="Midone - HTML Admin Template" class="rounded-md" :src="faker.images[0]" /> -->
              <div class="absolute bottom-0 text-white px-5 pb-5 z-10">
                <a href="" class="block font-medium text-base">{{ detail.id_region }} - {{ detail.nama_region }}</a>
                <span class="text-white/90 text-xs font-medium mt-3"> {{
                  moment(detail.periode_bulanan).format("MMMM YYYY")
                }}</span>
              </div>
            </div>
            <div class="text-slate-600 dark:text-slate-500 mt-5">
              <div class="flex items-center">
                <MapIcon class="ml-4 w-4 h-4 mr-2" />Wilayah : <p class="inline-block ml-auto mr-4">
                  {{ detail.nama_region }}
                </p>
              </div>
              <div class="flex items-center mt-2">
                <CalendarRangeIcon class="ml-4 w-4 h-4 mr-2" /> Periode Bulan : <p class="inline-block ml-auto mr-4">
                  {{ moment(detail.periode_bulanan).format("MMMM YYYY") }}
                </p>
              </div>
              <div class="flex items-center mt-2">
                <UsersIcon class="ml-4 w-4 h-4 mr-2" /> Total Jumlah Anggota : <p class="inline-block ml-auto mr-4">
                  {{ detail.jumlah_anggota }}
                </p>
              </div>
            </div>
          </div>
          <div 
            class="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
            <a class="flex items-center text-xs text-primary mr-auto" href="javascript:;">
              Diedit: {{ moment(detail.tanggal_update).format("DD/MM/YYYY HH:SS") }}
            </a>
            <a class="flex items-center mr-3" href="javascript:;" @click="update(detail)" v-show="data.role !== 'Admin'">
              <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
            </a>
            <a class="flex items-center text-danger" href="javascript:;" @click="openModal_Remove(detail)" v-show="data.role !== 'Admin'">
              <Trash2Icon class="w-4 h-4 mr-1" /> Delete
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { useDashboardStore } from "@/stores/dashboard";
export default {
  setup() {
    const Dashboard = useDashboardStore();
    return { Dashboard, moment };
  },
  props: {
    detail: { type: Object, required: true },
    data: { type: Object, required: true },
  },
  emits: ["openModalRemove", "updateTotalAnggota"],
  methods: {
    async update(detail) {
      this.$emit("updateTotalAnggota", detail);
    },
    openModal_Remove(detail) {
      this.$emit("openModalRemove", detail);
    },
  },
};
</script>