<template>
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium sm:mr-auto mb-4 sm:mb-0">Laporan Bulanan</h2>
    <div class="w-full sm:w-auto flex sm:flex-row-reverse items-center sm:mt-0">
      <table class="table-fixed sm:ml-4 mb-4 sm:mb-0">
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
      <div class="relative w-full sm:w-auto xl:w-60 mx-2 xl:mx-auto sm:mb-0">
        <div
          class="absolute rounded-l w-10 h-10 flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"
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
          class="form-control h-10 pl-14"
        />
      </div>
      <a
        href=""
        class="btn px-2 h-10 box flex items-center text-primary mr-2 sm:ml-auto"
      >
        <RefreshCcwIcon class="w-4 h-4 sm:mr-3 sm:m-0 m-2" />
        <p class="sm:block hidden">Reload Data</p>
      </a>
    </div>
  </div>
  <!-- BEGIN: HTML Table Data -->
  <div class="intro-y box p-5 mt-5">
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <form id="tabulator-html-filter-form" class="xl:flex sm:mr-auto">
        <div class="sm:flex items-center sm:mr-4">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2"
            >Field</label
          >
          <select
            id="tabulator-html-filter-field"
            v-model="filter.field"
            class="form-select w-full 2xl:w-full mt-2 sm:mt-0 sm:w-auto"
          >
            <option value="id_region">ID Region</option>
            <option value="nama_region">Nama Region</option>
          </select>
        </div>
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2"
            >Type</label
          >
          <select
            id="tabulator-html-filter-type"
            v-model="filter.type"
            class="form-select w-full mt-2 sm:mt-0 sm:w-auto"
          >
            <option value="like" selected>like</option>
            <option value="=">=</option>
            <option value="<">&lt;</option>
            <option value="<=">&lt;=</option>
            <option value=">">></option>
            <option value=">=">>=</option>
            <option value="!=">!=</option>
          </select>
        </div>
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2"
            >Value</label
          >
          <input
            id="tabulator-html-filter-value"
            v-model="filter.value"
            type="text"
            class="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
            placeholder="Search..."
          />
        </div>
        <div class="mt-2 xl:mt-0">
          <button
            id="tabulator-html-filter-reset"
            type="button"
            class="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1"
            @click="onResetFilter"
          >
            Reset
          </button>
        </div>
      </form>
      <div class="flex mt-5 sm:mt-0">
        <button
          id="tabulator-print"
          class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
          @click="onPrint"
        >
          <PrinterIcon class="w-4 h-4 mr-2" /> Print
        </button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="btn btn-outline-secondary w-full sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Export
            <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem @click="onExportCsv">
                <FileTextIcon class="w-4 h-4 mr-2" /> Export CSV
              </DropdownItem>
              <DropdownItem @click="onExportXlsx">
                <FileTextIcon class="w-4 h-4 mr-2" /> Export XLSX
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div
      v-show="isLoading"
      wire:loading
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-[50vw] z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
    >
      <Loader2Icon
        class="motion-safe:animate-spin stroke-[10px] text-white h-12 w-12 mb-4"
      />
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">
        Ini mungkin memakan waktu beberapa detik, tolong jangan tutup halaman
        ini.
      </p>
    </div>
    <div class="overflow-x-auto scrollbar-hidden">
      <div
        id="tabulator"
        ref="tableRef"
        class="mt-5 table-report table-report--tabulator"
      ></div>
    </div>
  </div>
  <!-- END: HTML Table Data -->
  <ModalDatabaseError ref="modalErrorRef" />
</template>

