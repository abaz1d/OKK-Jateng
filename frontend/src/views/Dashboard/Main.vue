<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="intro-y flex items-center h-10">
            <div v-if="data.role !== 'Operator'" class=" w-auto rounded-lg flex">
              <div
                class="z-30 rounded-l w-auto px-1 flex items-center justify-center bg-gray-100 border text-gray-600 dark:bg-dark-1 dark:border-dark-4 -mr-1">
                <UsersIcon class="mr-1"/> {{ Dashboard.total_anggota }}
              </div>
              <TomSelect v-model="data_select" class="w-full">
                <option value="kosong" disabled>
                  --&gt; Total Anggota {{ Dashboard.total_anggota }} dari 35 Kota/ Kab&lt;--
                </option>
                <option v-for="region in Dashboard.regions" :key="region.id_region" :region="region"
                  :value="region.id_region">
                  {{ region.id_region }} -
                  {{ region.nama_region }}
                </option>
              </TomSelect>
            </div>
            <h2 v-else class="text-lg font-medium truncate mr-5">{{ data.id_region }} - {{ data.nama_region }}</h2>
           
            <Dropdown class="sm:ml-auto ml-3 btn bg-primary flex items-center" v-show="data.role !== 'Admin'">
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
              <RefreshCcwIcon class="w-4 h-4 mr-3" />
              <p class="hidden sm:inline-block">Refresh Data</p>
            </a>
          </div>
          <div class="mt-5">
            <DataList v-if="Dashboard.items.length !== 0" v-for="detail in Dashboard.items" :key="detail.id_utama"
              :detail="detail" @openModalRemoveData="openModalRemoveData" @updateData="openupdateData" :data="data"/>
          </div>

        </div>
        <!-- END: General Report -->
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-3">
      <div class="2xl:border-l -mb-10 pb-10">
        <div class="2xl:pl-6 grid grid-cols-12 gap-x-6 2xl:gap-x-0 gap-y-6">
          <!-- BEGIN: Important Notes -->
          <div
            class="col-span-12 xl:col-span-12 xl:col-start-1 xl:row-start-1 2xl:col-start-auto 2xl:row-start-auto mt-3 2xl:mt-8 -mb-5">
            <div class="intro-x flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-auto w-2/4">
                Detail Data
              </h2>
              <div class="relative 2xl:w-2/4 w-56 2xl:mx-auto ml-auto">
                <div
                  class="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                  <CalendarIcon class="w-4 h-4" />
                </div>
                <Litepicker v-model="date_select" ref-key="monthDetailSelect" :options="{
                  autoApply: true,
                  showWeekNumbers: false,
                  dropdowns: {
                    minYear: new Date(Date.now()).getFullYear() - 10,
                    maxYear: null,
                    months: true,
                    years: true,
                  },
                }" class="form-control pl-14" />
              </div>
            </div>
            <ChildList v-if="Dashboard.items2.length !== 0" v-for="detail in Dashboard.items2"
              :key="detail.id_tabel_anggota" :detail="detail" @openModalRemove="openModalRemove"
              @updateTotalAnggota="openupdateTotalAnggota" :data="data"/>
          </div>
          <!-- END: Important Notes -->

        </div>
      </div>
    </div>
  </div>
  <div v-show="isLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <Loader2Icon class="motion-safe:animate-spin stroke-[10px] text-white h-12 w-12 mb-4" />
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">
      Ini mungkin memakan waktu beberapa detik, tolong jangan tutup halaman ini.
    </p>
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal :show="deleteConfirmationModal" @hidden="deleteConfirmationModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <TrashIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div v-if="data_utama" class="text-xl mt-5">
          Apakah Anda yakin akan menghapus Region
          <b> {{ itemDel.id_region }} - {{ itemDel.nama_region }} </b> ? <br>
          <small>Jika anda Menghapus Region ini, Anda juga akan menghapus detail tiap bulanya</small> <br>
          <small>{{ itemDel.id_utama }}</small>
        </div>

        <div v-else class="text-xl mt-5">
          Apakah Anda yakin akan menghapus Data Bulan <b> {{ moment(itemDel.periode_bulanan).format("MMM, YYYY") }} - {{
            itemDel.id_region
          }}</b> ? <br>
          <small>{{ itemDel.id_tabel_anggota }}</small>
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="resetModal" class="btn btn-outline-secondary w-24 mr-1">
          Cancel
        </button>
        <button type="button" class="btn btn-danger w-24" @click="
          data_utama ?
            removeData(itemDel.id_utama)
            : removeItem(itemDel.id_tabel_anggota)
        ">
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->
  <Modal backdrop="static" size="modal-xl" :show="ModalData" @hidden="ModalData = false">
    <ModalHeader>
      <h2 v-if="isEdit" class="font-medium text-base mr-auto">Edit Data {{ more_edit }}</h2>
      <h2 v-else class="font-medium text-base mr-auto">Tambah Data</h2>
    </ModalHeader>
    <ModalBody>
      <form @submit.prevent="!isEdit ? addData() : updateData()" id="DataForm">
        <div class="text-slate-600 dark:text-slate-500 leading-relaxed text-center px-5">
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name">
                Kota / Kabupaten
              </label>
            </div>
            <div class="md:w-3/4">
              <input type="text" placeholder="Nama Kota/ kabupaten" v-model="input_kota_kabupaten" disabled
                class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400" />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-password">
                Alamat Sekretariatan
              </label>
            </div>
            <div class="md:w-3/4">
              <textarea type="text" placeholder="Alamat Sekretariatan" v-model="input_alamat"
                class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"></textarea>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name">
                No Telepon / WA
              </label>
            </div>
            <div class="md:w-3/4">
              <input type="text" placeholder="No Telepon / WA" v-model="input_nomer"
                class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400" />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name">
                Masa Kepengurusan
              </label>
            </div>
            <div class="md:w-3/4">
              <Litepicker v-model="start_jabatan" :options="{
                autoApply: true,
                dropdowns: {
                  minYear: new Date(Date.now()).getFullYear() - 10,
                  maxYear: new Date(Date.now()).getFullYear() + 10,
                  months: true,
                  years: true,
                },
              }"
                class="w-1/3 sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400" />
              <p class="w-1/3 mx-auto inline-block">s.d.</p>
              <Litepicker v-model="end_jabatan" :options="{
                autoApply: true,
                dropdowns: {
                  minYear: new Date(Date.now()).getFullYear() - 10,
                  maxYear: new Date(Date.now()).getFullYear() + 10,
                  months: true,
                  years: true,
                },
              }"
                class="w-1/3 sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400" />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name">
                Foto Kantor & Plang Nama
              </label>
            </div>
            <div class="md:w-3/4">
              <div
                class="w-full sm:p-3 py-1 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white  outline-none focus:border-blue-400">
                <Dropzone ref-key="dropzoneMultipleRef" :options="{
                  url: 'https://httpbin.org/post',
                  acceptedFiles: 'image/*',
                  thumbnailWidth: 150,
                  maxFilesize: 1.5,
                  maxFiles: 3,
                  addRemoveLinks: true,
                  headers: { 'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Mashape-Authorization' },
                }" class="dropzone">
                  <UploadIcon class="w-10 h-10 mx-auto -mt-8" />
                  <div class="text-lg font-medium">
                    Drop files here or click to upload.
                  </div>
                  <div class="text-gray-600 dark:text-white -mb-8">
                    Maks 3 Foto, Urutan File, Mulai dari kiri <br>
                    <span class="font-medium">Tampak Depan, Tampak Belakang, Plang Nama</span>.
                  </div>
                </Dropzone>
                <small v-if="isEdit">* Untuk Merubah Foto, HAPUS SEMUA Foto Lama terlebih dahulu</small>
              </div>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name">
                Softfile SK
              </label>
            </div>
            <div class="relative md:w-3/4">
              <div
                class="w-full sm:p-3 py-1 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white  outline-none focus:border-blue-400">
                <Dropzone ref-key="dropzoneSingleRef" :options="{
                  url: 'https://httpbin.org/post',
                  acceptedFiles: 'application/pdf',
                  thumbnailWidth: 150,
                  addRemoveLinks: true,
                  maxFilesize: 1.5,
                  maxFiles: 1,
                  headers: { 'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Mashape-Authorization' },
                }" class="dropzone">
                  <UploadIcon class="w-10 h-10 mx-auto -mt-8" />
                  <div class="text-lg font-medium">
                    Drop files here or click to upload.
                  </div>
                  <div class="text-gray-600 dark:text-white -mb-10">
                    <span class="font-medium">File PDF</span>.
                  </div>
                </Dropzone>
                <small v-if="isEdit">* Untuk Merubah File, HAPUS File terlebih dahulu</small>
              </div>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/4">
              <label
                class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                for="inline-full-name">
                Akun Media Sosial
              </label>
            </div>
            <div class="relative md:w-1/4">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LinkIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input v-model="input_web"
                class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
                type="text" placeholder="Alamat Website" />
            </div>
            <div class="relative md:w-1/4">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FacebookIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input v-model="input_fb"
                class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
                type="text" placeholder="Nama Akun Facebook" />
            </div>
            <div class="relative md:w-1/4">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <InstagramIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input v-model="input_ig"
                class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-black outline-none focus:border-blue-400"
                type="text" placeholder="Nama Akun Instagram" />
            </div>
          </div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" @click="resetModal()" class="btn btn-outline-secondary w-32 mr-1">
        Cancel
      </button>
      <button type="submit" form="DataForm" class="btn btn-primary w-32">
        Simpan
      </button>
    </ModalFooter>
  </Modal>

  <Modal backdrop="static" size="modal-md" :show="ModalDetail" @hidden="ModalDetail = false">
    <ModalHeader>
      <h2 v-if="isEdit" class="font-medium text-base mr-auto">Edit Detail {{
        moment(more_edit.periode_bulanan).format("MMM, YYYY")
      }} - {{ more_edit.id_region }}</h2>
      <h2 v-else class="font-medium text-base mr-auto">Tambah Detail</h2>
    </ModalHeader>
    <ModalBody class="">
      <form @submit.prevent="!isEdit ? addDetail() : updateDetail()" id="DetailForm">
        <label for="date-picker" class="form-label">Bulan / Waktu</label>
        <div id="date-picker" class="relative w-full mx-auto mb-5">
          <div
            class="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
            <CalendarIcon class="w-4 h-4" />
          </div>
          <Litepicker v-model="date_bulanan" ref-key="monthDetailSelect2" :options="{
            autoApply: true,
            showWeekNumbers: true,
            dropdowns: {
              minYear: new Date(Date.now()).getFullYear() - 10,
              maxYear: null,
              months: true,
              years: true,
            },
          }" class="form-control pl-12" />
        </div>
        <label for="regular-form-1" class="form-label">Total Anggota</label>
        <input v-model="anggota_bulanan" id="regular-form-1" type="number" class="form-control"
          placeholder="Jumlah Total Anggota" />
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" @click="resetModal()" class="btn btn-outline-secondary w-32 mr-1">
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
import DataList from "./DataList.vue"
import ChildList from "./ChildList.vue"
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
const dropzoneMultipleRef = ref();
const dropzoneSingleRef = ref();
const monthDetailSelect = ref();
const monthDetailSelect2 = ref();

