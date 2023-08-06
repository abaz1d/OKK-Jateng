<template>
  <div v-if="!isLoading">
    <div v-if="data.role === 'Operator'">
      <DataUtama />
    </div>
    <div v-else>
      <LaporanBulanan />
    </div>
  </div>

  <ModalDatabaseError ref="modalErrorRef" />
</template>

<script setup>
import DataUtama from "../DataUtama/Main.vue";
import LaporanBulanan from "./LaporanBulanan.vue";
import ModalDatabaseError from "@/components/modal-error/Main.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const Auth = useAuthStore();
const modalErrorRef = ref();
const data = ref([]);
const isLoading = ref(true);

onMounted(async function () {
  try {
    data.value = await Auth.items;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
    modalErrorRef.value.errorDatabaseModal = true;
  }
});
</script>
