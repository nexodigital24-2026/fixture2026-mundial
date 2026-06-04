import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

// GET - Load user's simulations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id

    const simulations = await db.simulation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(simulations)
  } catch (error) {
    console.error("Get simulations error:", error)
    return NextResponse.json({ error: "Error al cargar simulaciones" }, { status: 500 })
  }
}

// POST - Save/update a simulation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id
    const body = await request.json()
    const { matchId, matchType, homeScore, awayScore } = body

    if (matchId === undefined || !matchType) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Use upsert to create or update
    const simulation = await db.simulation.upsert({
      where: {
        userId_matchId_matchType: {
          userId,
          matchId: Number(matchId),
          matchType,
        },
      },
      create: {
        userId,
        matchId: Number(matchId),
        matchType,
        homeScore: homeScore ?? -1,
        awayScore: awayScore ?? -1,
      },
      update: {
        homeScore: homeScore ?? -1,
        awayScore: awayScore ?? -1,
      },
    })

    return NextResponse.json(simulation)
  } catch (error) {
    console.error("Save simulation error:", error)
    return NextResponse.json({ error: "Error al guardar simulación" }, { status: 500 })
  }
}

// DELETE - Clear all simulations for user
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id

    await db.simulation.deleteMany({
      where: { userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete simulations error:", error)
    return NextResponse.json({ error: "Error al borrar simulaciones" }, { status: 500 })
  }
}
