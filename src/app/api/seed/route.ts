import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// POST - Seed admin user (only if no admin exists)
export async function POST() {
  try {
    const existingAdmin = await db.user.findFirst({
      where: { role: "admin" },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Ya existe un usuario administrador", email: existingAdmin.email },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash("admin123", 10)

    const admin = await db.user.create({
      data: {
        name: "Administrador",
        email: "admin@mundial2026.com",
        password: hashedPassword,
        role: "admin",
      },
    })

    return NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      message: "Admin creado. Email: admin@mundial2026.com | Password: admin123",
    }, { status: 201 })
  } catch (error) {
    console.error("Seed admin error:", error)
    return NextResponse.json({ error: "Error al crear admin" }, { status: 500 })
  }
}
