<template>
  <div class="w-full mx-auto my-8 p-4 container space-y-6">
    <div class="space-y-6">
      <!-- Upload + Search + Export -->
      <!-- <div><input type="file" @change="onFileChange" accept=".csv" /></div> -->

      <div class="flex items-center justify-center w-full">
        <label for="dropzone-file"
          class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-[#E97681] dark:text-gray-400" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-base text-[#E97681] dark:text-gray-400"><span
                class="font-semibold">คลิกเพื่อเพิ่มไฟล์ข้อมูลเด็ก</span></p>
            <p class="text-sm text-[#E97681] dark:text-gray-400">CSV only</p>
          </div>
          <input id="dropzone-file" type="file" @change="onFileChange" accept=".csv" class="hidden" />
        </label>
      </div>

      <!-- <div><input type="text" class="p-2 border-2 border-solid border-gray-400 rounded-lg" v-model="searchQuery"
          placeholder="ค้นหาจากชื่อหรือรหัส" @input="onSearch" /></div> -->
      <!-- <button @click="exportCSV">ส่งออก CSV</button> -->

      <!-- Table -->
      <!-- <h3>ตัวอย่างข้อมูล (20 แถว/หน้า)</h3> -->
      <div class="table-container border-b-2 border-gray-200">
        <table v-if="globalData.length > 0" class="w-full border-collapse border border-gray-300">
          <thead class="bg-gray-100 ">
            <tr>
              <th v-for="h in tableHeaders" :key="h"
                class="sticky top-0 z-10 border border-gray-200 px-2 py-2 bg-[#E97681] text-white">{{ h }}</th>
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
              :class="{ highlight: selectedPersonIDs.includes(String(row.personID)) }" class="hover:bg-gray-50">
              <td v-for="h in tableHeaders" :key="h" class="p-2 text-center border border-gray-100">{{ row[h] }}</td>
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
      <div v-if="totalPages > 1" class="pagination space-x-2">
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
      <div v-if="globalData.length > 0" class="p-2 w-[50%]">
        <h3 class="text-lg font-bold mb-2">เลือกข้อมูลของเด็กที่ต้องการ (PersonID)</h3>
        <!-- <input type="text" class="w-full p-2 mb-2 border-2 border-solid border-gray-400 rounded-lg" v-model="searchQuery"
          placeholder="ค้นหาจากชื่อหรือรหัส" @input="onSearch" /> -->
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
    <div>
      <div class="w-full flex justify-end p-2">
        <button class="p-4 border-2 rounded-2xl" :class="{
          'text-white bg-[#E97681] hover:bg-[#E24B5A]': !isLoading && selectedPersonIDs.length > 0,
          'text-white bg-[#E97681] cursor-not-allowed': isLoading,
          'bg-gray-300 text-gray-600 cursor-not-allowed': selectedPersonIDs.length === 0
        }" @click="postAIBot" :disabled="isLoading || selectedPersonIDs.length === 0">
          {{ isLoading ? 'กำลังประมวลผล...' : ' 💬 ปรึกษา AI Bot ' }}</button>
      </div>
      <div v-if="AIBotMessage"
        class="w-full prose max-w-none p-8 border-2 border-gray-400 rounded-lg h-[400px] overflow-y-auto whitespace-pre-wrap">
        <div class="flex justify-end"><button class="px-4 py-2 mb-4 bg-red-700 rounded-lg text-white"
            @click="AIBotMessage = ''">ปิด</button></div>
        <div v-html="AIBotMessage"></div>
      </div>
    </div>
    <!-- <div v-if="html"
      class="w-full prose markdown-tight max-w-none p-8 border-2 border-gray-400 rounded-lg h-[350px] overflow-y-auto whitespace-pre-wrap">
      <div class="flex justify-end"><button class="p-2 mb-4 bg-red-700 rounded-lg text-white"
          @click="html = ''">ปิด</button></div>
      <div v-html="html"></div>
    </div> -->

    <!-- Charts -->
    <div class="border-2 border-dashed border-[#E24B5A] rounded-lg">
      <h2 class="text-center text-2xl font-bold mt-8">กราฟการเจริญเติบโต {{ nameChild || '' }}</h2>
      <div v-if="genderGraph === 'girl'" class="p-2">
        <WFAChartGirl0To10 :childData="childWeightSelected" />
        <HFAChartGirl0To10 :childData="childHeightSelected" />
        <PercentileChartGirl05 :childData="childWHSelected" />
      </div>
      <div v-else class="p-2">
        <WFAChartBoy0To10 :childData="childWeightSelected" />
        <HFAChartBoy0To10 :childData="childHeightSelected" />
        <PercentileChartBoy05 :childData="childWHSelected" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Papa from "papaparse";
