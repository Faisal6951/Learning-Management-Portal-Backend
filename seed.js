require('dotenv').config()
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})

const prisma = new PrismaClient({ adapter })

const main = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@lmp.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin created:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())