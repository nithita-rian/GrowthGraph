<template>
  <div class="w-full mx-auto my-8 p-4 container">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold">📊 Children Growth Dashboard</h1>

      <!-- Upload + Search + Export -->
      <div><input type="file" @change="onFileChange" accept=".csv" /></div>
      <div><input type="text" class="p-2 border-2 border-solid border-gray-400 rounded-lg" v-model="searchQuery"
          placeholder="ค้นหาจากชื่อหรือรหัส" @input="onSearch" /></div>
      <!-- <button @click="exportCSV">ส่งออก CSV</button> -->

      <!-- Table -->
      <!-- <h3>ตัวอย่างข้อมูล (20 แถว/หน้า)</h3> -->
      <div class="table-container">
        <table v-if="pagedData.length > 0">
          <thead class="bg-gray-100 ">
            <tr>
              <th v-for="h in tableHeaders" :key="h" class="sticky top-0 z-10 border px-2 py-1 bg-gray-100">{{ h }}</th>
              <!-- <th class="sticky top-0 z-10 border px-2 py-1 bg-gray-100">H/A Status</th>
              <th class="sticky top-0 z-10 border px-2 py-1 bg-gray-100">H/A Recommendation</th>
              <th class="sticky top-0 z-10 border px-2 py-1 bg-gray-100">W/A Status</th>
              <th class="sticky top-0 z-10 border px-2 py-1 bg-gray-100">W/A Recommendation</th>
              <th class="sticky top-0 z-10 border px-2 py-1 bg-gray-100">W/H Status</th>
              <th class="sticky top-0 z-10 border px-2 py-1 bg-gray-100">W/H Recommendation</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.personID + '-' + row.age_month"
              :class="{ highlight: selectedPersonIDs.includes(String(row.personID)) }">
              <td v-for="h in tableHeaders" :key="h" class="p-2">{{ row[h] }}</td>
              <!-- <td :class="statusClass(row.HA_Status)">{{ row.HA_Status }}</td>
              <td>{{ row.HA_Rec }}</td>
              <td :class="statusClass(row.WA_Status)">{{ row.WA_Status }}</td>
              <td>{{ row.WA_Rec }}</td>
              <td :class="statusClass(row.WH_Status)">{{ row.WH_Status }}</td>
              <td>{{ row.WH_Rec }}</td> -->
            </tr>
          </tbody>
        </table>
        <!-- <p v-else>ไม่มีข้อมูล</p> -->
      </div>

      <!-- Pagination -->
      <!-- v-if="totalPages > 1" -->
      <div class="pagination space-x-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="hover:cursor-pointer">
          ⬅️ ก่อนหน้า
        </button>
        <button v-for="i in totalPages" :key="i" @click="changePage(i)" :disabled="i === currentPage"
          :class="{ 'bg-blue-500 text-white': i === currentPage, 'bg-gray-200': i !== currentPage }"
          class="px-3 py-1 rounded">
          {{ i }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="hover:cursor-pointer">
          ถัดไป ➡️
        </button>
      </div>

      <!-- Person Select -->
      <div v-if="pagedData.length > 0" class="p-2 w-[50%]">
        <h3 class="text-lg font-blod mb-2">เลือกเด็ก (PersonID)</h3>
        <input type="text" placeholder="ค้นหาจากรหัส" v-model="selectedPersonIDs"
          class="p-2 mb-2 border-2 border-solid border-gray-400 rounded-lg w-full" />
        <select multiple v-model="selectedPersonIDs"
          class="p-4 w-full h-50 border-2 border-solid border-gray-400 rounded-lg">
          <option v-for="person in personOptions" :key="person.id" :value="person.id"
            :class="{ highlight: selectedPersonIDs.includes(String(person.id)) }"
            class="p-2 hover:bg-gray-100 hover:cursor-pointer">
            {{ person.name }} ({{ person.id }})
          </option>
        </select>
      </div>
    </div>

    <!-- AI Bot -->
    <div class="w-full flex justify-end p-2">
      <button class="p-4 text-white bg-blue-400 border-2 rounded-2xl hover:bg-blue-600" @click="postAIBot"
        :disabled="isLoading">
        {{ isLoading ? 'กำลังประมวลผล...' : ' 💬 ปรึกษา AI Bot ' }}</button>
    </div>
    <div v-if="AIBotMessage" class="p-8 border-2 border-gray-400 rounded-lg h-[350px] overflow-y-auto whitespace-pre-wrap">
      <div class="flex justify-end"><button class="p-2 mb-4 bg-red-700 rounded-lg text-white" @click="AIBotMessage = ''">ปิด</button></div>
      <p>{{ AIBotMessage }}</p>
    </div>

    <!-- Charts -->
    <div class="p-2">
      <WFAChartGirl0To10 :childData="childWeightSelected" />
    </div>
    <div class="p-2">
      <HFAChartGirl0To10 :childData="childHeightSelected" />
    </div>
    <div class="p-2">
      <PercentileChartGirl05 :childData="childWHSelected" />
    </div>
  </div>
</template>

<script setup>
import Papa from "papaparse";
// import Plotly from "plotly.js-dist";
const { $plotly } = useNuxtApp()

const isLoading = ref(false);
const globalData = ref([]);
const filteredData = ref([]);
const currentPage = ref(1);
const rowsPerPage = 20;
const selectedPersonIDs = ref([]);
const searchQuery = ref("");
const personOptions = ref([]);
const childWeightSelected = ref([]);
const childHeightSelected = ref([]);
const childWHSelected = ref([]);
const childAllData = ref(null);
const AIBotMessage = ref("");

// --- File Upload ---
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      globalData.value = results.data.filter(
        (r) => r.personID && r.age_month && r.height && r.weight
      );
      filteredData.value = [...globalData.value];
      currentPage.value = 1;
      computeRecommendation(filteredData.value);
      populatePersonSelect();
    },
  });
};

