const databaseUrl = process.env.DATABASE_URL

const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ reply: databaseUrl }),
  }
}

module.exports = { handler }
