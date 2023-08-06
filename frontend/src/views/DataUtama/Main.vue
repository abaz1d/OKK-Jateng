<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="intro-y flex items-center h-10">
            <div v-if="data.role !== 'Operator'" class="w-auto rounded-lg flex">
              <div
                class="z-30 rounded-l w-auto px-1 flex items-center justify-center bg-gray-100 border text-gray-600 dark:bg-dark-1 dark:border-dark-4 -mr-1"
              >
                <UsersIcon class="mr-1" />
                {{ Dashboard.total_anggota }}
              </div>
              <TomSelect v-model="data_select" class="w-full z-50">
                <option value="kosong" disabled>
                  --&gt; Total Anggota {{ Dashboard.total_anggota }} dari 35
                  Kota/ Kab&lt;--
                </option>
                <option
                  v-for="region in Dashboard.regions"
                  :key="region.id_region"
                  :region="region"
                  :value="region.id_region"
                >
                  {{ region.id_region }} -
                  {{ region.nama_region }}
                </option>
              </TomSelect>
            </div>
            <h2 v-else class="text-lg font-medium truncate mr-5">
              {{ data.id_region }} - {{ data.nama_region }}
            </h2>
            <table v-if="data.role !== 'Operator'" class="table-fixed mx-2">
              <thead>
                <tr>
                  <th class="border px-2 py-1" colspan="2">
                    {{ date_select }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border">
                  <td class="border-r px-2 py-1">
                    <UsersIcon class="block sm:hidden mx-auto" />
                    <span class="hidden sm:block">Total :</span>
                  </td>
                  <td class="px-2 py-1">
                    <span class="block sm:hidden text-center">{{
                      Dashboard.total_anggota
                    }}</span>
                    <span class="hidden sm:block"
                      >{{ Dashboard.total_anggota }} Anggota</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>

            <Dropdown
              class="sm:ml-auto ml-3 btn bg-primary flex items-center"
              v-show="data.role == 'Operator'"
            >
              <DropdownToggle tag="a" href="javascript:;">
                <PlusIcon class="w-6 h-6 text-white" />
              </DropdownToggle>
              <DropdownMenu class="w-40">
                <DropdownContent>
                  <DropdownItem @click="openDataModal()">
                    <PlusIcon class="w-4 h-4 mr-2" /> Tambah Data
                  </DropdownItem>
                  <DropdownItem @click="openDetailModal()">
                    <CalendarPlusIcon class="w-4 h-4 mr-2" /> Tambah Detail
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </Dropdown>
            <a href="" class="ml-3 flex btn items-center text-primary">
              <RefreshCcwIcon class="w-4 h-4 sm:mr-3 sm:m-0 m-2" />
              <p class="hidden sm:inline-block">Refresh Data</p>
            </a>
          </div>
          <div class="mt-5">
            <DataList
              v-if="Dashboard.items.length !== 0"
              v-for="detail in Dashboard.items"
              :key="detail.id_utama"
              :detail="detail"
              :objectFiles="
                JSON.parse(
                  detail.file_gambar[0].data
                    .map((b) => String.fromCharCode(b))
                    .join('')
                )
              "
              @openModalRemoveData="openModalRemoveData"
              @updateData="openupdateData"
              :data="data"
            />
          </div>
        </div>
        <!-- END: General Report -->
      </div>
    </div>
    <div class="col-span-12 xl:col-span-3">
      <div class="xl:border-l -mb-10 pb-10">
        <div class="xl:pl-6 grid grid-cols-12 gap-x-6 xl:gap-x-0 gap-y-6">
          <!-- BEGIN: Important Notes -->
          <div
            class="col-span-12 xl:col-span-12 xl:col-start-1 xl:row-start-1 mt-3 xl:mt-8 - mb-5"
          >
            <div class="intro-x flex items-center h-10 z-0">
              <h2 class="text-lg font-medium truncate mr-auto w-2/4">
                Detail Data
              </h2>
              <div class="relative xl:w-2/4 w-56 xl:mx-auto ml-auto">
                <div
                  class="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"
                >
                  <CalendarIcon class="w-4 h-4" />
                </div>
                <Litepicker
                  v-model="date_select"
                  ref-key="monthDetailSelect"
                  :options="{
                    autoApply: true,
                    showWeekNumbers: false,
                    dropdowns: {
                      minYear: new Date(Date.now()).getFullYear() - 10,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }"
                  class="form-control pl-14"
                />
              </div>
            </div>
            <ChildList
              v-if="Dashboard.items2.length !== 0"
              v-for="detail in Dashboard.items2"
              :key="detail.id_tabel_anggota"
              :detail="detail"
              @openModalRemove="openModalRemove"
              @updateTotalAnggota="openupdateTotalAnggota"
              :data="data"
            />
          </div>
          <!-- END: Important Notes -->
        </div>
      </div>
    </div>
  </div>
  <div
    v-show="isLoading"
    wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
  >
    <Loader2Icon
      class="motion-safe:animate-spin stroke-[10px] text-white h-12 w-12 mb-4"
    />
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">
      Ini mungkin memakan waktu beberapa detik, tolong jangan tutup halaman ini.
    </p>
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal
    :show="deleteConfirmationModal"
    @hidden="deleteConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <TrashIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div v-if="data_utama" class="text-xl mt-5">
          Apakah Anda yakin akan menghapus Region
          <b> {{ itemDel.id_region }} - {{ itemDel.nama_region }} </b> ? <br />
          <small
            >Jika anda Menghapus Region ini, Anda juga akan menghapus detail
            tiap bulanya</small
          >
          <br />
          <small>{{ itemDel.id_utama }}</small>
        </div>

        <div v-else class="text-xl mt-5">
          Apakah Anda yakin akan menghapus Data Bulan
          <b>
            {{ moment(itemDel.periode_bulanan).format("MMM, YYYY") }} -
            {{ itemDel.id_region }}</b
          >
          ? <br />
          <small>{{ itemDel.id_tabel_anggota }}</small>
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="resetModal"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="
            data_utama
              ? removeData(itemDel.id_utama)
              : removeItem(itemDel.id_tabel_anggota)
          "
        >
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->
  <Modal
    backdrop="static"
    size="modal-xl"
    :show="ModalData"
    @hidden="ModalData = false"
  >
    <ModalHeader>
      <h2 v-if="isEdit" class="font-medium text-base mr-auto">
        Edit Data {{ more_edit }}
      </h2>
      <h2 v-else class="font-medium text-base mr-auto">Tambah Data</h2>
    </ModalHeader>
    <ModalBody>
      <form @submit.prevent="!isEdit ? addData() : updateData()" id="DataForm">
        <div
          class="text-slate-600 dark:text-slate-500 leading-relaxed text-center px-5"
        >
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name"
              >
                Kota / Kabupaten
              </label>
            </div>
            <div class="md:w-3/4">
              <input
                type="text"
                placeholder="Nama Kota/ kabupaten"
                v-model="input_kota_kabupaten"
                disabled
                class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-password"
              >
                Alamat Sekretariatan
              </label>
            </div>
            <div class="md:w-3/4">
              <textarea
                type="text"
                placeholder="Alamat Sekretariatan"
                v-model="input_alamat"
                class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
              ></textarea>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name"
              >
                No Telepon / WA
              </label>
            </div>
            <div class="md:w-3/4">
              <input
                type="text"
                placeholder="No Telepon / WA"
                v-model="input_nomer"
                class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name"
              >
                Masa Kepengurusan
              </label>
            </div>
            <div class="md:w-3/4">
              <Litepicker
                v-model="start_jabatan"
                :options="{
                  autoApply: true,
                  dropdowns: {
                    minYear: new Date(Date.now()).getFullYear() - 10,
                    maxYear: new Date(Date.now()).getFullYear() + 10,
                    months: true,
                    years: true,
                  },
                }"
                class="w-1/3 sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
              />
              <p class="w-1/3 mx-auto inline-block">s.d.</p>
              <Litepicker
                v-model="end_jabatan"
                :options="{
                  autoApply: true,
                  dropdowns: {
                    minYear: new Date(Date.now()).getFullYear() - 10,
                    maxYear: new Date(Date.now()).getFullYear() + 10,
                    months: true,
                    years: true,
                  },
                }"
                class="w-1/3 sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name"
              >
                Foto Kantor & Plang Nama
              </label>
            </div>
            <div class="md:w-3/4">
              <div
                class="w-full sm:p-3 py-1 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
              >
                <div class="grid grid-cols-3 gap-2">
                  <!-- Upload Gambar Depan -->
                  <div class="relative">
                    <label class="block font-medium mb-2">Tampak Depan</label>
                    <input
                      class="cursor-pointer w-full text-sm"
                      type="file"
                      ref="gambarDepanInput"
                      @change="previewFile($event, 'gambarDepan')"
                      accept="image/*"
                    />
                    <div v-if="preview.gambarDepan" class="relative">
                      <img
                        :src="preview.gambarDepan"
                        alt="Gambar Depan"
                        class="w-full object-contain h-40 mt-4 border rounded"
                      />
                      <button
                        @click="removeFile('gambarDepan')"
                        type="button"
                        class="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <!-- Upload Gambar Dalam -->
                  <div class="relative border-r border-l px-2 border-gray-400">
                    <label class="block font-medium mb-2">Tampak Dalam</label>
                    <input
                      class="cursor-pointer w-full text-sm"
                      type="file"
                      ref="gambarDalamInput"
                      @change="previewFile($event, 'gambarDalam')"
                      accept="image/*"
                    />
                    <div v-if="preview.gambarDalam" class="relative">
                      <img
                        :src="preview.gambarDalam"
                        alt="Gambar Dalam"
                        class="w-full object-contain h-40 mt-4 border rounded"
                      />
                      <button
                        @click="removeFile('gambarDalam')"
                        type="button"
                        class="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <!-- Upload Gambar Papan -->
                  <div class="relative">
                    <label class="block font-medium mb-2">Plang Nama</label>
                    <input
                      class="cursor-pointer w-full text-sm"
                      type="file"
                      ref="gambarPapanInput"
                      @change="previewFile($event, 'gambarPapan')"
                      accept="image/*"
                    />
                    <div v-if="preview.gambarPapan" class="relative">
                      <img
                        :src="preview.gambarPapan"
                        alt="Gambar Papan"
                        class="w-full object-contain h-40 mt-4 border rounded"
                      />
                      <button
                        @click="removeFile('gambarPapan')"
                        type="button"
                        class="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <!-- ... Add other elements here ... -->
                </div>
              </div>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name"
              >
                Softfile SK
              </label>
            </div>
            <div class="relative md:w-3/4">
              <div
                class="w-full sm:p-3 py-1 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
              >
                <div>
                  <input
                    class="cursor-pointer"
                    type="file"
                    ref="fileInput"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    @change="previewFile($event, 'file')"
                  />
                  <button
                    v-if="preview.file"
                    @click="removeFile('file')"
                    type="button"
                    class="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Hapus
                  </button>

                  <div v-if="preview.file">
                    <embed
                      :src="preview.file"
                      type="application/pdf"
                      class="w-full h-80 mt-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name"
              >
                Akun Media Sosial
              </label>
            </div>
            <div class="relative md:w-1/4">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <LinkIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                v-model="input_web"
                class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
                type="text"
                placeholder="Alamat Website"
              />
            </div>
            <div class="relative md:w-1/4">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <FacebookIcon
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                />
              </div>
              <input
                v-model="input_fb"
                class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
                type="text"
                placeholder="Nama Akun Facebook"
              />
            </div>
            <div class="relative md:w-1/4">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <InstagramIcon
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                />
              </div>
              <input
                v-model="input_ig"
                class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
                type="text"
                placeholder="Nama Akun Instagram"
              />
            </div>
          </div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="resetModal()"
        class="btn btn-outline-secondary w-32 mr-1"
      >
        Cancel
      </button>
      <button type="submit" form="DataForm" class="btn btn-primary w-32">
        Simpan
      </button>
    </ModalFooter>
  </Modal>

  <Modal
    backdrop="static"
    size="modal-md"
    :show="ModalDetail"
    @hidden="ModalDetail = false"
  >
    <ModalHeader>
      <h2 v-if="isEdit" class="font-medium text-base mr-auto">
        Edit Detail
        {{ moment(more_edit.periode_bulanan).format("MMM, YYYY") }} -
        {{ more_edit.id_region }}
      </h2>
      <h2 v-else class="font-medium text-base mr-auto">Tambah Detail</h2>
    </ModalHeader>
    <ModalBody class="">
      <form
        @submit.prevent="!isEdit ? addDetail() : updateDetail()"
        id="DetailForm"
      >
        <label for="date-picker" class="form-label">Bulan / Waktu</label>
        <div id="date-picker" class="relative w-full mx-auto mb-5">
          <div
            class="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"
          >
            <CalendarIcon class="w-4 h-4" />
          </div>
          <Litepicker
            v-model="date_bulanan"
            ref-key="monthDetailSelect2"
            :options="{
              autoApply: true,
              showWeekNumbers: true,
              dropdowns: {
                minYear: new Date(Date.now()).getFullYear() - 10,
                maxYear: null,
                months: true,
                years: true,
              },
            }"
            class="form-control pl-12"
          />
        </div>
        <label for="regular-form-1" class="form-label">Anggota KTA</label>
        <input
          v-model="anggota_kta"
          id="regular-form-1"
          type="number"
          class="form-control mb-5"
          placeholder="Jumlah Total Anggota"
        />
        <label for="regular-form-1" class="form-label">Anggota Non KTA</label>
        <input
          v-model="anggota_non_kta"
          id="regular-form-1"
          type="number"
          class="form-control mb-5"
          placeholder="Jumlah Total Anggota"
        />
        <label for="regular-form-1" class="form-label">Total Anggota</label>
        <input
          v-model="anggota_bulanan"
          id="regular-form-1"
          type="number"
          class="form-control"
          placeholder="Jumlah Total Anggota"
        />
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="resetModal()"
        class="btn btn-outline-secondary w-32 mr-1"
      >
        Cancel
      </button>
      <button type="submit" form="DetailForm" class="btn btn-primary w-32">
        Simpan
      </button>
    </ModalFooter>
  </Modal>

  <ModalDatabaseError ref="modalErrorRef" />