// --- Search ---
const onSearch = () => {
  const val = searchQuery.value.toLowerCase();
  filteredData.value = globalData.value.filter(
    (d) =>
      (d.firstName && d.firstName.toLowerCase().includes(val)) ||
      (d.lastName && d.lastName.toLowerCase().includes(val)) ||
      (d.personID && String(d.personID).includes(val))
  );
  currentPage.value = 1;
};

const onSelect = (id) => {
  filteredData.value = globalData.value.filter(
    (d) =>
      (d.personID && String(d.personID).includes(id))
  );
  currentPage.value = 1;
};

// --- Plot ---
const plotGraph = (data) => {
  childAllData.value = data
    .map(item => [{
      firstname: item.firstName,
      lastname: item.lastName,
      personID: item.personID,
      height: item.height,
      weight: item.weight,
      wa_analysis: item.wa_analysis,
      ha_analysis: item.ha_analysis,
      wfh_analysis: item.wfh_analysis,
      age_month: item.age_month
    }])

  childWeightSelected.value = data
    .filter(item => item.age_month != null && item.weight != null)
    .map(item => [item.age_month, item.weight])
  childHeightSelected.value = data
    .filter(item => item.age_month != null && item.height != null)
    .map(item => [item.age_month, item.height])

  childWHSelected.value = data
    .filter(item => item.height != null && item.weight != null)
    .map(item => [item.height, item.weight])
}

// --- Watch & Select ---
watch(selectedPersonIDs, (newVal) => {
  const selectedData = globalData.value.filter((d) =>
    newVal.includes(String(d.personID))
  );
  plotGraph(selectedData);
  onSelect(selectedData[0]?.personID || "");
});

// --- AI Bot ---
const postAIBot = async () => {
  const data = childAllData.value
  try {
    isLoading.value = true
    const response = await $fetch('/api/api_llm', {
      method: 'POST',
      body: data,
      throwOnError: true
    })
    console.log('postAIBot >>> ', response)
    AIBotMessage.value = response.message
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

// --- Pagination ---
const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / rowsPerPage)
);
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  return filteredData.value.slice(start, start + rowsPerPage);
});

function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

// Colors
const colors = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];

// WHO reference data (ตัดมาเฉพาะส่วนสำคัญ)
const whoHA = { x: [0, 12, 24, 36, 48, 60], mean: [50, 75, 87, 95, 102, 107], sd2: [6, 6, 6, 6, 6, 6] };
const whoWA = { x: [0, 12, 24, 36, 48, 60], mean: [3.3, 9, 11.5, 13.5, 15, 16.5], sd2: [0.5, 1, 1, 1, 1, 1] };
const whoWH = { x: [45, 50, 55, 60, 65, 70], mean: [2.5, 3, 3.5, 4, 5, 6], sd2: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5] };