const modalErrorRef = ref();
const date_select = ref(moment(new Date().setDate(1)).format("D MMM, YYYY"));
const data = ref([]);
const data_select = ref(localStorage.getItem("data_region") ? localStorage.getItem("data_region") : "JTG-01")

const date_bulanan = ref(moment(new Date().setDate(1)).format("D MMM, YYYY"));
const anggota_bulanan = ref()
const more_edit = ref("")
const itemDel = ref("")
const id_utama = ref("")
const input_kota_kabupaten = ref("")
const input_alamat = ref("")
const input_nomer = ref("")
const file_upload = ref([])
const start_jabatan = ref("")
const end_jabatan = ref("")
const sk_file = ref()
const input_web = ref("")
const input_fb = ref("")
const input_ig = ref("")

provide("bind[dropzoneMultipleRef]", (el) => {
  dropzoneMultipleRef.value = el;
});

provide("bind[dropzoneSingleRef]", (el) => {
  dropzoneSingleRef.value = el;
});

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
  anggota_bulanan.value = 0
  more_edit.value = ""
  itemDel.value = ""

  id_utama.value = ""
  input_kota_kabupaten.value = ""
  input_alamat.value = ""
  input_nomer.value = ""
  file_upload.value = []
  start_jabatan.value = ""
  end_jabatan.value = ""
  sk_file.value = ""
  input_web.value = ""
  input_fb.value = ""
  input_ig.value = ""
  dropzoneMultipleRef.value.dropzone.removeAllFiles(true)
  dropzoneSingleRef.value.dropzone.removeAllFiles(true)
}
watch(data_select, async (e) => {
  Dashboard.getData(e, date_select.value)
  localStorage.setItem("data_region", e);
});

