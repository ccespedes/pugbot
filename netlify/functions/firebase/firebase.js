const databaseUrl = process.env.DATABASE_URL
const projectId = process.env.PROJECT_ID

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({
        error: 'Invalid request method.',
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      databaseUrl,
      projectId,
    }),
  }
}

module.exports = { handler }