// --- Compute Recommendation ---
function computeRecommendation(data) {
  data.forEach((d) => {
    let idx = whoHA.x.findIndex((a) => a >= d.age_month);
    if (idx < 0) idx = whoHA.x.length - 1;
    const zHA = (d.height - whoHA.mean[idx]) / (whoHA.sd2[idx] / 2);
    d.HA_Status = zHA < -2 ? "ต่ำ" : zHA > 2 ? "สูง" : "ปกติ";
    d.HA_Rec =
      zHA < -2
        ? "เพิ่มโปรตีน/ปรึกษาแพทย์"
        : zHA > 2
          ? "ประเมินน้ำหนัก/โภชนาการ"
          : "ติดตามปกติ";

    idx = whoWA.x.findIndex((a) => a >= d.age_month);
    if (idx < 0) idx = whoWA.x.length - 1;
    const zWA = (d.weight - whoWA.mean[idx]) / (whoWA.sd2[idx] / 2);
    d.WA_Status = zWA < -2 ? "ต่ำ" : zWA > 2 ? "สูง" : "ปกติ";
    d.WA_Rec =
      zWA < -2
        ? "เพิ่มอาหาร/ปรึกษาแพทย์"
        : zWA > 2
          ? "ควบคุมน้ำหนัก/โภชนาการ"
          : "ปกติ";

    idx = whoWH.x.findIndex((a) => a >= d.height);
    if (idx < 0) idx = whoWH.x.length - 1;
    const zWH = (d.weight - whoWH.mean[idx]) / (whoWH.sd2[idx] / 2);
    d.WH_Status = zWH < -2 ? "ต่ำ" : zWH > 2 ? "สูง" : "ปกติ";
    d.WH_Rec =
      zWH < -2
        ? "เพิ่มอาหาร/ปรึกษาแพทย์"
        : zWH > 2
          ? "ควบคุมน้ำหนัก/โภชนาการ"
          : "ปกติ";
  });
}

// --- Export CSV ---
const exportCSV = () => {
  if (filteredData.value.length === 0) {
    alert("ไม่มีข้อมูล");
    return;
  }
  const csv = Papa.unparse(filteredData.value);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "filtered_data.csv";
  a.click();
};

// --- Person Options ---
function populatePersonSelect() {
  const personMap = {};
  globalData.value.forEach((d) => {
    if (d.personID && !personMap[d.personID]) {
      personMap[d.personID] = `${d.firstName || ""} ${d.lastName || ""}`.trim();
    }
  });
  personOptions.value = Object.keys(personMap).map((id) => ({
    id: String(id),
    name: personMap[id],
  }));
}

// --- Table ---
const tableHeaders = computed(() =>
  pagedData.value.length > 0
    ? Object.keys(pagedData.value[0]).filter(
      (h) => !["HA_Status", "HA_Rec", "WA_Status", "WA_Rec", "WH_Status", "WH_Rec"].includes(h)
    )
    : []
);

function statusClass(status) {
  return status === "ต่ำ"
    ? "status-low"
    : status === "สูง"
      ? "status-high"
      : "";
}



function plotComparison(data) {
  if (data.length === 0) return;
  let tracesHA = [],
    tracesWA = [],
    tracesWFH = [];
  const groups = {};
  data.forEach((d) => {
    if (!groups[d.personID]) groups[d.personID] = [];
    groups[d.personID].push(d);
  });
  let colorIndex = 0;

  Object.keys(groups).forEach((pid) => {
    const pd = groups[pid].sort((a, b) => a.age_month - b.age_month);
    const label = `${pd[0].firstName} ${pd[0].lastName} (${pid})`;
    const color = colors[colorIndex++ % colors.length];

    tracesHA.push({
      x: pd.map((d) => d.age_month),
      y: pd.map((d) => d.height),
      mode: "lines+markers",
      name: label,
      marker: { color },
    });
    tracesWA.push({
      x: pd.map((d) => d.age_month),
      y: pd.map((d) => d.weight),
      mode: "lines+markers",
      name: label,
      marker: { color },
    });
    tracesWFH.push({
      x: pd.map((d) => d.height),
      y: pd.map((d) => d.weight),
      mode: "lines+markers",
      name: label,
      marker: { color },
    });
  });

  // WHO lines
  tracesHA.push({
    x: whoHA.x,
    y: whoHA.mean,
    mode: "lines",
    name: "WHO 0SD",
    line: { color: "black" },
  });
  tracesHA.push({
    x: whoHA.x,
    y: whoHA.mean.map((v, i) => v + whoHA.sd2[i]),
    mode: "lines",
    name: "WHO +2SD",
    line: { color: "red", dash: "dot" },
  });
  tracesHA.push({
    x: whoHA.x,
    y: whoHA.mean.map((v, i) => v - whoHA.sd2[i]),
    mode: "lines",
    name: "WHO -2SD",
    line: { color: "red", dash: "dot" },
  });
}
</script>

<style>
/* .container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
} */

.table-container {
  overflow-x: auto;
  max-height: 450px;
}

.chart-container {
  width: 100%;
  height: 55vh;
  margin-top: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.highlight {
  background: #d6f0ff !important;
}

.status-low {
  background: #ffe5e5 !important;
  font-weight: bold;
}

.status-high {
  background: #fff4cc !important;
  font-weight: bold;
}
</style>