</template>

<script setup>
import DataList from "./DataList.vue";
import ChildList from "./ChildList.vue";
import ModalDatabaseError from "@/components/modal-error/Main.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { ref, provide, onMounted, watch, onBeforeUnmount } from "vue";
import moment from "moment";
import { useAuthStore } from "@/stores/auth";
const Auth = useAuthStore();
const isLoading = ref(false);

const ModalData = ref(false);
const ModalDetail = ref(false);
const isEdit = ref(false);
const data_utama = ref(false);
const deleteConfirmationModal = ref(false);
const publicPath = import.meta.env.VITE_APP_BASE_API;
const Dashboard = useDashboardStore();
const monthDetailSelect = ref();
const monthDetailSelect2 = ref();

const modalErrorRef = ref();
const date_select = ref(moment(new Date().setDate(1)).format("D MMM, YYYY"));
const data = ref([]);
const data_select = ref(
  localStorage.getItem("data_region")
    ? localStorage.getItem("data_region")
    : "JTG-01"
);

const date_bulanan = ref(moment(new Date().setDate(1)).format("D MMM, YYYY"));
const anggota_bulanan = ref(0);
const anggota_kta = ref(0);
const anggota_non_kta = ref(0);
const more_edit = ref("");
const itemDel = ref("");
const id_utama = ref("");
const input_kota_kabupaten = ref("");
const input_alamat = ref("");
const input_nomer = ref("");
const file_upload = ref([]);
const start_jabatan = ref("");
const end_jabatan = ref("");
const sk_file = ref();
const input_web = ref("");
const input_fb = ref("");
const input_ig = ref("");