import { marked } from 'marked'

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
const promtChildData = ref(null);
const AIBotMessage = ref("");
const genderGraph = ref('girl');
const nameChild = ref('');

const mdText = "## รายงานการประเมินภาวะโภชนาการเบื้องต้นด้วย AI Bot\n\n**ข้อมูลบุคคล:**\n\n1.  **ความสอดคล้องของข้อมูล:** พบความไม่สอดคล้องของข้อมูลชื่อและนามสกุลในแถวที่ 3 (ซาฟีร่า กา) เมื่อเทียบกับข้อมูลในแถวที่ 1 และ 2 (ซาฟีร่า กาเส็มส๊ะ) กรุณาตรวจสอบความถูกต้องของข้อมูลชื่อและนามสกุลอีกครั้ง\n2.  **ข้อมูลอื่นๆ:** ข้อมูลเพศ อายุ (เดือน) น้ำหนัก และส่วนสูง น่าจะสอดคล้องกัน เนื่องจาก ID เดียวกัน\n\n**การประเมินตามเกณฑ์ WHO (เด็กหญิง):**\n\n| อายุ (เดือน) | น้ำหนัก (กก.) | ส่วนสูง (ซม.) | น้ำหนักตามเกณฑ์อายุ | ส่วนสูงตามเกณฑ์อายุ | น้ำหนักตามเกณฑ์ส่วนสูง |\n|---|---|---|---|---|---|\n| 40 | 10.9 | 88.0 | ตามเกณฑ์ | ตามเกณฑ์ | ตามเกณฑ์ |\n| 41 | 13.0 | 90.0 | ตามเกณฑ์ | ตามเกณฑ์ | ตามเกณฑ์ |\n| 47 | 11.5 | 91.0 | ค่อนข้างต่ำ | ค่อนข้างต่ำ | ค่อนข้างต่ำ |\n\n**สรุปการประเมินการเจริญเติบโต:**\n\n*   ในช่วงอายุ 40-41 เดือน การเจริญเติบโตของเด็กอยู่ในเกณฑ์ปกติ\n*   เมื่ออายุ 47 เดือน พบว่าน้ำหนักและส่วนสูงค่อนข้างต่ำเมื่อเทียบกับเกณฑ์อายุและน้ำหนักตามเกณฑ์ส่วนสูง\n\n**ข้อแนะนำ:**\n\n1.  **ปรึกษาแพทย์/นักโภชนาการ:** แนะนำให้ปรึกษาแพทย์หรือนักโภชนาการเพื่อประเมินภาวะโภชนาการของเด็กอย่างละเอียด และพิจารณาปัจจัยอื่นๆ ที่อาจมีผลต่อการเจริญเติบโต\n2.  **ติดตามการเจริญเติบโตอย่างต่อเนื่อง:** ติดตามน้ำหนักและส่วนสูงของเด็กอย่างสม่ำเสมอ และบันทึกข้อมูลเพื่อเปรียบเทียบการเปลี่ยนแปลง\n\n**หมายเหตุ:** รายงานนี้เป็นการประเมินภาวะโภชนาการเบื้องต้นจากข้อมูลที่ให้มาเท่านั้น ไม่สามารถใช้ทดแทนการวินิจฉัยและการให้คำแนะนำจากผู้เชี่ยวชาญได้"
const html = marked.parse(mdText)

const parseCSV = (csvText) => {
  Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      globalData.value = results.data.filter(
        (r) => r.personID && r.age_month && r.height && r.weight
      )
      filteredData.value = [...globalData.value]
      currentPage.value = 1
      populatePersonSelect()
    },
  })
}

onMounted(async () => {
  const defaultCSV = await fetch('/default.csv')
  const text = await defaultCSV.text()
  parseCSV(text)
})

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
      //computeRecommendation(filteredData.value);
      populatePersonSelect();
    },
  });
};

