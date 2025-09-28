<script setup>

// **เพิ่มโค้ดบรรทัดนี้เพื่อนำเข้า GraphicComponent**
import { GraphicComponent } from 'echarts/components';
// **เพิ่มโค้ดบรรทัดนี้เพื่อเรียกใช้ GraphicComponent**
import * as echarts from 'echarts/core';
echarts.use([GraphicComponent]);

const props = defineProps({
  childData: Array,
})

const bgGraphData = [45, 120]

// ข้อมูลตัวอย่าง percentile (แทนที่ด้วยข้อมูลจริงจาก WHO หรือ กรมอนามัยได้)
const xData = [45.0, 47.5, 50.0, 52.5, 55.0, 57.5, 60.0, 62.5, 65.0, 67.5, 70.0, 72.5, 75.0, 77.5, 80.0, 82.5, 85.0, 87.5, 90.0, 92.5, 95.0, 97.5, 100.0, 102.5, 105.0, 107.5, 110.0, 112.5, 115.0, 117.5, 120.0]

const median = [2.4, 2.9, 3.3, 3.9, 4.5, 5.3, 6.0, 6.7, 7.3, 7.9, 8.4, 9.0, 9.5, 10.0, 10.4, 10.9, 11.5, 12.1, 12.7, 13.3, 13.9, 14.5, 15.2, 15.9, 16.6, 17.4, 18.3, 19.4, 20.4, 21.4, 22.4]
const plus1sd = [2.7, 3.2, 3.7, 4.3, 5.0, 5.7, 6.4, 7.1, 7.8, 8.4, 9.0, 9.5, 10.0, 10.5, 11.0, 11.6, 12.3, 13.0, 13.7, 14.3, 15.0, 15.7, 16.5, 17.3, 18.2, 19.1, 20.2, 21.6, 22.8, 24.0, 25.2]
const plus2sd = [3.0, 3.5, 4.0, 4.7, 5.5, 6.3, 7.1, 7.8, 8.6, 9.2, 9.9, 10.5, 11.0, 11.6, 12.1, 12.8, 13.5, 14.2, 15.0, 15.8, 16.5, 17.3, 18.1, 19.0, 20.0, 21.1, 22.3, 23.9, 25.2, 26.6, 28.0]
const plus3sd = [3.3, 3.8, 4.5, 5.2, 6.1, 7.0, 7.8, 8.7, 9.5, 10.2, 10.9, 11.5, 12.2, 12.8, 13.4, 14.1, 14.9, 15.7, 16.5, 17.4, 18.2, 19.1, 20.0, 21.0, 22.2, 23.4, 24.7, 26.5, 28.1, 29.6, 31.2]
const minus1sd = [2.3, 2.6, 3.1, 3.6, 4.2, 4.8, 5.4, 5.9, 6.5, 7.0, 7.5, 7.9, 8.4, 8.8, 9.2, 9.7, 10.3, 10.9, 11.4, 12.0, 12.6, 13.1, 13.7, 14.4, 15.1, 15.9, 16.7, 17.9, 18.8, 19.8, 20.7]
const minus2sd = [2.1, 2.4, 2.8, 3.3, 3.8, 4.4, 4.9, 5.4, 5.9, 6.4, 6.9, 7.3, 7.7, 8.1, 8.5, 8.9, 9.4, 10.0, 10.5, 11.0, 11.5, 12.1, 12.6, 13.2, 13.8, 14.5, 15.3, 16.3, 17.2, 18.0, 18.9]
const minus3sd = [1.9, 2.2, 2.6, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 5.9, 6.3, 6.7, 7.1, 7.4, 7.8, 8.2, 8.7, 9.2, 9.7, 10.1, 10.6, 11.1, 11.6, 12.1, 12.7, 13.3, 14.0, 15.0, 15.7, 16.5, 17.3]

const childData = [[95, 14]]

const option = ref(null)

