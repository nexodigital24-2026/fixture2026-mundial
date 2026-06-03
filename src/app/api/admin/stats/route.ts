import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as { role: string }).role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const [
      totalUsers,
      totalAdmins,
      totalSimulations,
      activeUsers,
      recentUsers,
      simulationsByType,
      topUsers,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "admin" } }),
      db.simulation.count(),
      db.user.count({
        where: {
          simulations: { some: {} },
        },
      }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { simulations: true } },
        },
      }),
      db.simulation.groupBy({
        by: ["matchType"],
        _count: { matchType: true },
      }),
      db.user.findMany({
        take: 5,
        orderBy: { simulations: { _count: "desc" } },
        select: {
          id: true,
          name: true,
          email: true,
          _count: { select: { simulations: true } },
        },
      }),
    ])

    const groupSims = simulationsByType.find((s) => s.matchType === "group")?._count.matchType ?? 0
    const knockoutSims = simulationsByType.find((s) => s.matchType === "knockout")?._count.matchType ?? 0

    // Users registered in last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const newUsersThisWeek = await db.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    // Simulations created in last 7 days
    const newSimsThisWeek = await db.simulation.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    return NextResponse.json({
      totalUsers,
      totalAdmins,
      totalSimulations,
      activeUsers,
      groupSims,
      knockoutSims,
      newUsersThisWeek,
      newSimsThisWeek,
      recentUsers,
      topUsers,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
