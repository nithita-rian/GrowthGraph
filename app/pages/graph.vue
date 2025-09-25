<template>
  <div class="container">
    <h2>📊 Professional Growth Dashboard</h2>

    <input type="file" @change="onFileChange" accept=".csv" />
    <input type="text" v-model="searchQuery" placeholder="ค้นหาตามชื่อหรือรหัสผู้ป่วย" @input="onSearch" />
    <button @click="exportCSV">ส่งออก CSV</button>

    <h3>ตัวอย่างข้อมูล (20 แถว/หน้า)</h3>
    <div class="table-container" v-html="tableHTML"></div>
    <div class="pagination" v-html="paginationHTML"></div>

    <h3>เลือกผู้ป่วย (PersonID)</h3>
    <select multiple v-model="selectedPersonIDs" @change="onSelectChange">
      <option v-for="person in personOptions" :key="person.id" :value="person.id">
        {{ person.name }} ({{ person.id }})
      </option>
    </select>

    <div id="chartHeight" class="chart-container"></div>
    <div id="chartWeight" class="chart-container"></div>
    <div id="chartWFH" class="chart-container"></div>
  </div>
</template>

<script setup>
import Papa from "papaparse";
// import Plotly from "plotly.js-dist-min";
import Plotly from "plotly.js-dist";
// import { ref, reactive, watch } from "vue";

const globalData = ref([]);
const filteredData = ref([]);
const currentPage = ref(1);
const rowsPerPage = 20;
const selectedPersonIDs = ref([]);
const searchQuery = ref("");
const tableHTML = ref("");
const paginationHTML = ref("");
const personOptions = ref([]);

const colors = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];

// Simplified WHO data
const whoHA = { x:[0,12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228], mean:[50,75,87,95,102,107,112,117,121,125,128,131,134,137,140,143,146,149,152,155], sd2:[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6] };
const whoWA = { x:[0,12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228], mean:[3.3,9,11.5,13.5,15,16.5,18,19,20.5,22,23,24,25,26,27,28,29,30,31,32], sd2:[0.5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] };
const whoWH = { x:[45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140], mean:[2.5,3,3.5,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], sd2:[0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5] };

// File Upload
const onFileChange = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  Papa.parse(file, {
    header:true, dynamicTyping:true, skipEmptyLines:true,
    complete: results => {
      globalData.value = results.data.filter(r=>r.personID!=null && r.age_month!=null && r.height!=null && r.weight!=null);
      filteredData.value = [...globalData.value];
      currentPage.value = 1;
      computeRecommendation(filteredData.value);
      renderTable();
      populatePersonSelect();
    }
  });
};

// Compute Z-score & Recommendation
function computeRecommendation(data){
  data.forEach(d=>{
    let idx=whoHA.x.findIndex(a=>a>=d.age_month); if(idx<0) idx=whoHA.x.length-1;
    let zHA=(d.height - whoHA.mean[idx])/(whoHA.sd2[idx]/2);
    d.HA_Status = zHA<-2?"ต่ำ":zHA>2?"สูง":"ปกติ";
    d.HA_Rec = zHA<-2?"เพิ่มโปรตีน/ปรึกษาแพทย์":zHA>2?"ประเมินน้ำหนัก/โภชนาการ":"ติดตามปกติ";

    idx=whoWA.x.findIndex(a=>a>=d.age_month); if(idx<0) idx=whoWA.x.length-1;
    let zWA=(d.weight - whoWA.mean[idx])/(whoWA.sd2[idx]/2);
    d.WA_Status = zWA<-2?"ต่ำ":zWA>2?"สูง":"ปกติ";
    d.WA_Rec = zWA<-2?"เพิ่มอาหาร/ปรึกษาแพทย์":zWA>2?"ควบคุมน้ำหนัก/โภชนาการ":"ปกติ";

    idx=whoWH.x.findIndex(a=>a>=d.height); if(idx<0) idx=whoWH.x.length-1;
    let zWH=(d.weight - whoWH.mean[idx])/(whoWH.sd2[idx]/2);
    d.WH_Status = zWH<-2?"ต่ำ":zWH>2?"สูง":"ปกติ";
    d.WH_Rec = zWH<-2?"เพิ่มอาหาร/ปรึกษาแพทย์":zWH>2?"ควบคุมน้ำหนัก/โภชนาการ":"ปกติ";
  });
}