const gambarDepanInput = ref(null);
const gambarDalamInput = ref(null);
const gambarPapanInput = ref(null);
const fileInput = ref(null);
const upload = ref({
  gambarDepan: null,
  gambarDalam: null,
  gambarPapan: null,
  file: null,
});
const preview = ref({
  gambarDepan: null,
  gambarDalam: null,
  gambarPapan: null,
  file: null,
});
const lama = ref({
  gambarDepan: null,
  gambarDalam: null,
  gambarPapan: null,
  file: null,
});

function previewFile(event, key) {
  const file = event.target.files[0];
  upload.value[key] = file;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    preview.value[key] = reader.result;
  };
}

function removeFile(key) {
  preview.value[key] = null;
  upload.value[key] = null;

  let fileInput;
  if (key == "file") {
    fileInput = fileInput;
  } else if (key == "gambarPapan") {
    fileInput = gambarPapanInput;
  } else if (key == "gambarDalam") {
    fileInput = gambarDalamInput;
  } else if (key == "gambarDepan") {
    fileInput = gambarDepanInput;
  }
  if (fileInput) {
    fileInput.value.value = "";
  }
}

provide("bind[monthDetailSelect]", (el) => {
  monthDetailSelect.value = el;
});
provide("bind[monthDetailSelect2]", (el) => {
  monthDetailSelect2.value = el;
});