// ฟังก์ชัน render chart
const updateOption = () => {
  option.value = {
    title: {
      text: 'กราฟแสดงน้ำหนักตามเกณฑ์ความยาว (Weight-for-height) ของเด็กอายุ 0 - 5 ปี',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['-3SD', '-2SD', '-1SD', 'Median', '+1SD', '+2SD', '+3SD'],
      top: 40
    },
    xAxis: {
      type: 'value',
      name: 'ความยาว (เซนติเมตร)',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      type: 'value',
      min: 45,
      max: 120,
      interval: 5,
    },
    // --- ตั้งค่าแกน Y ---
    yAxis: {
      name: 'น้ำหนัก (กิโลกรัม)',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      type: 'value',
      min: 0,
      max: 32,
      interval: 2,
    },
    series: [
      {
        name: '-3SD',
        type: 'line',
        data: xData.map((x, i) => [x, minus3sd[i]]),
        lineStyle: { color: '#ffaa66' },
        areaStyle: { color: '#ffaa66' },
        zlevel: 6,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: (params) => params.seriesName,
          color: '#ff9933',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        name: '-2SD',
        type: 'line',
        data: xData.map((x, i) => [x, minus2sd[i]]),
        lineStyle: { color: '#FFC864' },
        areaStyle: { color: '#FFC864' },
        zlevel: 5,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: (params) => params.seriesName,
          color: '#ffaa66',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        name: '-1SD',
        type: 'line',
        data: xData.map((x, i) => [x, minus1sd[i]]),
        lineStyle: { color: 'gray' },
        areaStyle: { color: 'white' },
        zlevel: 4,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: (params) => params.seriesName,
          color: 'gray',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        name: 'Median',
        type: 'line',
        data: xData.map((x, i) => [x, median[i]]),
        lineStyle: { color: '#00aa00', width: 2, type: 'dashed' },
        areaStyle: { color: 'white' },
        zlevel: 4,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: (params) => params.seriesName,
          color: '#00aa00',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        name: '+1SD',
        type: 'line',
        data: xData.map((x, i) => [x, plus1sd[i]]),
        lineStyle: { color: 'gray' },
        areaStyle: { color: 'white' },
        zlevel: 4,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: (params) => params.seriesName,
          color: 'gray',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        name: '+2SD',
        type: 'line',
        data: xData.map((x, i) => [x, plus2sd[i]]),
        lineStyle: { color: '#6666ff' },
        areaStyle: { color: '#E6E6FF' },
        zlevel: 3,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: (params) => params.seriesName,
          color: '#6666ff',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        name: '+3SD',
        type: 'line',
        data: xData.map((x, i) => [x, plus3sd[i]]),
        lineStyle: { color: '#0000ff' },
        areaStyle: { color: '#B8B8FF' },
        zlevel: 2,
        showSymbol: false,
        endLabel: {
          show: true,
          formatter: (params) => params.seriesName,
          color: '#0000ff',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        name: '+3SD',
        type: 'line',
        data: bgGraphData,
        lineStyle: { opacity: 0 },
        areaStyle: { color: '#5C5CFF' },
        showSymbol: false,
      },
      {
        name: 'เด็ก',
        type: 'line',
        data: props.childData,
        symbolSize: 8,
        itemStyle: { color: 'black' },
        lineStyle: { color: 'black', width: 2 },
        showSymbol: true,         // แสดงจุดบนเส้น
        zlevel: 90,
      }
    ],
    graphic: [
      {
        type: 'text',
        right: '15%',
        top: '65%',
        zlevel: 100,
        style: {
          text: 'ผอม',
          fontSize: 13,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        right: '15%',
        top: '49%',
        zlevel: 100,
        style: {
          text: 'ค่อนข้างผอม',
          fontSize: 13,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        right: '15%',
        top: '37%',
        zlevel: 100,
        style: {
          text: 'สมส่วน', fontSize: 13,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        right: '15%',
        top: '29%',
        zlevel: 100,
        style: {
          text: 'ท้วม', fontSize: 13,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        right: '15%',
        top: '24%',
        zlevel: 100,
        style: {
          text: 'เริ่มอ้วน',
          fontSize: 13,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        right: '15%',
        top: '15%',
        zlevel: 100,
        style: {
          text: 'อ้วน',
          fontSize: 13,
          fontWeight: 'bold'
        }
      },
    ]
  }
}

// อัปเดต option หลัง client mount
onMounted(updateOption)

// watch childData
watch(() => props.childData, updateOption, { deep: true })
</script>

<template>
  <div class="w-full h-[700px]">
    <client-only>
      <VChart v-if="option" :option="option" autoresize />
    </client-only>
  </div>
  <!-- <div class="w-full h-[700px]">
    <VChart :option="option" autoresize />
  </div> -->
</template>
