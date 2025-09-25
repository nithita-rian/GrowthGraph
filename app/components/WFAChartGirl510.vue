<script setup>
const props = defineProps({
    childData: Array,
})

// **เพิ่มโค้ดบรรทัดนี้เพื่อเรียกใช้ GraphicComponent**
import * as echarts from 'echarts/core';
// นำเข้า chart ที่ต้องใช้
import { LineChart, ScatterChart } from 'echarts/charts'

// นำเข้า component ที่ต้องใช้
import {
    GraphicComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components'

// นำเข้า renderer (จำเป็นมาก!)
import { CanvasRenderer } from 'echarts/renderers'

// register component, chart, renderer
echarts.use([
    GraphicComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    ScatterChart,
    CanvasRenderer
])


const chartRef = ref(null)
let chart = null

const bgGraphData = [60, 120]

// ข้อมูลตัวอย่าง percentile (แทนที่ด้วยข้อมูลจริงจาก WHO หรือ กรมอนามัยได้)
const xData = [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]

const median = [18.258, 18.954, 19.818, 20.688, 21.598, 22.576, 23.637, 24.785, 26.028, 27.364, 28.779, 30.272, 31.858]
const plus1sd = [21.169, 22.032, 23.108, 24.199, 25.343, 26.574, 27.908, 29.352, 30.914, 32.591, 34.367, 36.238, 38.223]
const plus2sd = [24.817, 25.911, 27.288, 28.695, 30.176, 31.773, 33.507, 35.383, 37.412, 39.589, 41.895, 44.321, 46.89]
const plus3sd = [29.468, 30.893, 32.708, 34.581, 36.568, 38.719, 41.058, 43.596, 46.343, 49.293, 52.419, 55.705, 59.177]
const minus1sd = [15.899, 16.473, 17.182, 17.893, 18.635, 19.433, 20.299, 21.238, 22.254, 23.347, 24.506, 25.729, 27.031]
const minus2sd = [13.961, 14.444, 15.038, 15.632, 16.25, 16.916, 17.639, 18.424, 19.274, 20.188, 21.158, 22.183, 23.274]
const minus3sd = [12.352, 12.764, 13.27, 13.775, 14.301, 14.867, 15.483, 16.151, 16.875, 17.655, 18.482, 19.355, 20.286]

const option = ref(null)

// ฟังก์ชัน render chart
const updateOption = () => {
    option.value = {
        title: {
            text: 'กราฟแสดงน้ำหนักตามเกณฑ์ของอายุ (Weight-for-age) ของเด็กอายุ 5 - 10 ปี',
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
            name: 'อายุ (เดือน)',
            nameLocation: 'middle',
            nameGap: 40,
            nameTextStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            },
            type: 'value',
            min: 60,
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
            min: 10,
            max: 60,
            interval: 5,
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
                lineStyle: { color: '#DBDBDB' },
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
                lineStyle: { color: '#DBDBDB' },
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
                type: 'line',             // เปลี่ยนจาก scatter เป็น line
                data: props.childData,
                symbolSize: 8,
                itemStyle: { color: 'black' },
                lineStyle: { color: 'black', width: 2 },
                showSymbol: true,         // แสดงจุดบนเส้น
                zlevel: 90
            }
        ],
        graphic: [
            {
                type: 'text',
                right: '20%',
                top: '80%',
                zlevel: 100,
                style: {
                    text: 'ผอม',
                    fontSize: 13,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '72%',
                zlevel: 100,
                style: {
                    text: 'ค่อนข้างผอม',
                    fontSize: 13,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '55%',
                zlevel: 100,
                style: {
                    text: 'สมส่วน', fontSize: 13,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '42%',
                zlevel: 100,
                style: {
                    text: 'ท้วม', fontSize: 13,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '28%',
                zlevel: 100,
                style: {
                    text: 'เริ่มอ้วน',
                    fontSize: 13,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
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
    <!-- <div class="w-full h-[700px]" ref="chartRef"></div> -->
</template>
