// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Memória
    const memoryUsage = process.memoryUsage()
    const formatMemoryUsage = (data: number) => 
      `${Math.round(data / 1024 / 1024 * 100) / 100} MB`

    // Cache - verificando se o cache do Next.js está respondendo
    // Isso usa a API internal do Next.js - cuidado ao atualizar versões
    const cacheState = {
      isAvailable: Boolean(globalThis?.caches),
      type: process.env.NODE_ENV === 'production' ? 'production' : 'development'
    }

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())} seconds`,
      memory: {
        heapTotal: formatMemoryUsage(memoryUsage.heapTotal),
        heapUsed: formatMemoryUsage(memoryUsage.heapUsed),
        rss: formatMemoryUsage(memoryUsage.rss), // Resident Set Size - total memory allocated
        external: formatMemoryUsage(memoryUsage.external)
      },
      cache: cacheState
    }

    // Definindo limites de memória (exemplo: alerta se heap usado > 80% do total)
    const heapUsageRatio = memoryUsage.heapUsed / memoryUsage.heapTotal
    if (heapUsageRatio > 0.8) {
      return NextResponse.json({
        ...healthData,
        status: 'degraded',
        warning: 'High memory usage detected'
      }, { status: 429 })
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}