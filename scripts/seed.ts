import "dotenv/config";
import { db, client } from "../src/lib/db";
import {
  users,
  services,
  products,
  galleryItems,
  bookings,
  inquiries,
  franchiseLeads,
} from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth";

async function main() {
  console.log("Seeding Cardinal Wash Studio database...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@cardinalwash.studio";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "CardinalAdmin!2026";

  await db
    .insert(users)
    .values({
      name: "Studio Admin",
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN",
    })
    .onConflictDoNothing({ target: users.email });

  const existingServices = await db.select({ id: services.id }).from(services).limit(1);
  if (existingServices.length > 0) {
    console.log("Sample data already present — skipping catalog/booking seed.");
    console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
    client.close();
    return;
  }

  await db.insert(services).values([
    {
      name: "Express Wash",
      tier: 1,
      price: 350,
      description: "Exterior foam wash, rinse, and hand dry.",
      category: "WASH",
    },
    {
      name: "Signature Wash",
      tier: 2,
      price: 650,
      description: "Foam wash, interior vacuum, dashboard wipe-down, tire shine.",
      category: "WASH",
    },
    {
      name: "Full Detail",
      tier: 3,
      price: 2500,
      description: "Complete interior and exterior detailing, clay bar, wax.",
      category: "DETAILING",
    },
    {
      name: "Ceramic Coating",
      tier: 1,
      price: 12000,
      description: "2-year graphene-infused ceramic coating with paint correction.",
      category: "PPF",
    },
    {
      name: "Paint Protection Film (Full Front)",
      tier: 2,
      price: 25000,
      description: "Self-healing PPF for hood, fenders, mirrors, and bumper.",
      category: "PPF",
    },
    {
      name: "Engine Bay Cleaning",
      tier: 1,
      price: 800,
      description: "Degreasing and detailing of the engine bay.",
      category: "ADDON",
    },
    {
      name: "Headlight Restoration",
      tier: 1,
      price: 900,
      description: "Polish and UV-seal foggy or yellowed headlights.",
      category: "ADDON",
    },
  ]);

  await db.insert(products).values([
    {
      name: "Cardinal Microfiber Towel Set (3pc)",
      price: 450,
      category: "Accessories",
      stockQuantity: 40,
    },
    {
      name: "Graphene Spray Detailer 500ml",
      price: 850,
      category: "Care Products",
      stockQuantity: 25,
    },
    {
      name: "Cardinal Wash Studio Air Freshener",
      price: 150,
      category: "Accessories",
      stockQuantity: 100,
    },
    {
      name: "Tire Shine Gel 300ml",
      price: 500,
      category: "Care Products",
      stockQuantity: 30,
    },
  ]);

  await db.insert(galleryItems).values([
    {
      title: "Matte Black Civic — Full Detail",
      beforeImageUrl: "/gallery/civic-before.jpg",
      afterImageUrl: "/gallery/civic-after.jpg",
      category: "Detailing",
      featured: true,
    },
    {
      title: "White Fortuner — Ceramic Coating",
      beforeImageUrl: "/gallery/fortuner-before.jpg",
      afterImageUrl: "/gallery/fortuner-after.jpg",
      category: "Ceramic Coating",
      featured: true,
    },
    {
      title: "Red MX-5 — PPF Front",
      beforeImageUrl: "/gallery/mx5-before.jpg",
      afterImageUrl: "/gallery/mx5-after.jpg",
      category: "PPF",
      featured: false,
    },
  ]);

  const now = Date.now();
  const hours = (h: number) => new Date(now + h * 60 * 60 * 1000);

  await db.insert(bookings).values([
    {
      customerName: "Miguel Santos",
      phone: "+639171234567",
      email: "miguel.santos@example.com",
      vehicleSize: "SEDAN",
      vehicleModel: "Toyota Vios 2022",
      serviceType: "Signature Wash",
      requestedDatetime: hours(4),
      paymentStatus: "PAID_DOWNPAYMENT",
      status: "CONFIRMED",
      downpaymentAmount: 200,
    },
    {
      customerName: "Ana Dela Cruz",
      phone: "+639178889999",
      email: "ana.delacruz@example.com",
      vehicleSize: "SUV",
      vehicleModel: "Toyota Fortuner 2021",
      serviceType: "Ceramic Coating",
      requestedDatetime: hours(26),
      paymentStatus: "UNPAID",
      status: "PENDING",
      downpaymentAmount: 0,
    },
    {
      customerName: "Carlo Ramos",
      phone: "+639201112222",
      email: "carlo.ramos@example.com",
      vehicleSize: "SEDAN",
      vehicleModel: "Honda Civic 2020",
      serviceType: "Full Detail",
      requestedDatetime: hours(-2),
      paymentStatus: "PAID",
      status: "IN_SERVICE",
      downpaymentAmount: 2500,
    },
    {
      customerName: "Jenny Lim",
      phone: "+639051234321",
      email: "jenny.lim@example.com",
      vehicleSize: "VAN",
      vehicleModel: "Toyota HiAce 2019",
      serviceType: "Express Wash",
      requestedDatetime: hours(-30),
      paymentStatus: "PAID",
      status: "COMPLETED",
      downpaymentAmount: 350,
    },
    {
      customerName: "Paolo Reyes",
      phone: "+639338887777",
      email: "paolo.reyes@example.com",
      vehicleSize: "SEDAN",
      vehicleModel: "Mazda 3 2023",
      serviceType: "Paint Protection Film (Full Front)",
      requestedDatetime: hours(72),
      paymentStatus: "PAID_DOWNPAYMENT",
      status: "PENDING",
      downpaymentAmount: 5000,
    },
  ]);

  await db.insert(inquiries).values([
    {
      customerName: "Bea Fernandez",
      email: "bea.fernandez@example.com",
      channel: "WEBSITE",
      message: "Do you offer mobile detailing for condos in BGC?",
      status: "NEW",
    },
    {
      customerName: "Mark Villanueva",
      channel: "FACEBOOK",
      message: "Ano po ang schedule niyo this Sunday?",
      status: "REPLIED",
      repliedAt: new Date(now - 3 * 60 * 60 * 1000),
    },
    {
      customerName: "Cathy Uy",
      channel: "INSTAGRAM",
      message: "Interested in the ceramic coating package, how long does it take?",
      status: "NEW",
    },
    {
      customerName: "Ronald Ang",
      channel: "PHONE",
      message: "Asked about bulk pricing for a fleet of 6 delivery vans.",
      status: "RESOLVED",
      repliedAt: new Date(now - 24 * 60 * 60 * 1000),
    },
  ]);

  await db.insert(franchiseLeads).values([
    {
      name: "Realyn Torres",
      contactInfo: "realyn.torres@example.com / 0917-555-0101",
      preferredCity: "Davao City",
      modelInterest: "FULL_STUDIO",
      status: "NEW",
    },
    {
      name: "Jun Bautista",
      contactInfo: "jun.bautista@example.com / 0917-555-0202",
      preferredCity: "Cebu City",
      modelInterest: "EXPRESS_BAY",
      status: "CONTACTED",
    },
    {
      name: "Grace Manalo",
      contactInfo: "grace.manalo@example.com / 0917-555-0303",
      preferredCity: "Cagayan de Oro",
      modelInterest: "FULL_STUDIO",
      status: "QUALIFIED",
    },
  ]);

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
