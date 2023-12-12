const handler = async (event) => {
  try {
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

// const databaseUrl = process.env.DATABASE_URL

// const handler = async () => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ reply: databaseUrl }),
//   }
// }

// module.exports = { handler }
