<script setup>

// **เพิ่มโค้ดบรรทัดนี้เพื่อนำเข้า GraphicComponent**
import { GraphicComponent } from 'echarts/components';
// **เพิ่มโค้ดบรรทัดนี้เพื่อเรียกใช้ GraphicComponent**
import * as echarts from 'echarts/core';
echarts.use([GraphicComponent]);

const bgGraphData = [65, 120]

// ข้อมูลตัวอย่าง percentile (แทนที่ด้วยข้อมูลจริงจาก WHO หรือ กรมอนามัยได้)
const xData = [65.0, 67.5, 70.0, 72.5, 75.0, 77.5, 80.0, 82.5, 85.0, 87.5, 90.0, 92.5, 95.0, 97.5, 100.0, 102.5, 105.0, 107.5, 110.0, 112.5, 115.0, 117.5, 120.0]

const median = [7.4, 8.0, 8.6, 9.1, 9.6, 10.1, 10.6, 11.1, 11.7, 12.3, 12.9, 13.5, 14.1, 14.7, 15.4, 16.1, 16.8, 17.7, 18.5, 19.4, 20.4, 21.4, 22.4]
const plus1sd = [8.1, 8.7, 9.3, 9.9, 10.5, 11.0, 11.5, 12.1, 12.7, 13.3, 14.0, 14.6, 15.3, 15.9, 16.7, 17.5, 18.4, 19.3, 20.2, 21.3, 22.4, 23.5, 24.6]
const plus2sd = [8.8, 9.5, 10.2, 10.8, 11.4, 12.0, 12.6, 13.1, 13.8, 14.5, 15.2, 15.9, 16.6, 17.4, 18.2, 19.1, 20.1, 21.1, 22.2, 23.4, 24.6, 25.9, 27.2]
const plus3sd = [9.6, 10.4, 11.1, 11.8, 12.5, 13.1, 13.7, 14.4, 15.1, 15.8, 16.6, 17.3, 18.1, 18.9, 19.9, 20.9, 22.0, 23.2, 24.4, 25.8, 27.2, 28.6, 30.1]
const minus1sd = [6.9, 7.4, 7.9, 8.4, 8.9, 9.3, 9.7, 10.2, 10.8, 11.3, 11.9, 12.4, 13.0, 13.6, 14.2, 14.8, 15.5, 16.2, 17.0, 17.8, 18.6, 19.5, 20.4]
const minus2sd = [6.3, 6.8, 7.3, 7.8, 8.2, 8.6, 9.0, 9.4, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.1, 13.7, 14.3, 14.9, 15.6, 16.3, 17.1, 17.9, 18.6]
const minus3sd = [5.9, 6.3, 6.8, 7.2, 7.6, 8.0, 8.3, 8.7, 9.2, 9.7, 10.2, 10.7, 11.1, 11.6, 12.1, 12.6, 13.2, 13.8, 14.4, 15.0, 15.7, 16.4, 17.1]

const childData = [[86.0, 12.0], [86.8, 12.2], [87.6, 12.4], [88.4, 12.6], [89.2, 12.8], [90.0, 13.0], [90.8, 13.2], [91.6, 13.4], [92.4, 13.6], [93.2, 13.8], [94.0, 14.0], [94.8, 14.2], [95.7, 14.5], [96.5, 14.7], [97.3, 15.0], [98.1, 15.2], [98.9, 15.5], [99.7, 15.7], [100.5, 16.0], [101.3, 16.2], [102.1, 16.5], [102.9, 16.7], [103.7, 17.0], [104.5, 17.2], [105.3, 17.5], [106.1, 17.8], [106.9, 18.1], [107.7, 18.4], [108.5, 18.7], [109.3, 19.0], [110.1, 19.3], [110.9, 19.6], [111.7, 19.9], [112.5, 20.2], [113.3, 20.5], [114.1, 20.8], [115.0, 21.0]]

const option = {
  title: {
    text: 'กราฟแสดงน้ำหนักตามเกณฑ์ความยาว (Weight-for-height) ของเด็กอายุ 2 - 5 ปี (ชาย)',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
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
    min: 65,
    max: 120,
    interval: 2,
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
    // {
    //   name: 'เด็ก',
    //   type: 'scatter',
    //   data: childData,
    //   symbolSize: 8,
    //   itemStyle: { color: 'black' },
    //   zlevel: 90,
    // }
  ],
  graphic: [
    {
      type: 'text',
      right: '15%',
      top: '70%',
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
      top: '48%',
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
      top: '35%',
      zlevel: 100,
      style: {
        text: 'สมส่วน', fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      type: 'text',
      right: '15%',
      top: '28.5%',
      zlevel: 100,
      style: {
        text: 'ท้วม', fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      type: 'text',
      right: '15%',
      top: '23%',
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
      top: '13%',
      zlevel: 100,
      style: {
        text: 'อ้วน',
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
  ]
}
</script>

<template>
  <div class="w-full h-[700px]">
    <VChart :option="option" autoresize />
  </div>
</template>
