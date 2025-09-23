<script setup>

// **เพิ่มโค้ดบรรทัดนี้เพื่อนำเข้า GraphicComponent**
import { GraphicComponent } from 'echarts/components';
// **เพิ่มโค้ดบรรทัดนี้เพื่อเรียกใช้ GraphicComponent**
import * as echarts from 'echarts/core';
echarts.use([GraphicComponent]);

// ข้อมูลตัวอย่าง percentile (แทนที่ด้วยข้อมูลจริงจาก WHO หรือ กรมอนามัยได้)
const xData = [65.0, 67.5, 70.0, 72.5, 75.0, 77.5, 80.0, 82.5, 85.0, 87.5, 90.0, 92.5, 95.0, 97.5, 100.0, 102.5, 105.0, 107.5, 110.0, 112.5, 115.0, 117.5, 120.0]

const median = [7.2, 7.8, 8.3, 8.8, 9.3, 9.7, 10.2, 10.8, 11.4, 12.0, 12.6, 13.3, 13.9, 14.5, 15.2, 16.0, 16.8, 17.7, 18.6, 19.6, 20.7, 21.7, 22.8]
const plus2sd = [8.7, 9.4, 10.0, 10.6, 11.2, 11.7, 12.3, 13.0, 13.7, 14.5, 15.2, 16.0, 16.7, 17.5, 18.4, 19.3, 20.3, 21.4, 22.6, 23.9, 25.2, 26.6, 28.0]
const plus3sd = [9.7, 10.4, 11.1, 11.7, 12.3, 12.9, 13.6, 14.3, 15.1, 15.9, 16.8, 17.6, 18.5, 19.3, 20.3, 21.4, 22.5, 23.7, 25.1, 26.5, 28.1, 29.6, 31.2]
const minus2sd = [6.1, 6.5, 7.0, 7.4, 7.8, 8.2, 8.6, 9.1, 9.6, 10.1, 10.6, 11.2, 11.7, 12.2, 12.8, 13.4, 14.0, 14.7, 15.5, 16.3, 17.2, 18.0, 18.9]
const minus3sd = [5.6, 6.0, 6.4, 6.8, 7.2, 7.5, 7.9, 8.4, 8.8, 9.3, 9.8, 10.3, 10.8, 11.2, 11.7, 12.3, 12.9, 13.5, 14.2, 15.0, 15.7, 16.5, 17.3]

const childData = [[86.0, 12.0], [86.8, 12.2], [87.6, 12.4], [88.4, 12.6], [89.2, 12.8], [90.0, 13.0], [90.8, 13.2], [91.6, 13.4], [92.4, 13.6], [93.2, 13.8], [94.0, 14.0], [94.8, 14.2], [95.7, 14.5], [96.5, 14.7], [97.3, 15.0], [98.1, 15.2], [98.9, 15.5], [99.7, 15.7], [100.5, 16.0], [101.3, 16.2], [102.1, 16.5], [102.9, 16.7], [103.7, 17.0], [104.5, 17.2], [105.3, 17.5], [106.1, 17.8], [106.9, 18.1], [107.7, 18.4], [108.5, 18.7], [109.3, 19.0], [110.1, 19.3], [110.9, 19.6], [111.7, 19.9], [112.5, 20.2], [113.3, 20.5], [114.1, 20.8], [115.0, 21.0]]

const option = {
  title: {
    text: 'กราฟแสดงน้ำหนักตามเกณฑ์ความยาว (Weight-for-height) ของเด็กอายุ 2 - 5 ปี (หญิง)',
    left: 'center'
  },
  // tooltip: {
  //   trigger: 'axis'
  // },
  legend: {
    data: ['-3SD', '-2SD', 'Median', '+2SD', '+3SD'],
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
      itemStyle: { color: '#ff9933' },
      areaStyle: { color: 'rgba(255,153,51)' },
      zlevel: 5,
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
      itemStyle: { color: '#ffaa66' },
      areaStyle: { color: 'rgba(255,200,100)' },
      zlevel: 4,
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
      name: 'Median',
      type: 'line',
      data: xData.map((x, i) => [x, median[i]]),
      itemStyle: { color: '#00aa00', width: 2, type: 'dashed' },
      areaStyle: { color: 'white' },
      zlevel: 3,
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
      name: '+2SD',
      type: 'line',
      data: xData.map((x, i) => [x, plus2sd[i]]),
      itemStyle: { color: '#6666ff' },
      areaStyle: { color: 'white' },
      zlevel: 2,
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
      itemStyle: { color: '#0000ff' },
      areaStyle: { color: 'rgba(100,100,255)' },
      showSymbol: false,
      endLabel: {
        show: true,
        formatter: (params) => params.seriesName,
        color: '#0000ff',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    // {
    //   name: 'เด็ก',
    //   type: 'scatter',
    //   data: childData,
    //   symbolSize: 10,
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
        //fill: '#ff9933', // สีเดียวกับโซน -3SD และ -2SD
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
        //fill: '#ff9933', // สีเดียวกับโซน -3SD และ -2SD
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      type: 'text',
      right: '15%',
      top: '34%',
      zlevel: 100,
      style: {
        text: 'สมส่วน',
        //fill: '#00aa00', // สีเดียวกับเส้น Median
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      type: 'text',
      right: '15%',
      top: '22%',
      zlevel: 100,
      style: {
        text: 'เริ่มอ้วน',
        //fill: '#6666ff', // สีเดียวกับโซน +2SD และ +3SD
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      type: 'text',
      right: '15%',
      top: '12%',
      zlevel: 100,
      style: {
        text: 'อ้วน',
        //fill: '#6666ff', // สีเดียวกับโซน +2SD และ +3SD
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