const resetModal = () => {
  isLoading.value = false;
  ModalData.value = false;
  ModalDetail.value = false;
  isEdit.value = false;
  data_utama.value = false;
  deleteConfirmationModal.value = false;
  date_select.value = moment(new Date().setDate(1)).format("D MMM, YYYY");

  date_bulanan.value = moment(new Date().setDate(1)).format("D MMM, YYYY");
  anggota_bulanan.value = 0;
  anggota_kta.value = 0;
  anggota_non_kta.value = 0;
  more_edit.value = "";
  itemDel.value = "";

  id_utama.value = "";
  input_kota_kabupaten.value = "";
  input_alamat.value = "";
  input_nomer.value = "";
  file_upload.value = [];
  start_jabatan.value = "";
  end_jabatan.value = "";
  sk_file.value = "";
  input_web.value = "";
  input_fb.value = "";
  input_ig.value = "";

  upload.value.gambarDepan = null;
  upload.value.gambarDalam = null;
  upload.value.gambarPapan = null;
  upload.value.file = null;
  preview.value.gambarDepan = null;
  preview.value.gambarDalam = null;
  preview.value.gambarPapan = null;
  preview.value.file = null;
  lama.value.gambarDepan = null;
  lama.value.gambarDalam = null;
  lama.value.gambarPapan = null;
  lama.value.file = null;
};
watch(data_select, async (e) => {
  Dashboard.getData(e, date_select.value);
  localStorage.setItem("data_region", e);
});
watch(anggota_kta, async (e) => {
  anggota_bulanan.value = e + anggota_non_kta.value;
});
watch(anggota_non_kta, async (e) => {
  anggota_bulanan.value = e + anggota_kta.value;
});

