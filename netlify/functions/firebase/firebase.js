const databaseUrl = process.env.DATABASE_URL
const projectId = process.env.PROJECT_ID

const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      databaseUrl: databaseUrl,
      projectId: projectId,
    }),
  }
}

module.exports = { handler }
