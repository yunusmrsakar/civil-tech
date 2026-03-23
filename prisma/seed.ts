import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const rawUrl = process.env.DATABASE_URL || '';
const cleanUrl = rawUrl.replace('?sslmode=require', '').replace('?channel_binding=require&sslmode=require', '').replace('&sslmode=require', '').replace('&channel_binding=require', '');
const pool = new pg.Pool({
  connectionString: cleanUrl,
  ssl: true,
})
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean existing data
  await prisma.order.deleteMany()
  await prisma.request.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.portfolio.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.create({
    data: {
      email: 'admin@civiltech.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  // Create categories
  const surveyingEquipment = await prisma.category.create({
    data: {
      name: 'Surveying Equipment',
      slug: 'surveying-equipment',
      description: 'Professional surveying and measurement instruments for civil engineering projects.',
    },
  })

  const constructionMaterials = await prisma.category.create({
    data: {
      name: 'Construction Materials',
      slug: 'construction-materials',
      description: 'High-quality construction materials and supplies for building projects.',
    },
  })

  const safetyEquipment = await prisma.category.create({
    data: {
      name: 'Safety Equipment',
      slug: 'safety-equipment',
      description: 'Personal protective equipment and safety gear for construction sites.',
    },
  })

  const testingInstruments = await prisma.category.create({
    data: {
      name: 'Testing Instruments',
      slug: 'testing-instruments',
      description: 'Precision testing and quality control instruments for materials and structures.',
    },
  })

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Topcon GT-1200 Robotic Total Station',
        slug: 'topcon-gt-1200-robotic-total-station',
        description: 'High-precision robotic total station with advanced tracking technology. Features 1-second angle accuracy, long-range reflectorless EDM, and integrated LongLink communications for remote operation. Ideal for large-scale civil engineering surveys.',
        price: 18500.00,
        images: ['/images/products/total-station-1.jpg', '/images/products/total-station-2.jpg'],
        categoryId: surveyingEquipment.id,
        stock: 5,
        featured: true,
      },
      {
        name: 'Leica NA720 Automatic Level',
        slug: 'leica-na720-automatic-level',
        description: 'Rugged automatic level with 20x magnification and compensator accuracy of 2.5mm per km double run. Designed for everyday leveling tasks in construction and civil engineering applications.',
        price: 850.00,
        images: ['/images/products/auto-level-1.jpg'],
        categoryId: surveyingEquipment.id,
        stock: 12,
        featured: false,
      },
      {
        name: 'Portland Cement CEM I 42.5R (50kg)',
        slug: 'portland-cement-cem-i-42-5r',
        description: 'High early strength Portland cement conforming to EN 197-1 standards. Suitable for structural concrete, precast elements, and applications requiring rapid strength development. 50kg bag.',
        price: 12.50,
        images: ['/images/products/cement-1.jpg'],
        categoryId: constructionMaterials.id,
        stock: 500,
        featured: false,
      },
      {
        name: 'Structural Steel Rebar Grade 60 (#8 Bar)',
        slug: 'structural-steel-rebar-grade-60',
        description: 'ASTM A615 Grade 60 deformed steel reinforcing bar, #8 size (25mm diameter). Hot-rolled with minimum yield strength of 60 ksi. Used for reinforced concrete structural elements. Price per 6m length.',
        price: 28.75,
        images: ['/images/products/rebar-1.jpg'],
        categoryId: constructionMaterials.id,
        stock: 200,
        featured: true,
      },
      {
        name: 'MSA V-Gard Full-Brim Hard Hat',
        slug: 'msa-v-gard-full-brim-hard-hat',
        description: 'ANSI/ISEA Z89.1 Type I compliant full-brim hard hat with Fas-Trac III ratchet suspension. Polyethylene shell provides superior impact and penetration protection. Available in multiple colors for role identification.',
        price: 45.00,
        images: ['/images/products/hard-hat-1.jpg'],
        categoryId: safetyEquipment.id,
        stock: 75,
        featured: false,
      },
      {
        name: '3M DBI-SALA ExoFit NEX Full Body Harness',
        slug: '3m-dbi-sala-exofit-nex-harness',
        description: 'Premium full body fall arrest harness with Duo-Lok quick connect buckles, integrated trauma straps, and hybrid comfort padding. OSHA and ANSI Z359.11 compliant. Rated for workers up to 140kg.',
        price: 320.00,
        images: ['/images/products/harness-1.jpg', '/images/products/harness-2.jpg'],
        categoryId: safetyEquipment.id,
        stock: 20,
        featured: true,
      },
      {
        name: 'Humboldt H-1331 Concrete Compression Testing Machine',
        slug: 'humboldt-h-1331-compression-tester',
        description: 'Digital concrete compression testing machine with 250,000 lbf capacity. Features automated load rate control, digital readout with peak hold, and ASTM C39 compliance. Essential for quality control in concrete construction.',
        price: 12750.00,
        images: ['/images/products/compression-tester-1.jpg'],
        categoryId: testingInstruments.id,
        stock: 3,
        featured: true,
      },
      {
        name: 'Proceq Schmidt Live Rebound Hammer',
        slug: 'proceq-schmidt-live-rebound-hammer',
        description: 'Advanced digital rebound hammer for non-destructive concrete strength assessment. Features integrated curve mapping, real-time statistical analysis, and cloud data synchronization. Compliant with EN 12504-2 and ASTM C805.',
        price: 3200.00,
        images: ['/images/products/rebound-hammer-1.jpg'],
        categoryId: testingInstruments.id,
        stock: 8,
        featured: false,
      },
    ],
  })

  // Create portfolio entries
  await prisma.portfolio.createMany({
    data: [
      {
        title: 'Istanbul Grand Canal Bridge Survey',
        slug: 'istanbul-grand-canal-bridge-survey',
        description: 'Complete geodetic survey and structural monitoring setup for the 1.2km cable-stayed bridge crossing the Istanbul Grand Canal. Provided high-precision control network establishment, deformation monitoring instrumentation, and as-built survey verification for all structural elements.',
        images: ['/images/portfolio/bridge-survey-1.jpg', '/images/portfolio/bridge-survey-2.jpg', '/images/portfolio/bridge-survey-3.jpg'],
        client: 'Turkish State Highways Authority',
        completedAt: new Date('2025-06-15'),
      },
      {
        title: 'Ankara Metro Line 4 Material Supply',
        slug: 'ankara-metro-line-4-material-supply',
        description: 'Supplied comprehensive construction materials and testing equipment for 12 stations along the Ankara Metro Line 4 extension. Included specialized concrete admixtures, reinforcement steel, and quality control instruments for tunnel lining and station construction.',
        images: ['/images/portfolio/metro-supply-1.jpg', '/images/portfolio/metro-supply-2.jpg'],
        client: 'Ankara Metropolitan Municipality',
        completedAt: new Date('2025-09-30'),
      },
      {
        title: 'Izmir Wind Farm Foundation Testing',
        slug: 'izmir-wind-farm-foundation-testing',
        description: 'Provided all geotechnical and structural testing equipment for the 48-turbine wind farm foundation construction. Delivered plate load test systems, concrete testing instruments, and soil analysis equipment to verify foundation integrity across challenging terrain.',
        images: ['/images/portfolio/wind-farm-1.jpg', '/images/portfolio/wind-farm-2.jpg'],
        client: 'Aegean Renewable Energy Corp',
        completedAt: new Date('2024-12-01'),
      },
    ],
  })

  // Create testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: 'Mehmet Yilmaz',
        company: 'Yilmaz Construction Group',
        content: 'CivilTech has been our go-to supplier for surveying equipment and construction materials for over three years. Their product quality and after-sales support are unmatched in the industry.',
        rating: 5,
        featured: true,
      },
      {
        clientName: 'Ayse Kara',
        company: 'Kara Engineering Consultants',
        content: 'The testing instruments we purchased from CivilTech have significantly improved our quality control processes. Their team provided excellent training and calibration services alongside the equipment.',
        rating: 5,
        featured: true,
      },
      {
        clientName: 'Emre Demir',
        company: 'Demir Infrastructure Ltd',
        content: 'We relied on CivilTech for all safety equipment on our highway tunnel project. Fast delivery, competitive pricing, and every item met international safety standards without exception.',
        rating: 4,
        featured: true,
      },
      {
        clientName: 'Fatma Ozturk',
        company: 'Ozturk Geotechnical Services',
        content: 'Their technical knowledge sets them apart. When we needed specialized soil testing equipment, the CivilTech team helped us select exactly the right instruments for our project requirements.',
        rating: 5,
        featured: false,
      },
    ],
  })

  console.log('Seed data created successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