// Search
const onSearch = () => {
  const val = searchQuery.value.toLowerCase();
  filteredData.value = globalData.value.filter(d=>
    (d.firstName && d.firstName.toLowerCase().includes(val)) ||
    (d.lastName && d.lastName.toLowerCase().includes(val)) ||
    (d.personID && String(d.personID).includes(val))
  );
  currentPage.value = 1;
  renderTable();
};

// Export CSV
const exportCSV = () => {
  if(filteredData.value.length===0){ alert("ไม่มีข้อมูล"); return; }
  const csv = Papa.unparse(filteredData.value);
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="filtered_data.csv"; a.click();
};

// Render Table with Dynamic Highlight
function renderTable(){
  if(filteredData.value.length===0){ tableHTML.value="<p>ไม่มีข้อมูล</p>"; paginationHTML.value=""; return; }
  const start = (currentPage.value-1)*rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.value.slice(start,end);
  let html = "<table><thead><tr>";
  Object.keys(pageData[0]).forEach(h=>{
    if(!["HA_Status","HA_Rec","WA_Status","WA_Rec","WH_Status","WH_Rec"].includes(h)) html+=`<th>${h}</th>`;
  });
  html+="<th>H/A Status</th><th>H/A Recommendation</th>";
  html+="<th>W/A Status</th><th>W/A Recommendation</th>";
  html+="<th>W/H Status</th><th>W/H Recommendation</th>";
  html+="</tr></thead><tbody>";

  pageData.forEach(r=>{
    const highlightClass = selectedPersonIDs.value.includes(String(r.personID)) ? "highlight" : "";
    html+=`<tr class="${highlightClass}">`;
    Object.keys(r).forEach(k=>{
      if(!["HA_Status","HA_Rec","WA_Status","WA_Rec","WH_Status","WH_Rec"].includes(k)) html+=`<td>${r[k]}</td>`;
    });
    html+=`<td class="${r.HA_Status==='ต่ำ'?'status-low':r.HA_Status==='สูง'?'status-high':''}">${r.HA_Status}</td>`;
    html+=`<td>${r.HA_Rec}</td>`;
    html+=`<td class="${r.WA_Status==='ต่ำ'?'status-low':r.WA_Status==='สูง'?'status-high':''}">${r.WA_Status}</td>`;
    html+=`<td>${r.WA_Rec}</td>`;
    html+=`<td class="${r.WH_Status==='ต่ำ'?'status-low':r.WH_Status==='สูง'?'status-high':''}">${r.WH_Status}</td>`;
    html+=`<td>${r.WH_Rec}</td>`;
    html+="</tr>";
  });

  html+="</tbody></table>";
  tableHTML.value = html;

  const totalPages = Math.ceil(filteredData.value.length/rowsPerPage);
  let pagHtml = `<button @click="changePage(${currentPage.value-1})" ${currentPage.value===1?'disabled':''}>⬅️ ก่อนหน้า</button>`;
  for(let i=1;i<=totalPages;i++){ pagHtml+=`<button @click="changePage(${i})" ${i===currentPage.value?'disabled':''}>${i}</button>`;}
  pagHtml+=`<button @click="changePage(${currentPage.value+1})" ${currentPage.value===totalPages?'disabled':''}>ถัดไป ➡️</button>`;
  paginationHTML.value = pagHtml;
}

// Change page
function changePage(page){
  const totalPages = Math.ceil(filteredData.value.length/rowsPerPage);
  if(page<1||page>totalPages) return;
  currentPage.value = page;
  renderTable();
}

// Populate Person select
function populatePersonSelect(){
  const personMap = {};
  globalData.value.forEach(d=>{ if(d.personID && !personMap[d.personID]) personMap[d.personID]=`${d.firstName||''} ${d.lastName||''}`.trim(); });
  personOptions.value = Object.keys(personMap).map(id=>({id, name:personMap[id]}));
}

