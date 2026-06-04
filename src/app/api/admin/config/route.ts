import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

// GET - Load all config values (public)
export async function GET() {
  try {
    const configs = await db.config.findMany()
    // Return as key-value map
    const map: Record<string, string> = {}
    for (const c of configs) {
      map[c.key] = c.value
    }
    return NextResponse.json(map)
  } catch (error) {
    console.error("Get config error:", error)
    return NextResponse.json({}, { status: 500 })
  }
}

// POST - Save/update config values (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as { role: string }).role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const body = await request.json()
    const { configs } = body as { configs: Record<string, string> }

    if (!configs || typeof configs !== "object") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    // Upsert each config key
    const operations = Object.entries(configs).map(([key, value]) =>
      db.config.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )

    await Promise.all(operations)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save config error:", error)
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
  }
}