watch(date_select, async (e) => {
  Dashboard.getDetail(e, Dashboard.items[0].id_utama)
});

const openDataModal = () => {
  if (Dashboard.items.length == 0) {
    input_kota_kabupaten.value = data_select.value
    ModalData.value = true;
  } else {
    alert("Data Utama Telah dibuat Hapus untuk membuat ulang")
  }
}
const addData = () => {
  Dashboard.addData(input_kota_kabupaten.value,
    input_alamat.value,
    input_nomer.value,
    file_upload.value[0],
    file_upload.value[1],
    file_upload.value[2],
    sk_file.value,
    moment(new Date(start_jabatan.value)).format("YYYY-MM-DD"),
    moment(new Date(end_jabatan.value)).format("YYYY-MM-DD"),
    input_web.value,
    input_fb.value,
    input_ig.value,
  );
  resetModal();
}
const getUrl = (data) => {
  if (data) {
    var images = data.data.map((b) => String.fromCharCode(b)).join("");
    return new URL(`${publicPath}gambar_kantor/${images}`).href;
  } else {
    return `${new URL(window.location.origin)}` + " 404.png";
  }
};
const getUrlSurat = (data) => {
  if (data) {
    var surat = data.data.map((b) => String.fromCharCode(b)).join("");
    return new URL(`${publicPath}file_sk/${surat}`).href;
  } else {
    return `${new URL(window.location.origin)}` + " 404.png";
  }
};