watch(date_select, async (e) => {
  if (Dashboard.items.length > 0) {
    Dashboard.getDetail(e, Dashboard.items[0].id_utama);
  } else {
    alert("Region yang anda pilih kosong atau belum memiliki data");
  }
});

const openDataModal = () => {
  if (Dashboard.items.length == 0) {
    input_kota_kabupaten.value = data_select.value;
    ModalData.value = true;
  } else {
    alert("Data Utama Telah dibuat Hapus untuk membuat ulang");
  }
};
const addData = () => {
  Dashboard.addData(
    input_kota_kabupaten.value,
    input_alamat.value,
    input_nomer.value,
    upload.value.gambarDepan,
    upload.value.gambarDalam,
    upload.value.gambarPapan,
    upload.value.file,
    moment(new Date(start_jabatan.value)).format("YYYY-MM-DD"),
    moment(new Date(end_jabatan.value)).format("YYYY-MM-DD"),
    input_web.value,
    input_fb.value,
    input_ig.value
  );
  resetModal();
};
function getFileUrl(file) {
  if (file) {
    // var surat = file.data.map((b) => String.fromCharCode(b)).join("");
    // return new URL(`${publicPath}file_sk/${surat}`).href;
    return new URL(`${publicPath}file_sk/${file}`).href;
  } else {
    return `${new URL(window.location.origin)}` + " 404.png";
  }
}
function getImgUrl(gambar) {
  if (gambar) {
    // var images = gambar.data.map((b) => String.fromCharCode(b)).join("");
    // return new URL(`${publicPath}gambar_kantor/${images}`).href;
    return new URL(`${publicPath}gambar_kantor/${gambar}`).href;
  } else {
    return `${new URL(window.location.origin)}` + " 404.png";
  }
}

const openupdateData = (detail) => {
  id_utama.value = detail.id_utama;
  input_kota_kabupaten.value = detail.id_region;
  input_alamat.value = detail.alamat;
  input_nomer.value = detail.no_telepon;

  if (detail.periode !== null) {
    start_jabatan.value = moment(detail.periode[0]).format("D MMM, YYYY");
    end_jabatan.value = moment(detail.periode[1]).format("D MMM, YYYY");
  }
  if (detail.medsos !== null) {
    input_web.value = detail.medsos[0];
    input_fb.value = detail.medsos[1];
    input_ig.value = detail.medsos[2];
  }
  upload.value.gambarDepan = null;
  upload.value.gambarDalam = null;
  upload.value.gambarPapan = null;
  upload.value.file = null;

  preview.value.gambarDepan = detail.gambar_depan
    ? getImgUrl(detail.gambar_depan)
    : null;
  preview.value.gambarDalam = detail.gambar_dalam
    ? getImgUrl(detail.gambar_dalam)
    : null;
  preview.value.gambarPapan = detail.gambar_papan
    ? getImgUrl(detail.gambar_papan)
    : null;
  preview.value.file = detail.file_sk ? getFileUrl(detail.file_sk) : null;

  lama.value.gambarDepan = detail.gambar_depan ? detail.gambar_depan : null;
  lama.value.gambarDalam = detail.gambar_dalam ? detail.gambar_dalam : null;
  lama.value.gambarPapan = detail.gambar_papan ? detail.gambar_papan : null;
  lama.value.file = detail.file_sk ? detail.file_sk : null;
  isEdit.value = true;
  ModalData.value = true;
};
const updateData = () => {
  Dashboard.updateData(
    id_utama.value,
    input_kota_kabupaten.value,
    input_alamat.value,
    input_nomer.value,
    upload.value.gambarDepan,
    upload.value.gambarDalam,
    upload.value.gambarPapan,
    upload.value.file,
    lama.value.gambarDepan,
    lama.value.gambarDalam,
    lama.value.gambarPapan,
    lama.value.file,
    moment(new Date(start_jabatan.value)).format("YYYY-MM-DD"),
    moment(new Date(end_jabatan.value)).format("YYYY-MM-DD"),
    input_web.value,
    input_fb.value,
    input_ig.value
  );
  resetModal();
};