<script>
import { useDashboardStore } from "@/stores/dashboard";
import ModalDatabaseError from "@/components/modal-error/Main.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, reactive, provide } from "vue";
import xlsx from "xlsx";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import dom from "@left4code/tw-starter/dist/js/dom";
import moment from "moment";
const isLoading = ref(false);
const username = ref("");
const role = ref("role");
const passEdit = ref(false);
const tabulator = ref();
const auth = ref();
const filter = reactive({
  field: "id_region",
  type: "like",
  value: "",
});
const monthDetailSelect = ref();
const date_select = ref(moment(new Date().setDate(1)).format("D MMM, YYYY"));
export default {
  setup() {
    const Dashboard = useDashboardStore();
    const Auth = useAuthStore();
    provide("bind[monthDetailSelect]", (el) => {
      monthDetailSelect.value = el;
    });
    return { Dashboard, moment, Auth };
  },
  components: {
    ModalDatabaseError,
  },
  data() {
    return {
      username,
      role,
      auth,
      isLoading,
      tabulator,
      filter,
      passEdit,
      monthDetailSelect,
      date_select,
    };
  },
  methods: {
    initTabulator() {
      this.tabulator = new Tabulator(this.$refs.tableRef, {
        printAsHtml: true,
        printStyled: true,
        printHeader: `<h1 class='text-2xl p-2 m-2 text-center border-y-2 border-black'>Laporan Bulanan ${date_select.value}<h1>`,
        printFooter: `<h2 class='p-2 m-2 text-center mt-4'>${moment(
          Date.now()
        ).format("DD MMM YYYY HH:SS")}<h2>`,
        data: this.Dashboard.tabel,
        pagination: "remote",
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 30, 40, 50],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "Tida ada Data di temukan",
        columns: [
          {
            formatter: "responsiveCollapse",
            width: 40,
            minWidth: 30,
            hozAlign: "center",
            resizable: false,
            headerSort: false,
          },

          // For HTML table
          {
            title: "ID REGION",
            // minWidth: 200,
            minWidth: 80,
            responsive: 1,
            field: "id_region",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "NAMA REGION",
            headerHozAlign: "center",
            minWidth: 200,
            field: "nama_region",
            hozAlign: "left",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "STATUS LAPORAN",
            minWidth: 100,
            headerHozAlign: "center",
            field: "bulan_ini",
            hozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              const a = dom(`
          <div class="flex items-center lg:justify-center ${
            cell.getData().bulan_ini == "1" ? "text-success" : "text-danger"
          }">
            <i data-lucide="${
              cell.getData().bulan_ini == "1" ? "file-check" : "file-x"
            }" class="w-4 h-4 mr-2"></i> ${
                cell.getData().bulan_ini == "1" ? "SUDAH" : "BELUM"
              }
          </div>`);
              return a[0];
            },
          },
          // For print format
          {
            title: "ID REGION",
            field: "id_region",
            visible: false,
            print: true,
            download: true,
          },
          {
            title: "NAMA REGION",
            field: "nama_region",
            visible: false,
            print: true,
            download: true,
          },
          {
            title: "STATUS LAPORAN",
            field: "bulan_ini",
            visible: false,
            print: true,
            download: true,
            formatterPrint(cell) {
              return `${cell.getData().bulan_ini == "1" ? "SUDAH" : "BELUM"}`;
            },
          },
        ],
      });
      this.tabulator.on("renderComplete", function () {
        createIcons({
          icons,
          "stroke-width": 1.5,
          nameAttr: "data-lucide",
        });
      });
    },
    reInitOnResizeWindow() {
      window.addEventListener("resize", () => {
        this.tabulator.redraw();
        createIcons({
          icons,
          "stroke-width": 1.5,
          nameAttr: "data-lucide",
        });
      });
    },
    onFilter() {
      this.tabulator.setFilter(
        this.filter.field,
        this.filter.type,
        this.filter.value
      );
    },

    onResetFilter() {
      this.filter.field = "id_region";
      this.filter.type = "like";
      this.filter.value = "";
      this.onFilter();
    },

    // Export
    onExportCsv() {
      this.tabulator.download("csv", "data.csv");
    },
    onExportXlsx() {
      const win = window;
      win.XLSX = xlsx;
      this.tabulator.download("xlsx", "data.xlsx", {
        sheetName: "Data Dashboard",
      });
    },
    // Print
    onPrint() {
      this.tabulator.print();
    },
  },
  watch: {
    filter: {
      deep: true,
      handler(newFilter) {
        this.onFilter();
        console.log("filter");
      },
    },
    date_select(e) {
      isLoading.value = true;
      this.Dashboard.readTabel(e)
        .then((data) => {
          this.tabulator.replaceData(data);
          //this.initTabulator();
          // this.reInitOnResizeWindow();
          // this.$refs.modalErrorRef.errorDatabaseModal = false;
          isLoading.value = false;
        })
        .catch((error) => {
          isLoading.value = false;
          console.error("watch date_select", error);
          this.$refs.modalErrorRef.errorDatabaseModal = true;
        });
    },
  },
  mounted() {
    const elmonthDetailSelect = monthDetailSelect.value;
    elmonthDetailSelect.Litepicker.on("render:day", (day, date) => {
      if (date.getDate() !== 1) {
        day.classList.add("is-locked");
        day.setAttribute("tabindex", -1);
      }
    });

    isLoading.value = true;
    this.Dashboard.readTabel(date_select.value)
      .then(() => {
        this.initTabulator();
        this.reInitOnResizeWindow();
        this.$refs.modalErrorRef.errorDatabaseModal = false;
        isLoading.value = false;
      })
      .catch((error) => {
        isLoading.value = false;
        console.error(error);
        this.$refs.modalErrorRef.errorDatabaseModal = true;
      });
  },
};
</script>
