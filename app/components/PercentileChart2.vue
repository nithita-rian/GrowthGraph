<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>

// --- ข้อมูลตัวอย่างสำหรับแกน X (ความยาว/ส่วนสูง) ---
const xAxisData = Array.from({ length: (110 - 45) + 1 }, (_, i) => 45 + i);

// --- ข้อมูลตัวอย่างสำหรับเส้นและพื้นที่ Percentile (แกน Y) ---
const p3Data = xAxisData.map(x => 0.002 * x * x - 0.1 * x + 3);
const p15Data = xAxisData.map(x => 0.002 * x * x - 0.09 * x + 4);
const p50Data = xAxisData.map(x => 0.002 * x * x - 0.08 * x + 5.5); // Median
const p85Data =xAxisData.map(x => 0.002 * x * x - 0.07 * x + 7);
const p97Data = xAxisData.map(x => 0.002 * x * x - 0.06 * x + 8.5);

// --- ข้อมูลจุดที่ต้องการพลอต ---
const patientData = [[55, 5], [65, 8], [75, 12], [85, 14], [95, 18]]; // [ความยาว, น้ำหนัก]

const option = ref({
  // --- ตั้งค่าแกน X ---
  xAxis: {
    name: 'ความยาว (เซนติเมตร)',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    type: 'category',
    data: xAxisData,
    boundaryGap: false,
  },
  // --- ตั้งค่าแกน Y ---
  yAxis: {
    name: 'น้ำหนัก (กิโลกรัม)',
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    type: 'value',
    min: 0,
    max: 26,
    interval: 2,
  },
  // --- ตั้งค่า Tooltip ---
  tooltip: {
    trigger: 'axis',
  },
  // --- การสร้างเส้นและพื้นที่ (Series) ---
  series: [
    // 1. เส้น Median (P50)
    {
      name: 'Median',
      type: 'line',
      data: p50Data,
      showSymbol: false,
      lineStyle: {
        type: 'dashed',
        color: '#d9534f',
        width: 2,
      },
    },
    // 2. พื้นที่ "ค่อนข้างผอม" และ "สมส่วน" (ใช้ stack เพื่อให้พื้นที่ต่อกัน)
    {
      name: 'สมส่วน',
      type: 'line',
      data: p15Data,
      showSymbol: false,
      lineStyle: { width: 0 },
      areaStyle: {
        color: 'rgba(144, 238, 144, 0.5)',
      },
      stack: 'percentile',
    },
    {
      name: 'เริ่มอ้วน',
      type: 'line',
      data: p50Data.map((val, i) => val - p15Data[i]), // คำนวณความสูงของพื้นที่
      showSymbol: false,
      lineStyle: { width: 0 },
      areaStyle: {
        color: 'rgba(60, 179, 113, 0.6)',
      },
      stack: 'percentile',
    },
    // 3. เส้นขอบเขต (P3, P15, P85, P97)
    { type: 'line', data: p3Data, showSymbol: false, lineStyle: { color: 'black', width: 1.5 } },
    { type: 'line', data: p15Data, showSymbol: false, lineStyle: { color: 'black', width: 1.5 } },
    { type: 'line', data: p85Data, showSymbol: false, lineStyle: { color: 'black', width: 1.5 } },
    { type: 'line', data: p97Data, showSymbol: false, lineStyle: { color: 'black', width: 1.5 } },

    // 4. จุดข้อมูลของคนไข้
    {
      name: 'ข้อมูลปัจจุบัน',
      type: 'scatter',
      data: patientData,
      symbolSize: 10,
      itemStyle: {
        color: 'black',
        borderColor: 'white',
        borderWidth: 1,
      },
      zlevel: 10,
    },
     // 5. ข้อความกำกับโซน
    {
        name: 'Labels',
        type: 'line',
        markArea: {
            silent: true,
            itemStyle: { color: 'transparent' },
            data: [
                [{ coord: [100, 20.5], label: { value: 'อ้วน', color: 'black', fontSize: 14 } }],
                [{ coord: [95, 18], label: { value: 'เริ่มอ้วน', color: 'black', fontSize: 14 } }],
                [{ coord: [90, 15], label: { value: 'สมส่วน', color: 'black', fontSize: 14 } }],
                [{ coord: [90, 12], label: { value: 'ค่อนข้างผอม', color: 'black', fontSize: 14 } }],
                [{ coord: [95, 8], label: { value: 'ผอม', color: 'black', fontSize: 14 } }]
            ]
        }
    },
    // 6. ข้อความกำกับเส้น S.D.
    {
        name: 'SD Labels',
        type: 'line',
        markLine: {
            silent: true,
            symbol: 'none',
            label: {
                position: 'insideEndTop',
                formatter: '{b}'
            },
            data: [
                { yAxis: p97Data[xAxisData.indexOf(110)], name: '+2 S.D.', lineStyle: { color: 'transparent' }, label: { color: 'black'} },
                { yAxis: p85Data[xAxisData.indexOf(110)], name: '+1.5 S.D.', lineStyle: { color: 'transparent' }, label: { color: 'black'} },
                { yAxis: p50Data[xAxisData.indexOf(110)], name: 'MEDIAN', lineStyle: { color: 'transparent' }, label: { color: 'black'} },
                { yAxis: p15Data[xAxisData.indexOf(110)], name: '-1.5 S.D.', lineStyle: { color: 'transparent' }, label: { color: 'black'} },
                { yAxis: p3Data[xAxisData.indexOf(110)], name: '-2 S.D.', lineStyle: { color: 'transparent' }, label: { color: 'black'} }
            ]
        }
    }
  ],
  // --- Grid Layout ---
  grid: {
    left: '3%',
    right: '8%',
    bottom: '8%',
    containLabel: true
  },
});
</script>

<style scoped>
.chart {
  height: 600px;
  width: 100%;
}
</style>