const openModalRemoveData = (detail) => {
  itemDel.value = detail;
  lama.value.gambarDepan = detail.gambar_depan ? detail.gambar_depan : null;
  lama.value.gambarDalam = detail.gambar_dalam ? detail.gambar_dalam : null;
  lama.value.gambarPapan = detail.gambar_papan ? detail.gambar_papan : null;
  lama.value.file = detail.file_sk ? detail.file_sk : null;
  data_utama.value = true;
  deleteConfirmationModal.value = true;
};
const removeData = (e) => {
  Dashboard.removeData(
    e,
    lama.value.gambarDepan,
    lama.value.gambarDalam,
    lama.value.gambarPapan,
    lama.value.file
  );
  resetModal();
};
//----------------------------------------------------------------
const openDetailModal = () => {
  if (Dashboard.items.length > 0) {
    ModalDetail.value = true;
  } else {
    alert("Isi Data Utama terlebih dahulu");
  }
};
const addDetail = () => {
  Dashboard.addDetail(
    moment(new Date(date_bulanan.value)).format("YYYY-MM-DD"),
    anggota_bulanan.value,
    anggota_kta.value,
    anggota_non_kta.value,
    Dashboard.items[0].id_utama
  )
    .then((data) => {
      resetModal();
      date_select.value = moment(data).format("D MMM, YYYY");
    })
    .catch((e) => {
      alert("Add Detail Error: " + e);
    });
};

const openupdateTotalAnggota = (detail) => {
  more_edit.value = detail;
  date_bulanan.value = moment(
    new Date(detail.periode_bulanan).setDate(1)
  ).format("D MMM, YYYY");
  anggota_bulanan.value = detail.jumlah_anggota;
  anggota_kta.value = detail.anggota_kta == null ? 0 : detail.anggota_kta;
  anggota_non_kta.value =
    detail.anggota_non_kta == null ? 0 : detail.anggota_non_kta;
  isEdit.value = true;
  ModalDetail.value = true;
};
const updateDetail = () => {
  Dashboard.updateDetail(
    moment(new Date(date_bulanan.value)).format("YYYY-MM-DD"),
    anggota_bulanan.value,
    anggota_kta.value,
    anggota_non_kta.value
  )
    .then((data) => {
      resetModal();
      date_select.value = moment(data).format("D MMM, YYYY");
    })
    .catch((e) => {
      alert("Add Detail Error: " + e);
    });
};

const openModalRemove = (detail) => {
  itemDel.value = detail;
  deleteConfirmationModal.value = true;
};
const removeItem = (e) => {
  Dashboard.removeDetail(e);
  resetModal();
};

onMounted(async function () {
  const elmonthDetailSelect = monthDetailSelect.value;
  elmonthDetailSelect.Litepicker.on("render:day", (day, date) => {
    if (date.getDate() !== 1) {
      day.classList.add("is-locked");
      day.setAttribute("tabindex", -1);
    }
  });
  const elmonthDetailSelect2 = monthDetailSelect2.value;
  elmonthDetailSelect2.Litepicker.on("render:day", (day, date) => {
    if (date.getDate() !== 1) {
      day.classList.add("is-locked");
      day.setAttribute("tabindex", -1);
    }
  });
  try {
    isLoading.value = true;
    data.value = await Dashboard.readItem(date_select.value, data_select.value);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
    modalErrorRef.value.errorDatabaseModal = true;
  }
});
</script>