const openupdateData = (detail) => {
  id_utama.value = detail.id_utama
  input_kota_kabupaten.value = detail.id_region
  input_alamat.value = detail.alamat
  input_nomer.value = detail.no_telepon

  let callback = null; // Optional callback when it's done
  let crossOrigin = null; // Added to the `img` tag for crossOrigin handling
  let resizeThumbnail = false; // Tells Dropzone whether it should resize the image first
  if (detail.gambar !== null) {
    detail.gambar.map((data) => {
      let url = getUrl(data)
      let mockFile = { name: url.substring(url.lastIndexOf('/') + 1), size: data.data.toString().length, accepted: true };
      dropzoneMultipleRef.value.dropzone.displayExistingFile(mockFile, url, callback, crossOrigin, resizeThumbnail);
    })
  }
  file_upload.value = []

  if (detail.periode !== null) {
    start_jabatan.value = moment(detail.periode[0]).format("D MMM, YYYY")
    end_jabatan.value = moment(detail.periode[1]).format("D MMM, YYYY")
  }

  if (detail.file_sk !== null) {
    let url = getUrlSurat(detail.file_sk)
    let mockFile = { name: url.substring(url.lastIndexOf('/') + 1), size: detail.file_sk.data.toString().length, accepted: true };
    dropzoneSingleRef.value.dropzone.displayExistingFile(mockFile, url, callback, crossOrigin, resizeThumbnail);
  }
  sk_file.value = ""
  if (detail.medsos !== null) {
    input_web.value = detail.medsos[0]
    input_fb.value = detail.medsos[1]
    input_ig.value = detail.medsos[2]
  }
  isEdit.value = true;
  ModalData.value = true;
};
const updateData = () => {
  Dashboard.updateData(id_utama.value, input_kota_kabupaten.value,
    input_alamat.value,
    input_nomer.value,
    file_upload.value,
    sk_file.value,
    moment(new Date(start_jabatan.value)).format("YYYY-MM-DD"),
    moment(new Date(end_jabatan.value)).format("YYYY-MM-DD"),
    input_web.value,
    input_fb.value,
    input_ig.value,
  );
  resetModal();
}

