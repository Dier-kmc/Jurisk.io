export default {
  adapter: 'sqlite',
  connection: {
    url: 'file:./prisma/dev.db',
  },
  migrations: {
    output: './prisma/migrations',
  },
}