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

const bgGraphData = [[0, 120], [120, 120]]

// ข้อมูลตัวอย่าง percentile (แทนที่ด้วยข้อมูลจริงจาก WHO หรือ กรมอนามัยได้)
const xData = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]

const median = [3.3, 7.5, 9.2, 10.3, 11.3, 12.4, 13.3, 14.2, 15.0, 15.8, 16.7, 17.5, 18.3, 19.213, 20.134, 21.092, 22.08, 23.097, 24.137, 25.2, 26.291, 27.414, 28.585, 29.829, 31.159]
const plus1sd = [3.9, 8.4, 10.2, 11.5, 12.7, 13.9, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 21.959, 23.063, 24.21, 25.399, 26.632, 27.911, 29.239, 30.627, 32.08, 33.621, 35.268, 37.035]
const plus2sd = [4.4, 9.3, 11.4, 12.8, 14.2, 15.5, 16.9, 18.1, 19.3, 20.5, 21.7, 22.9, 24.2, 25.21, 26.569, 27.984, 29.461, 31.011, 32.642, 34.368, 36.21, 38.179, 40.301, 42.587, 45.038]
const plus3sd = [5.0, 10.4, 12.7, 14.3, 15.9, 17.5, 19.0, 20.4, 21.9, 23.3, 24.8, 26.3, 27.9, 29.083, 30.799, 32.598, 34.495, 36.515, 38.682, 41.027, 43.591, 46.397, 49.483, 52.838, 56.434]
const minus1sd = [2.9, 6.7, 8.2, 9.2, 10.1, 11.0, 11.8, 12.6, 13.3, 14.0, 14.7, 15.4, 16.0, 16.882, 17.67, 18.492, 19.338, 20.203, 21.078, 21.961, 22.851, 23.753, 24.681, 25.656, 26.694]
const minus2sd = [2.5, 6.0, 7.4, 8.3, 9.1, 9.8, 10.5, 11.2, 11.8, 12.4, 12.9, 13.5, 14.1, 14.892, 15.583, 16.307, 17.05, 17.807, 18.565, 19.321, 20.072, 20.822, 21.582, 22.373, 23.206]
const minus3sd = [2.1, 5.3, 6.6, 7.4, 8.1, 8.8, 9.4, 9.9, 10.4, 10.9, 11.4, 11.9, 12.4, 13.186, 13.805, 14.456, 15.125, 15.802, 16.475, 17.14, 17.792, 18.433, 19.075, 19.735, 20.42]

const option = ref(null)

// ฟังก์ชัน render chart
const updateOption = () => {
    option.value = {
        title: {
            text: 'กราฟแสดงน้ำหนักตามเกณฑ์ของอายุ (Weight-for-age) ของเด็กอายุ 0 - 10 ปี (ชาย)',
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
            name: 'น้ำหนัก (กิโลกรัม)',
            nameLocation: 'middle',
            nameGap: 40,
            nameTextStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            },
            type: 'value',
            min: 0,
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
                top: '75%',
                zlevel: 100,
                style: {
                    text: 'น้ำหนักน้อย',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '64%',
                zlevel: 100,
                style: {
                    text: 'น้ำหนักค่อนข้างน้อย',
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '55%',
                zlevel: 100,
                style: {
                    text: 'น้ำหนักตามเกณฑ์', fontSize: 16,
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
                top: '42%',
                zlevel: 100,
                style: {
                    text: 'น้ำหนักค่อนข้างมาก',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            {
                type: 'text',
                right: '20%',
                top: '20%',
                zlevel: 100,
                style: {
                    text: 'น้ำหนักมาก',
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
