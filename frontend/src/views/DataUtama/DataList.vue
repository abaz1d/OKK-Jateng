<template>
  <!-- BEGIN: Users Layout -->
  <div class="col-span-12 md:col-span-6 xl:col-span-4 box">
    <div
      class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4"
    >
      <div class="w-10 h-10 flex-none image-fit">
        <img
          decoding="async"
          loading="lazy"
          width="100"
          height="100"
          :src="
            objectFiles?.gambar_papan?.length > 4
              ? getImgUrl(objectFiles.gambar_papan)
              : data404
          "
          alt="gambar_papan"
          data-action="zoom"
          class="rounded-full"
        />
      </div>
      <div class="ml-3 mr-auto">
        <!-- <a href="" class="font-medium"><span class="mx-1"><VerifiedIcon class="w-4 h-4 mr-1"/></span>Kota Semarang</a> -->
        <div class="flex truncate font-medium whitespace-normal">
          <span class="mx-1 my-auto">
            <VerifiedIcon
              class="w-4 h-4 mr-1 stroke-2 stroke-blue-500"
            /> </span
          >{{ detail.id_region }} - {{ detail.nama_region }}
        </div>
        <div
          class="flex text-slate-500 truncate text-xs my-2 whitespace-normal"
        >
          <span class="mx-1 my-auto"> <PhoneIcon class="w-4 h-4 mr-1" /> </span
          >{{ detail.no_telepon }}
        </div>
        <div class="flex text-slate-500 truncate text-xs whitespace-normal">
          <span class="mx-1 my-auto">
            <MapPinIcon class="w-4 h-4 mr-1" />
          </span>
          {{ detail.alamat }}
        </div>
      </div>
      <Dropdown class="ml-3" v-show="data.role == 'Operator'">
        <DropdownToggle
          tag="a"
          href="javascript:;"
          class="w-5 h-5 text-slate-500"
        >
          <MoreVerticalIcon class="w-5 h-5" />
        </DropdownToggle>
        <DropdownMenu class="w-40">
          <DropdownContent>
            <DropdownItem @click="openUpdate(detail)">
              <Edit2Icon class="w-4 h-4 mr-2" /> Edit Data
            </DropdownItem>
            <DropdownItem @click="openModal_Remove(detail)">
              <TrashIcon class="w-4 h-4 mr-2" /> Delete Data
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="p-5">
      <div class="h-40 2xl:h-56 image-fit px-5">
        <TinySlider
          :options="{
            autoplay: true,
            items: 1,
            controls: true,
            responsive: {
              600: {
                items: 3,
              },
              480: {
                items: 2,
              },
            },
          }"
        >
          <div class="h-40 2xl:h-56 px-2">
            <div
              class="h-full bg-slate-100 dark:bg-darkmode-400 rounded-md image-fit border-2 border-current"
            >
              <img
                decoding="async"
                loading="lazy"
                :src="
                  objectFiles?.gambar_depan?.length > 4
                    ? getImgUrl(objectFiles.gambar_depan)
                    : data404
                "
                alt="gambar[0]"
                data-action="zoom"
                class="w-full rounded-md"
              />
            </div>
            <div class="absolute bottom-0 px-5 pb-6 z-10">
              <span class="bg-white opacity-80 text-black px-2 py-1 rounded"
                >Tampak Depan</span
              >
            </div>
          </div>
          <div class="h-40 2xl:h-56 px-2">
            <div
              class="h-full bg-slate-100 dark:bg-darkmode-400 rounded-md image-fit border-2 border-current"
            >
              <img
                decoding="async"
                loading="lazy"
                :src="
                  objectFiles?.gambar_dalam?.length > 4
                    ? getImgUrl(objectFiles.gambar_dalam)
                    : data404
                "
                alt="gambar[1]"
                data-action="zoom"
                class="w-full rounded-md"
              />
            </div>
            <div class="absolute bottom-0 px-5 pb-6 z-10">
              <span class="bg-white opacity-80 text-black px-2 py-1 rounded"
                >Tampak Dalam</span
              >
            </div>
          </div>
          <div class="h-40 2xl:h-56 px-2">
            <div
              class="h-full bg-slate-100 dark:bg-darkmode-400 rounded-md image-fit border-2 border-current"
            >
              <img
                decoding="async"
                loading="lazy"
                :src="
                  objectFiles?.gambar_papan?.length > 4
                    ? getImgUrl(objectFiles.gambar_papan)
                    : data404
                "
                alt="gambar_papan"
                data-action="zoom"
                class="w-full rounded-md"
              />
            </div>
            <div class="absolute bottom-0 px-5 pb-6 z-10">
              <span class="bg-white opacity-80 text-black px-2 py-1 rounded"
                >Papan Nama</span
              >
            </div>
          </div>
          <div class="h-40 2xl:h-56 px-2">
            <div
              class="h-full bg-slate-100 dark:bg-darkmode-400 rounded-md image-fit border-2 border-current"
            >
              <img
                decoding="async"
                loading="lazy"
                :src="
                  objectFiles?.gambar_dalam?.length > 4
                    ? getImgUrl(objectFiles.gambar_dalam)
                    : data404
                "
                alt="gambar[1]"
                data-action="zoom"
                class="w-full rounded-md"
              />
            </div>
            <div class="absolute bottom-0 px-5 pb-6 z-10">
              <span class="bg-white opacity-80 text-black px-2 py-1 rounded"
                >Tampak Dalam</span
              >
            </div>
          </div>
        </TinySlider>
      </div>
    </div>
    <div
      class="flex items-center px-5 py-3 border-t border-slate-200/60 dark:border-darkmode-400"
    >
      <AccordionGroup class="accordion-boxed w-full">
        <AccordionItem>
          <Accordion class="justify-self-center">
            <p class="text-center">Klik Untuk Melihat Detail</p>
            <ChevronDownIcon class="mx-auto mt-0.5 h-6 w-6" />
          </Accordion>
          <AccordionPanel
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
                <div
                  class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  {{ detail.nama_region }}
                </div>
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
                <div
                  class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  {{ detail.alamat }}
                </div>
              </div>
            </div>
            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/4">
                <label
                  class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                  for="inline-full-name"
                >
                  No Telepon
                </label>
              </div>
              <div class="md:w-3/4">
                <div
                  class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  {{ detail.no_telepon }}
                </div>
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
                <div
                  class="w-full sm:pl-3 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  {{
                    moment(detail.periode ? detail.periode[0] : "").format(
                      "DD MMM YYYY"
                    )
                  }}
                  s.d.
                  {{
                    moment(detail.periode ? detail.periode[1] : "").format(
                      "DD MMM YYYY"
                    )
                  }}
                </div>
              </div>
            </div>
            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/4">
                <label
                  class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                  for="inline-full-name"
                >
                  Lampiran SK
                </label>
              </div>
              <div class="relative md:w-3/4">
                <div
                  class="w-full sm:pl-3 py-1 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  <embed
                    v-if="objectFiles?.file_sk?.length > 4"
                    :src="getFileUrl(objectFiles.file_sk)"
                    type="application/pdf"
                    class="w-full h-80 mt-4"
                  />
                  <span v-else>--</span>
                </div>
              </div>
            </div>
            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/4">
                <label
                  class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                  for="inline-full-name"
                >
                  Foto Kantor & Papan Nama
                </label>
              </div>
              <div class="md:w-3/4">
                <div
                  class="w-full sm:pl-3 py-1 sm:text-left text-center text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  <a
                    target="_blank"
                    :href="
                      objectFiles?.gambar_depan?.length > 4
                        ? getImgUrl(objectFiles.gambar_depan)
                        : data404
                    "
                    :download="
                      objectFiles?.gambar_depan?.length > 4
                        ? getImgUrl(objectFiles.gambar_depan)
                        : data404
                    "
                    class="btn sm:mr-5 mb-2 sm:mb-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <DownloadIcon class="w-5 h-5 mr-1 -mt-1 inline-block" />
                    Tampak Depan
                  </a>
                  <a
                    target="_blank"
                    :href="
                      objectFiles?.gambar_dalam?.length > 4
                        ? getImgUrl(objectFiles.gambar_dalam)
                        : data404
                    "
                    :download="
                      objectFiles?.gambar_dalam?.length > 4
                        ? getImgUrl(objectFiles.gambar_dalam)
                        : data404
                    "
                    class="btn sm:mr-5 mb-2 sm:mb-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <DownloadIcon class="w-5 h-5 mr-1 -mt-1 inline-block" />
                    Tampak Dalam
                  </a>
                  <a
                    target="_blank"
                    :href="
                      objectFiles?.gambar_papan?.length > 4
                        ? getImgUrl(objectFiles.gambar_papan)
                        : data404
                    "
                    :download="
                      objectFiles?.gambar_papan?.length > 4
                        ? getImgUrl(objectFiles.gambar_papan)
                        : data404
                    "
                    class="btn sm:mr-5 mb-2 sm:mb-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <DownloadIcon class="w-5 h-5 mr-1 -mt-1 inline-block" />
                    Papan Nama
                  </a>
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
                <div
                  class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  {{ detail.medsos ? detail.medsos[0] : "" }}
                </div>
              </div>
              <div class="relative md:w-1/4">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <FacebookIcon
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div
                  class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  {{ detail.medsos ? detail.medsos[1] : "" }}
                </div>
              </div>
              <div class="relative md:w-1/4">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <InstagramIcon
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div
                  class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  {{ detail.medsos ? detail.medsos[2] : "" }}
                </div>
              </div>
            </div>
            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/4">
                <label
                  class="block text-center sm:text-left text-gray-600 dark:text-white font-bold md:text-left mb-1 md:mb-0 sm:pr-4"
                  for="inline-full-name"
                >
                  Jumlah Anggota Terkini
                </label>
              </div>
              <div class="relative md:w-1/4">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <UserCheckIcon
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div
                  class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  KTA :
                  {{ detail.anggota_kta == null ? 0 : detail.anggota_kta }}
                </div>
              </div>
              <div class="relative md:w-1/4">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <UserXIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div
                  class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  Non-KTA :
                  {{
                    detail.anggota_non_kta == null ? 0 : detail.anggota_non_kta
                  }}
                </div>
              </div>
              <div class="relative md:w-1/4">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <UsersIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div
                  class="w-full pl-10 text-left py-2 text-sm border-0 border-b-2 border-gray-400 rounded-md dark:border-white dark:text-white outline-none focus:border-blue-400"
                >
                  Total :
                  {{
                    detail.jumlah_anggota == null ? 0 : detail.jumlah_anggota
                  }}
                </div>
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </div>
    <div
      class="px-5 pt-3 pb-5 border-t border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="w-full flex text-slate-500 text-xs sm:text-sm">
        <div class="mr-2">
          Dibuat:
          <span class="font-medium">{{
            moment(detail.create_date).format("DD MMM YYYY")
          }}</span>
        </div>
        <div class="ml-auto">
          Diedit:
          <span class="font-medium">{{
            moment(detail.update_date).format("DD MMM YYYY")
          }}</span>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Users Layout -->
