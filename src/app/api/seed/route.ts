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
        { error: "Ya existe un usuario administrador" },
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
      role: admin.role,
      message: "Admin creado exitosamente. Use las credenciales proporcionadas por el administrador del sistema.",
    }, { status: 201 })
  } catch (error: unknown) {
    console.error("Seed admin error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al crear admin", details: message }, { status: 500 })
  }
}
