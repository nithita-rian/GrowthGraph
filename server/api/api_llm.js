//server/api/api_llm.js
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const res = await $fetch('https://service.foodieat.in.th/amedbot/api/api_llm', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch((error) => {
    // ดัก error จาก backend และส่ง response กลับมาให้ frontend
    console.error('API error:', error)
    return {
      error: true,
      statusCode: error?.response?.status || 500,
      message: error?.data?.message || 'Unknown error from backend',
    }
  })

  return res
})