// Plot selected persons
watch(selectedPersonIDs, (newVal)=>{
  const selectedData = globalData.value.filter(d=>newVal.includes(String(d.personID)));
  plotComparison(selectedData);
});

// Plot function
function plotComparison(data){
  if(data.length===0) return;
  let tracesHA=[], tracesWA=[], tracesWFH=[];
  const groups = {};
  data.forEach(d=>{ if(!groups[d.personID]) groups[d.personID]=[]; groups[d.personID].push(d); });
  let colorIndex=0;

  Object.keys(groups).forEach(pid=>{
    const pd = groups[pid].sort((a,b)=>a.age_month-b.age_month);
    const label = `${pd[0].firstName} ${pd[0].lastName} (${pid})`;
    const color = colors[colorIndex++ % colors.length];

    tracesHA.push({x:pd.map(d=>d.age_month), y:pd.map(d=>d.height), mode:"lines+markers", name:label, marker:{color}});
    tracesWA.push({x:pd.map(d=>d.age_month), y:pd.map(d=>d.weight), mode:"lines+markers", name:label, marker:{color}});
    tracesWFH.push({x:pd.map(d=>d.height), y:pd.map(d=>d.weight), mode:"lines+markers", name:label, marker:{color}});
  });

  // WHO ±2SD
  tracesHA.push({x:whoHA.x, y:whoHA.mean, mode:'lines', name:'WHO 0SD', line:{color:'black'}});
  tracesHA.push({x:whoHA.x, y:whoHA.mean.map((v,i)=>v+whoHA.sd2[i]), mode:'lines', name:'WHO +2SD', line:{color:'red', dash:'dot'}});
  tracesHA.push({x:whoHA.x, y:whoHA.mean.map((v,i)=>v-whoHA.sd2[i]), mode:'lines', name:'WHO -2SD', line:{color:'red', dash:'dot'}});

  tracesWA.push({x:whoWA.x, y:whoWA.mean, mode:'lines', name:'WHO 0SD', line:{color:'black'}});
  tracesWA.push({x:whoWA.x, y:whoWA.mean.map((v,i)=>v+whoWA.sd2[i]), mode:'lines', name:'WHO +2SD', line:{color:'red', dash:'dot'}});
  tracesWA.push({x:whoWA.x, y:whoWA.mean.map((v,i)=>v-whoWA.sd2[i]), mode:'lines', name:'WHO -2SD', line:{color:'red', dash:'dot'}});

  tracesWFH.push({x:whoWH.x, y:whoWH.mean, mode:'lines', name:'WHO 0SD', line:{color:'black'}});
  tracesWFH.push({x:whoWH.x, y:whoWH.mean.map((v,i)=>v+whoWH.sd2[i]), mode:'lines', name:'WHO +2SD', line:{color:'red', dash:'dot'}});
  tracesWFH.push({x:whoWH.x, y:whoWH.mean.map((v,i)=>v-whoWH.sd2[i]), mode:'lines', name:'WHO -2SD', line:{color:'red', dash:'dot'}});

  Plotly.newPlot("chartHeight", tracesHA, {title:"Height-for-Age (H/A)", xaxis:{title:"Age (months)"}, yaxis:{title:"Height (cm)"}, template:"plotly_white"});
  Plotly.newPlot("chartWeight", tracesWA, {title:"Weight-for-Age (W/A)", xaxis:{title:"Age (months)"}, yaxis:{title:"Weight (kg)"}, template:"plotly_white"});
  Plotly.newPlot("chartWFH", tracesWFH, {title:"Weight-for-Height (W/H)", xaxis:{title:"Height (cm)"}, yaxis:{title:"Weight (kg)"}, template:"plotly_white"});
}
</script>

<style>
.container{max-width:1200px;margin:auto; padding:20px;}
.table-container{overflow-x:auto; max-height:450px;}
.chart-container{width:100%;height:55vh;margin-top:20px; padding:15px; background:#fff; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.1);}
.highlight{background:#d6f0ff !important;}
.status-low{background:#ffe5e5 !important; font-weight:bold;}
.status-high{background:#fff4cc !important; font-weight:bold;}
</style>