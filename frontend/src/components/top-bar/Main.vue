<template>
  <!-- BEGIN: Top Bar -->
  <div class="top-bar">
    <!-- BEGIN: Breadcrumb -->
    <nav aria-label="breadcrumb" class="-intro-x mr-auto hidden sm:flex">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a v-if="data.role === 'Operator'" href="#">{{ data.nama_region }}</a>
          <a v-else-if="data.role === 'Admin'" href="#">Admin</a>
          <a v-else href="#">Guest</a>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          <p class="capitalize">{{ $route.name.replace(/-/gi, " ") }}</p>
        </li>
      </ol>
    </nav>
    <!-- END: Breadcrumb -->
    <!-- BEGIN: Search -->
    <div class="intro-x relative mr-3 sm:mr-6">
      <div class="search hidden sm:block">
        <input
          type="text"
          class="search__input form-control border-transparent"
          placeholder="Search..."
          @focus="showSearchDropdown"
          @blur="
            hideSearchDropdown($event.target.value);
            $event.target.value = '';
          "
        />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
      <a class="notification notification--light sm:hidden">
        <SearchIcon
          class="notification__icon text-black dark:text-slate-500 hover:border-gray-300"
          @click="searchModal = true"
        />
      </a>
      <div class="search-result" :class="{ show: searchDropdown }">
        <div class="search-result__content">
          <div class="search-result__content__title">
            Jenis User & Hak Aksesnya
          </div>
          <div class="mb-5">
            <a href="#" class="flex items-center mt-3 zoom-in">
              <div
                class="w-8 h-8 bg-white stroke-2 stroke-black p-auto rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
              >
                <UserIcon
                  class="w-6 h-6 object-fill stroke-2 stroke-black fill-yellow-200 bg-white mt-1 mx-auto rounded-full"
                />
              </div>
              <div class="ml-3">
                <kbd
                  class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                  >Admin</kbd
                >
              </div>
              <div
                class="ml-auto w-auto truncate text-slate-500 text-xs text-right pr-3"
              >
                Memiliki Semua Fitur
              </div>
            </a>
            <a href="#" class="flex items-center mt-3 zoom-in">
              <div
                class="w-8 h-8 bg-white stroke-2 stroke-black p-auto rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
              >
                <HardHatIcon
                  class="w-6 h-6 object-fill stroke-2 stroke-black fill-yellow-200 bg-white mt-1 mx-auto rounded-full"
                />
              </div>
              <div class="ml-3">
                <kbd
                  class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                  >Operator</kbd
                >
              </div>
              <div
                class="ml-auto w-auto truncate text-slate-500 text-xs text-right pr-3"
              >
                Beberapa Menu/ Fitur
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Search -->
    <!-- BEGIN: Notifications -->
    <Dropdown class="intro-x mr-auto sm:mr-6">
      <DropdownToggle
        tag="div"
        role="button"
        aria-label="notif"
        class="inline-block relative notification notification--light cursor-pointer mt-1"
      >
        <BellIcon
          class="notification__icon text-white stroke-2 stroke-slate-500 fill-white"
        />
        <span
          class="motion-safe:animate-ping absolute top-0 right-0.5 block h-1.5 w-1.5 rounded-full ring-2 ring-green-300 bg-green-400"
        ></span>
        <span
          class="absolute top-0 right-0.5 block h-1.5 w-1.5 rounded-full ring-2 ring-green-300 bg-green-400"
        ></span>
      </DropdownToggle>
      <DropdownMenu class="notification-content pt-2">
        <DropdownContent tag="div" class="notification-content__box">
          <div class="notification-content__title">Status Database</div>
          <p>Terhubung</p>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
    <!-- END: Notifications -->
    <!-- BEGIN: Account Menu -->
    <Dropdown class="intro-x w-8 h-8">
      <DropdownToggle
        tag="div"
        role="button"
        aria-label="user"
        class="w-8 h-8 bg-white stroke-2 stroke-black p-auto rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
      >
        <SmileIcon
          v-if="data.role == 'Guest'"
          class="w-6 h-6 object-fill stroke-2 stroke-black fill-yellow-200 bg-white mt-1 mx-auto rounded-full"
        />
        <UserIcon
          v-else-if="data.role == 'Admin'"
          class="w-6 h-6 object-fill stroke-2 stroke-black fill-yellow-200 bg-white mt-1 mx-auto rounded-full"
        />
        <HardHatIcon
          v-else
          class="w-6 h-6 object-fill stroke-2 stroke-black fill-yellow-200 bg-white mt-1 mx-auto rounded-full"
        />
      </DropdownToggle>
      <DropdownMenu class="w-56">
        <DropdownContent class="bg-primary text-white">
          <DropdownHeader tag="div" class="!font-normal">
            <div class="font-medium">{{ data.username }}</div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">
              {{ data.role }} {{ data.role === "Operator" ? "-" : "" }}
              {{ data.nama_region }}
            </div>
          </DropdownHeader>
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="hover:bg-white/5" @click="profilModal = true">
            <SmileIcon v-if="data.role == 'Guest'" class="w-4 h-4 mr-2" />
            <UserIcon v-else-if="data.role == 'Admin'" class="w-4 h-4 mr-2" />
            <HardHatIcon v-else class="w-4 h-4 mr-2" />
            {{ data.role }}
          </DropdownItem>
          <RouterLink to="/semua-akun">
            <DropdownItem
              v-if="data.role == 'Super Admin'"
              class="hover:bg-white/5"
            >
              <UsersIcon class="w-4 h-4 mr-2" /> Semua Akun
            </DropdownItem>
          </RouterLink>
          <RouterLink
            :to="{ path: `${$route.matched[0].path + '/bantuan'}` }"
            replace
          >
            <DropdownItem class="hover:bg-white/5">
              <HelpCircleIcon class="w-4 h-4 mr-2 inline-block" /> Bantuan
            </DropdownItem>
          </RouterLink>
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem
            @click="logoutConfirmationModal = true"
            class="hover:bg-white/5 bg-danger justify-center text-white"
          >
            <LogOutIcon class="w-4 h-4 mr-2" />
            Logout
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->
  <!-- BEGIN: Delete Confirmation Modal -->
  <Modal
    :show="logoutConfirmationModal"
    @hidden="logoutConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <LogOutIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-xl mt-5">Apakah Anda yakin ingin Keluar ?</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="logoutConfirmationModal = false"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button @click="onLogout" type="button" class="btn btn-danger w-24">
          Keluar
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Delete Confirmation Modal -->
  <!-- BEGIN:Profile Content -->
  <Modal
    size="modal-xl"
    backdrop="static"
    :show="profilModal"
    @hidden="profilModal = false"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mx-auto dark:text-white">
        Profil User & Region
      </h2>
      <a
        @click="profilModal = false"
        class="absolute right-0 top-0 mt-3 mr-3"
        href="javascript:;"
      >
        <XIcon class="w-8 h-8 text-slate-400" />
      </a>
    </ModalHeader>
    <ModalBody class="p-8 pt-0 text-black">
      <div class="flex-auto">
        <div class="box zoom-in px-5">
          <h6
            class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase dark:text-white"
          >
            Profil User
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2 dark:text-white"
                >
                  ID User
                </label>
                <div
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  {{ data.userid }}
                </div>
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2 dark:text-white"
                >
                  Email User
                </label>
                <div
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  {{ data.email }}
                </div>
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2 dark:text-white"
                >
                  Username
                </label>
                <div
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  {{ data.username }}
                </div>
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2 dark:text-white"
                >
                  Role/ Jabatan
                </label>
                <div
                  class="flex items-start my-auto border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <SmileIcon
                    v-if="data.role == 'Guest'"
                    class="w-6 h-6 stroke-2 stroke-black fill-yellow-200 bg-white -mt-1 mr-2 rounded-full whitespace-nowrap"
                  />
                  <UserIcon
                    v-else-if="data.role == 'Admin'"
                    class="w-6 h-6 stroke-2 stroke-black fill-yellow-200 bg-white -mt-1 mr-2 rounded-full whitespace-nowrap"
                  />
                  <HardHatIcon
                    v-else
                    class="w-6 h-6 stroke-2 stroke-black fill-yellow-200 bg-white -mt-1 mr-2 rounded-full whitespace-nowrap"
                  />
                  {{ data.role }}
                </div>
              </div>
            </div>
            <div v-if="data.role == 'Operator'" class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2 dark:text-white"
                >
                  ID Region
                </label>
                <div
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  {{ data.id_region }}
                </div>
              </div>
            </div>
            <div v-if="data.role == 'Operator'" class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2 dark:text-white"
                >
                  Nama Region
                </label>
                <div
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  {{ data.nama_region }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END:Profile Content -->
  <!-- BEGIN:Search Content -->
  <Modal :show="searchModal" @hidden="searchModal = false">
    <ModalHeader class="flex items-center justify-center rounded-lg">
      <div class="relative mt-1 w-full">
        <input
          type="text"
          id="password"
          class="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Search..."
          ref="searchBar"
        />
        <button
          class="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors"
        >
          <SearchIcon />
        </button>
      </div>
      <div class="absolute top-0 left-0 w-full h-2 flex rounded-lg">
        <div class="h-2 bg-blue-500 flex-1 rounded-l-md"></div>
        <div class="h-2 bg-red-500 flex-1"></div>
        <div class="h-2 bg-yellow-500 flex-1"></div>
        <div class="h-2 bg-blue-500 flex-1"></div>
        <div class="h-2 bg-green-500 flex-1"></div>
        <div class="h-2 bg-red-500 flex-1 rounded-r-md"></div>
      </div>
    </ModalHeader>
    <ModalBody>
      <div class="search-result__content">
        <div class="search-result__content__title">
          Jenis User & Hak Aksesnya
        </div>
        <div class="mb-5">
          <a href="#" class="flex items-center mt-3 zoom-in">
            <div
              class="w-8 h-8 bg-white stroke-2 stroke-black p-auto rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
            >
              <UserIcon
                class="w-6 h-6 object-fill stroke-2 stroke-black fill-yellow-200 bg-white mt-1 mx-auto rounded-full"
              />
            </div>
            <div class="ml-3">
              <kbd
                class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                >Admin</kbd
              >
            </div>
            <div
              class="ml-auto w-auto truncate text-slate-500 text-xs text-right pr-3"
            >
              Memiliki Semua Fitur
            </div>
          </a>
          <a href="#" class="flex items-center mt-3 zoom-in">
            <div
              class="w-8 h-8 bg-white stroke-2 stroke-black p-auto rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
            >
              <HardHatIcon
                class="w-6 h-6 object-fill stroke-2 stroke-black fill-yellow-200 bg-white mt-1 mx-auto rounded-full"
              />
            </div>
            <div class="ml-3">
              <kbd
                class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                >Operator</kbd
              >
            </div>
            <div
              class="ml-auto w-auto truncate text-slate-500 text-xs text-right pr-3"
            >
              Beberapa Menu/ Fitur
            </div>
          </a>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END:Search Content -->
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";

const Auth = useAuthStore();
const logoutConfirmationModal = ref(false);
const profilModal = ref(false);
const data = ref([]);
const searchModal = ref(false);
const nama_region = ref();

const onLogout = () => {
  Auth.logout();
  logoutConfirmationModal.value = false;
};

const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};
onMounted(() => {
  data.value = Auth.items;
  nama_region.value = Auth.items.alamat_region;
});
</script>
