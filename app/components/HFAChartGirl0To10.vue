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

const bgGraphData = [[0, 160], [160, 160]]

// ข้อมูลตัวอย่าง percentile (แทนที่ด้วยข้อมูลจริงจาก WHO หรือ กรมอนามัยได้)
const xData = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]

const median = [49.1, 64.0, 71.5, 77.5, 82.7, 86.6, 90.7, 94.4, 97.7, 100.9, 103.9, 106.7, 109.4, 111.67, 114.156, 116.557, 118.921, 121.284, 123.665, 126.071, 128.511, 130.989, 133.505, 136.053, 138.636]
const plus1sd = [51.0, 66.2, 73.9, 80.2, 85.7, 89.9, 94.2, 98.1, 101.7, 105.1, 108.3, 111.3, 114.2, 116.572, 119.215, 121.766, 124.275, 126.78, 129.299, 131.841, 134.415, 137.024, 139.665, 142.335, 145.033]
const plus2sd = [52.9, 68.5, 76.4, 83.0, 88.7, 93.1, 97.7, 101.9, 105.7, 109.3, 112.7, 115.9, 118.9, 121.474, 124.273, 126.975, 129.628, 132.275, 134.933, 137.611, 140.318, 143.058, 145.824, 148.616, 151.43]
const plus3sd = [54.7, 70.7, 78.9, 85.7, 91.7, 96.4, 101.3, 105.6, 109.7, 113.5, 117.1, 120.4, 123.7, 126.376, 129.331, 132.184, 134.982, 137.77, 140.567, 143.381, 146.222, 149.093, 151.984, 154.898, 157.826]
const minus1sd = [47.3, 61.8, 69.0, 74.8, 79.7, 83.3, 87.1, 90.6, 93.8, 96.7, 99.5, 102.2, 104.7, 106.767, 109.098, 111.348, 113.567, 115.789, 118.03, 120.3, 122.607, 124.954, 127.345, 129.772, 132.24]
const minus2sd = [45.4, 59.6, 66.5, 72.0, 76.7, 80.0, 83.6, 86.8, 89.8, 92.5, 95.1, 97.6, 99.9, 101.865, 104.04, 106.139, 108.213, 110.294, 112.396, 114.53, 116.703, 118.92, 121.185, 123.49, 125.843]
const minus3sd = [43.6, 57.4, 64.1, 69.3, 73.7, 76.8, 80.1, 83.1, 85.8, 88.4, 90.7, 93.0, 95.2, 96.963, 98.982, 100.93, 102.859, 104.798, 106.762, 108.76, 110.8, 112.885, 115.025, 117.209, 119.446]

const option = ref(null)

// ฟังก์ชัน render chart
const updateOption = () => {
    option.value = {
        title: {
            text: 'กราฟแสดงส่วนสูงตามเกณฑ์ของอายุ (Height-for-age) ของเด็กอายุ 0 - 10 ปี (หญิง)',
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
            min: 0,
            max: 120,
            interval: 5,
        },
        // --- ตั้งค่าแกน Y ---
        yAxis: {
            name: 'ส่วนสูง (เซนติเมตร)',
            nameLocation: 'middle',
            nameGap: 40,
            nameTextStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            },
            type: 'value',
            min: 40,
            max: 160,
            interval: 10,
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
                lineStyle: { color: '#6666ff' },
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
                lineStyle: { color: '#6666ff', width: 0 },
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
                name: 'BG',
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
                top: '60%',
                zlevel: 100,
                style: {
                    text: 'เตี้ย',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '39%',
                zlevel: 100,
                style: {
                    text: 'ค่อนข้างเตี้ย',
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '30%',
                zlevel: 100,
                style: {
                    text: 'สูงตามเกณฑ์', fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            // {
            //     type: 'text',
            //     right: '20%',
            //     top: '41%',
            //     zlevel: 100,
            //     style: {
            //         text: 'ท้วม', fontSize: 16,
            //         fontWeight: 'bold'
            //     }
            // },
            {
                type: 'text',
                right: '20%',
                top: '22%',
                zlevel: 100,
                style: {
                    text: 'ค่อนข้างสูง',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '12%',
                zlevel: 100,
                style: {
                    text: 'สูง',
                    fontSize: 16,
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