// --- Search ---
let searchTimeout = null
const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    const val = searchQuery.value.toLowerCase()
    filteredData.value = globalData.value.filter(
      (d) =>
        (d.firstName && d.firstName.toLowerCase().includes(val)) ||
        (d.lastName && d.lastName.toLowerCase().includes(val)) ||
        (d.personID && String(d.personID).includes(val))
    )
    currentPage.value = 1
  }, 1000) // หน่วงเวลา 300ms
}

const onSelect = (id) => {
  filteredData.value = globalData.value.filter(
    (d) =>
      (d.personID && String(d.personID).includes(id))
  );
  currentPage.value = 1;
};

//--- promt ---
const promtAI = (data) => {
  const promt = `ฉันมีข้อมูลน้ำหนัก ส่วนสูง ของเด็ก 1 id คุณช่วยวิเคราะห์ข้อมูลนี้ในฐานะนักโภชนาการได้ไหม ในแง่ 1. ข้อมูลบุคคล ชื่อ นามสกุล เพศ​  สอดคล้องไหม ถ้าไม่ ช่วยระบุ 2. ประเมินตามเกณฑ์ WHO น้ำหนักตามเกณฑ์อายุ, ส่วนสูงตามเกณฑ์อายุ, น้ำหนักตามเกณฑ์ส่วนสูง ใช้ตารางที่อ่านง่ายรวม 1 ตาราง แต่ไม่ต้องอธิบายเรื่อง SD 3. สรุปการประเมินการเจริญเติบโตของเด็กคนนี้ 4. ข้อแนะนำเรื่องการดูแลการเจริญเติบโตของเด็กจากข้อมูลนำ้หนักส่วนสูงล่าสุดสั้นๆ ทำตามง่าย 1-2 ข้อ ขอเป็น'รายงานการประเมินภาวะโภชนาการเบื้องต้นด้วย AI Bot' และไม่ต้องถามตอบเพิ่มเติม ข้อมูลแต่ละแถวมีคอลัมน์: name, last_name, id, weight, height, age_month, gender`
  const result = data.map(d => {
    return `${d.firstName ?? null}, ${d.lastName ?? null}, ${d.personID ?? null}, ${d.weight ?? null}, ${d.height ?? null}, ${d.age_month ?? null}, ${d.genderName ?? null}`
  }).join('\n')  // 👈 รวมข้อความทั้งหมดด้วย ,
  promtChildData.value = promt + '\n' + result
  //console.log('promtAI >>> ', promtChildData.value)
}


// --- Plot ---
const plotGraph = (data) => {
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
  AIBotMessage.value = ""
  const selectedData = globalData.value.filter((d) =>
    newVal.includes(String(d.personID))
  );
  genderGraph.value = selectedData[0]?.genderName === 'หญิง' ? 'girl' : 'boy'
  nameChild.value = `${selectedData[0]?.firstName || ''} ${selectedData[0]?.lastName || ''}`;
  plotGraph(selectedData);
  onSelect(selectedData[0]?.personID || "");
  promtAI(selectedData)
});

// --- AI Bot ---
const postAIBot = async () => {
  const data = { message: promtChildData.value }
  try {
    isLoading.value = true
    const response = await $fetch('/api/api_llm', {
      method: 'POST',
      body: data,
      throwOnError: true
    })
    //console.log('postAIBot >>> ', response)
    AIBotMessage.value = marked.parse(response.message)
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
    ? Object.keys(pagedData.value[0])
    : []
  // ? Object.keys(pagedData.value[0]).filter(
  //   (h) => !["HA_Status", "HA_Rec", "WA_Status", "WA_Rec", "WH_Status", "WH_Rec"].includes(h)
  // )
  // : []
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

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0;
}

.prose th,
.prose td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.prose th {
  background: #f9f9f9;
  font-weight: bold;
}

/* ใช้ selector นี้เพื่อ Target องค์ประกอบของ Prose อย่างเฉพาะเจาะจง */
.markdown-tight :where(li:not([class])) {
  /* ลด margin-top และ margin-bottom ของ li ลง */
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}

.markdown-tight :where(ul:not([class]), ol:not([class])) {
  /* ลด margin-top และ margin-bottom ของ ul/ol ลง */
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}

/* ถ้าต้องการให้ระหว่างหัวข้อกับรายการชิดกันด้วย */
.markdown-tight :where(h1:not([class]), h2:not([class]), h3:not([class])) {
  margin-bottom: 0.5em;
}

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
  background: #FBE9EB !important;
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