const openModalRemoveData = (item) => {
  itemDel.value = item;
  data_utama.value = true;
  deleteConfirmationModal.value = true;
};
const removeData = (e) => {
  Dashboard.removeData(e)
  resetModal();
}
//----------------------------------------------------------------
const openDetailModal = () => {
  ModalDetail.value = true;
}
const addDetail = () => {
  Dashboard.addDetail(moment(new Date(date_bulanan.value)).format("YYYY-MM-DD"), anggota_bulanan.value, Dashboard.items[0].id_utama)
    .then((data) => {
      resetModal();
      date_select.value = moment(data).format("D MMM, YYYY")
    }).catch((e) => {
      alert("Add Detail Error: " + e);
    });
}

const openupdateTotalAnggota = (detail) => {
  more_edit.value = detail
  date_bulanan.value = moment(new Date(detail.periode_bulanan).setDate(1)).format("D MMM, YYYY")
  anggota_bulanan.value = detail.jumlah_anggota
  isEdit.value = true;
  ModalDetail.value = true;
};
const updateDetail = () => {
  Dashboard.updateDetail(moment(new Date(date_bulanan.value)).format("YYYY-MM-DD"), anggota_bulanan.value)
    .then((data) => {
      resetModal();
      date_select.value = moment(data).format("D MMM, YYYY")
    }).catch((e) => {
      alert("Add Detail Error: " + e);
    });
}

const openModalRemove = (detail) => {
  itemDel.value = detail;
  deleteConfirmationModal.value = true;
};
const removeItem = (e) => {
  Dashboard.removeDetail(e);
  resetModal();
}

onMounted(async function () {
  const elDropzoneMultipleRef = dropzoneMultipleRef.value;
  elDropzoneMultipleRef.dropzone.on("addedfile", (e) => {
    file_upload.value.push(e)
  });
  elDropzoneMultipleRef.dropzone.on("removedfile", (e) => {
    file_upload.value = file_upload.value.filter((item) => { return item.name != e.name })
  });
  elDropzoneMultipleRef.dropzone.on("error", () => {
    alert("Maksimal 3 Gambar");
  });

  const elDropzoneSingleRef = dropzoneSingleRef.value;
  elDropzoneSingleRef.dropzone.on("addedfile", (e) => {
    sk_file.value = e
  });
  elDropzoneSingleRef.dropzone.on("removedfile", () => {
    sk_file.value = ""
  });
  elDropzoneSingleRef.dropzone.on("error", () => {
    alert("Maksimal 1 File");
  });

  const elmonthDetailSelect = monthDetailSelect.value;
  elmonthDetailSelect.Litepicker.on('render:day', (day, date) => {
    if (date.getDate() !== 1) {
      day.classList.add("is-locked")
      day.setAttribute('tabindex', -1);
    }
  });
  const elmonthDetailSelect2 = monthDetailSelect2.value;
  elmonthDetailSelect2.Litepicker.on('render:day', (day, date) => {
    if (date.getDate() !== 1) {
      day.classList.add("is-locked")
      day.setAttribute('tabindex', -1);
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
