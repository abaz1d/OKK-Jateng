<template>
  <DataUtama v-if="data.role === 'Operator'" />
  <TabelBulanan v-else />

  <ModalDatabaseError ref="modalErrorRef" />
</template>

<script setup>
import DataUtama from "./DataUtama.vue";
import TabelBulanan from "./TabelBulanan.vue";
import ModalDatabaseError from "@/components/modal-error/Main.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const Auth = useAuthStore();
const modalErrorRef = ref();
const data = ref([]);
const isLoading = ref(false);

onMounted(async function () {
  try {
    isLoading.value = true;
    data.value = await Auth.items;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
    modalErrorRef.value.errorDatabaseModal = true;
  }
});
</script>