</template>
<script>
import moment from "moment";
import { useDashboardStore } from "@/stores/dashboard";
const publicPath = import.meta.env.VITE_APP_BASE_API;

export default {
  setup() {
    const Dashboard = useDashboardStore();
    return { Dashboard, moment, publicPath };
  },
  props: {
    detail: { type: Object, required: true },
    data: { type: Object, required: true },
    objectFiles: { type: Object, required: true },
  },
  data() {
    return {
      data404: new URL(window.location.origin) + "404.png",
    };
  },
  emits: ["openModalRemoveData", "updateData"],
  methods: {
    async openUpdate(e) {
      const data = { ...e, ...this.objectFiles };
      delete data.file_gambar;
      this.$emit("updateData", data);
    },
    openModal_Remove(e) {
      const data = { ...e, ...this.objectFiles };
      delete data.file_gambar;
      this.$emit("openModalRemoveData", data);
    },
    getFileUrl(file) {
      if (file) {
        // var surat = file.data.map((b) => String.fromCharCode(b)).join("");
        // return new URL(`${publicPath}file_sk/${surat}`).href;
        return new URL(`${publicPath}file_sk/${file}`).href;
      } else {
        return `${new URL(window.location.origin)}` + " 404.png";
      }
    },
    getImgUrl(gambar) {
      if (gambar) {
        // var images = gambar.data.map((b) => String.fromCharCode(b)).join("");
        // return new URL(`${publicPath}gambar_kantor/${images}`).href;
        return new URL(`${publicPath}gambar_kantor/${gambar}`).href;
      } else {
        return `${new URL(window.location.origin)}` + " 404.png";
      }
    },
  },
};
</script>
