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

const median = [49.9, 65.9, 73.3, 79.1, 84.2, 88.0, 91.9, 95.4, 98.6, 101.6, 104.4, 107.2, 110.0, 112.39, 114.955, 117.42, 119.83, 122.205, 124.536, 126.816, 129.047, 131.25, 133.44, 135.617, 137.78]
const plus1sd = [51.8, 68.0, 75.6, 81.7, 87.0, 91.1, 95.3, 99.1, 102.5, 105.7, 108.7, 111.7, 114.6, 117.104, 119.822, 122.436, 124.996, 127.521, 130.003, 132.434, 134.815, 137.17, 139.513, 141.84, 144.153]
const plus2sd = [53.7, 70.1, 77.9, 84.2, 89.8, 94.2, 98.7, 102.7, 106.4, 109.8, 113.0, 116.1, 119.2, 121.819, 124.689, 127.452, 130.162, 132.837, 135.47, 138.051, 140.583, 143.091, 145.586, 148.064, 150.527]
const plus3sd = [55.6, 72.2, 80.1, 86.7, 92.6, 97.3, 102.1, 106.4, 110.3, 113.9, 117.3, 120.6, 123.9, 126.534, 129.556, 132.468, 135.328, 138.153, 140.938, 143.669, 146.352, 149.011, 151.659, 154.287, 156.901]
const minus1sd = [48.0, 63.8, 71.0, 76.6, 81.4, 84.9, 88.5, 91.8, 94.7, 97.5, 100.2, 102.8, 105.3, 107.675, 110.088, 112.403, 114.664, 116.889, 119.069, 121.198, 123.278, 125.329, 127.368, 129.393, 131.406]
const minus2sd = [46.1, 61.7, 68.7, 74.1, 78.6, 81.7, 85.1, 88.1, 90.9, 93.5, 95.9, 98.3, 100.7, 102.96, 105.22, 107.387, 109.499, 111.573, 113.602, 115.58, 117.51, 119.408, 121.295, 123.17, 125.032]
const minus3sd = [44.2, 59.6, 66.4, 71.6, 75.8, 78.6, 81.7, 84.4, 87.0, 89.4, 91.6, 93.9, 96.1, 98.245, 100.353, 102.371, 104.333, 106.258, 108.135, 109.962, 111.741, 113.488, 115.222, 116.946, 118.658]

const option = ref(null)

// ฟังก์ชัน render chart
const updateOption = () => {
    option.value = {
        title: {
            text: 'กราฟแสดงส่วนสูงตามเกณฑ์ของอายุ (Height-for-age) ของเด็กอายุ 0 - 10 ปี (ชาย)',
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
