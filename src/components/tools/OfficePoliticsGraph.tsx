'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// ---- Types ----
interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  group: string
  pageRank: number
  betweenness: number
  connections: number
}

interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
  weight: number
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

// ---- Sample Data ----
const SAMPLE_CSV = `from,to,weight
清水直人,田中美咲,5
清水直人,佐藤健一,8
清水直人,山田太郎,3
清水直人,鈴木花子,4
清水直人,高橋誠,6
田中美咲,佐藤健一,7
田中美咲,伊藤由美,4
田中美咲,渡辺修,2
佐藤健一,山田太郎,5
佐藤健一,小林正,3
山田太郎,鈴木花子,6
山田太郎,中村哲也,4
鈴木花子,高橋誠,3
鈴木花子,加藤良子,5
高橋誠,伊藤由美,7
高橋誠,松本大輔,4
伊藤由美,渡辺修,6
伊藤由美,中村哲也,3
渡辺修,小林正,5
渡辺修,松本大輔,4
中村哲也,加藤良子,3
中村哲也,松本大輔,6
小林正,加藤良子,4
加藤良子,松本大輔,2
松本大輔,清水直人,3
田中美咲,高橋誠,2
佐藤健一,鈴木花子,3
山田太郎,伊藤由美,2`

const DEPARTMENT_MAP: Record<string, string> = {
  '清水直人': '経営企画',
  '田中美咲': '営業',
  '佐藤健一': '開発',
  '山田太郎': '開発',
  '鈴木花子': 'マーケ',
  '高橋誠': '営業',
  '伊藤由美': '人事',
  '渡辺修': '開発',
  '中村哲也': 'マーケ',
  '小林正': '経理',
  '加藤良子': '人事',
  '松本大輔': '経営企画',
}

const DEPT_COLORS: Record<string, string> = {
  '経営企画': '#6366f1',
  '営業': '#f59e0b',
  '開発': '#10b981',
  'マーケ': '#ec4899',
  '人事': '#8b5cf6',
  '経理': '#06b6d4',
  'その他': '#6b7280',
}

// ---- Algorithms ----
function computePageRank(nodes: GraphNode[], links: GraphLink[], iterations = 50, damping = 0.85): void {
  const n = nodes.length
  if (n === 0) return
  const idToIdx = new Map<string, number>()
  nodes.forEach((node, i) => { idToIdx.set(node.id, i) })
  
  const outDegree = new Array(n).fill(0)
  const adj: number[][] = Array.from({ length: n }, () => [])
  const weights: number[][] = Array.from({ length: n }, () => [])
  
  links.forEach(link => {
    const sId = typeof link.source === 'string' ? link.source : link.source.id
    const tId = typeof link.target === 'string' ? link.target : link.target.id
    const si = idToIdx.get(sId)!
    const ti = idToIdx.get(tId)!
    outDegree[si] += link.weight
    outDegree[ti] += link.weight
    adj[ti].push(si)
    weights[ti].push(link.weight)
    adj[si].push(ti)
    weights[si].push(link.weight)
  })

  let ranks = new Array(n).fill(1 / n)
  
  for (let iter = 0; iter < iterations; iter++) {
    const newRanks = new Array(n).fill((1 - damping) / n)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < adj[i].length; j++) {
        const neighbor = adj[i][j]
        const w = weights[i][j]
        if (outDegree[neighbor] > 0) {
          newRanks[i] += damping * (ranks[neighbor] * w / outDegree[neighbor])
        }
      }
    }
    ranks = newRanks
  }

  const maxRank = Math.max(...ranks)
  nodes.forEach((node, i) => {
    node.pageRank = maxRank > 0 ? (ranks[i] / maxRank) * 100 : 0
  })
}

function computeBetweenness(nodes: GraphNode[], links: GraphLink[]): void {
  const n = nodes.length
  if (n === 0) return
  const idToIdx = new Map<string, number>()
  nodes.forEach((node, i) => { idToIdx.set(node.id, i) })
  
  const adj: number[][] = Array.from({ length: n }, () => [])
  links.forEach(link => {
    const sId = typeof link.source === 'string' ? link.source : link.source.id
    const tId = typeof link.target === 'string' ? link.target : link.target.id
    const si = idToIdx.get(sId)!
    const ti = idToIdx.get(tId)!
    adj[si].push(ti)
    adj[ti].push(si)
  })

  const centrality = new Array(n).fill(0)

  for (let s = 0; s < n; s++) {
    const stack: number[] = []
    const pred: number[][] = Array.from({ length: n }, () => [])
    const sigma = new Array(n).fill(0)
    sigma[s] = 1
    const dist = new Array(n).fill(-1)
    dist[s] = 0
    const queue: number[] = [s]

    while (queue.length > 0) {
      const v = queue.shift()!
      stack.push(v)
      for (const w of adj[v]) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1
          queue.push(w)
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v]
          pred[w].push(v)
        }
      }
    }

    const delta = new Array(n).fill(0)
    while (stack.length > 0) {
      const w = stack.pop()!
      for (const v of pred[w]) {
        delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w])
      }
      if (w !== s) centrality[w] += delta[w]
    }
  }

  const maxC = Math.max(...centrality) || 1
  nodes.forEach((node, i) => {
    node.betweenness = (centrality[i] / maxC) * 100
  })
}

function parseCSV(csv: string): GraphData {
  const lines = csv.trim().split('\n')
  const nodeSet = new Set<string>()
  const links: GraphLink[] = []

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(s => s.trim())
    if (parts.length >= 2) {
      const from = parts[0]
      const to = parts[1]
      const weight = parts[2] ? parseFloat(parts[2]) || 1 : 1
      if (from && to) {
        nodeSet.add(from)
        nodeSet.add(to)
        links.push({ source: from, target: to, weight })
      }
    }
  }

  const connectionCount = new Map<string, number>()
  links.forEach(l => {
    const sId = typeof l.source === 'string' ? l.source : l.source.id
    const tId = typeof l.target === 'string' ? l.target : l.target.id
    connectionCount.set(sId, (connectionCount.get(sId) || 0) + 1)
    connectionCount.set(tId, (connectionCount.get(tId) || 0) + 1)
  })

  const nodes: GraphNode[] = Array.from(nodeSet).map(id => ({
    id,
    group: DEPARTMENT_MAP[id] || 'その他',
    pageRank: 0,
    betweenness: 0,
    connections: connectionCount.get(id) || 0,
  }))

  computePageRank(nodes, links)
  computeBetweenness(nodes, links)

  return { nodes, links }
}

// ---- Component ----
export default function OfficePoliticsGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<GraphData | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [tab, setTab] = useState<'keyPerson' | 'bridge' | 'stats'>('keyPerson')
  const [isDragging, setIsDragging] = useState(false)
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null)

  // Load sample data on mount
  useEffect(() => {
    const parsed = parseCSV(SAMPLE_CSV)
    setData(parsed)
  }, [])

  const handleCSVUpload = useCallback((text: string) => {
    try {
      const parsed = parseCSV(text)
      if (parsed.nodes.length === 0) {
        alert('有効なデータが見つかりませんでした。CSV形式を確認してください。')
        return
      }
      setData(parsed)
      setSelectedNode(null)
    } catch {
      alert('CSVの解析に失敗しました。形式を確認してください。')
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          handleCSVUpload(ev.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }, [handleCSVUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          handleCSVUpload(ev.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }, [handleCSVUpload])

  // D3 rendering
  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = Math.max(500, container.clientHeight)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg.append('g')

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    svg.call(zoom)

    const maxWeight = Math.max(...data.links.map(l => l.weight))

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#374151')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.max(1, (d.weight / maxWeight) * 6))

    // Nodes
    const maxPR = Math.max(...data.nodes.map(n => n.pageRank))
    const nodeG = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('cursor', 'pointer')

    nodeG.append('circle')
      .attr('r', (d) => 8 + (d.pageRank / (maxPR || 1)) * 20)
      .attr('fill', (d) => DEPT_COLORS[d.group] || DEPT_COLORS['その他'])
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)

    nodeG.append('text')
      .text((d) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => -(12 + (d.pageRank / (maxPR || 1)) * 20))
      .attr('fill', '#e5e7eb')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')

    // Click handler
    nodeG.on('click', (_event, d) => {
      setSelectedNode(prev => prev?.id === d.id ? null : d)
      
      const connectedIds = new Set<string>()
      connectedIds.add(d.id)
      data.links.forEach(l => {
        const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source
        const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target
        if (sId === d.id) connectedIds.add(tId as string)
        if (tId === d.id) connectedIds.add(sId as string)
      })

      nodeG.select('circle')
        .attr('opacity', (n) => connectedIds.has((n as GraphNode).id) ? 1 : 0.15)
      nodeG.select('text')
        .attr('opacity', (n) => connectedIds.has((n as GraphNode).id) ? 1 : 0.15)
      link
        .attr('stroke-opacity', (l) => {
          const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source
          const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target
          return (sId === d.id || tId === d.id) ? 0.8 : 0.05
        })
        .attr('stroke', (l) => {
          const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source
          const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target
          return (sId === d.id || tId === d.id) ? '#818cf8' : '#374151'
        })
    })

    // Double click to reset highlight
    svg.on('click', (event) => {
      if (event.target === svgRef.current) {
        setSelectedNode(null)
        nodeG.select('circle').attr('opacity', 0.9)
        nodeG.select('text').attr('opacity', 1)
        link.attr('stroke-opacity', 0.6).attr('stroke', '#374151')
      }
    })

    // Drag
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeG.call(drag as any)

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(data.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(data.links)
        .id((d) => d.id)
        .distance(100)
        .strength((d) => 0.3 + (d.weight / maxWeight) * 0.5)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => 15 + ((d as GraphNode).pageRank / (maxPR || 1)) * 20))
      .on('tick', () => {
        link
          .attr('x1', (d) => (d.source as GraphNode).x || 0)
          .attr('y1', (d) => (d.source as GraphNode).y || 0)
          .attr('x2', (d) => (d.target as GraphNode).x || 0)
          .attr('y2', (d) => (d.target as GraphNode).y || 0)

        nodeG.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`)
      })

    simulationRef.current = simulation

    return () => {
      simulation.stop()
    }
  }, [data])

  const handleExportPNG = useCallback(() => {
    if (!svgRef.current) return
    const svgElement = svgRef.current
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const bbox = svgElement.getBoundingClientRect()
    canvas.width = bbox.width * 2
    canvas.height = bbox.height * 2
    const ctx = canvas.getContext('2d')!
    ctx.scale(2, 2)
    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      ctx.fillStyle = '#030712'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, bbox.width, bbox.height)
      URL.revokeObjectURL(url)
      const link = document.createElement('a')
      link.download = 'office-politics-graph.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = url
  }, [])

  const sortedByPageRank = data ? [...data.nodes].sort((a, b) => b.pageRank - a.pageRank) : []
  const sortedByBetweenness = data ? [...data.nodes].sort((a, b) => b.betweenness - a.betweenness) : []

  const departments = data ? Array.from(new Set(data.nodes.map(n => n.group))) : []

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-xs font-bold">
              OPG
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">社内政治 相関図</h1>
              <p className="text-xs text-gray-500">インタラクティブ組織分析ツール</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <Input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />
              <span className="inline-flex items-center justify-center text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-md px-3 py-1.5 transition-colors">
                📂 CSV読み込み
              </span>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPNG}
              className="text-xs border-gray-700 text-gray-300 hover:text-white bg-transparent"
            >
              📸 PNG保存
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 57px)' }}>
        {/* Graph Area */}
        <div
          ref={containerRef}
          className="flex-1 relative"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 z-20 bg-indigo-600/10 border-2 border-dashed border-indigo-500 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-indigo-300 font-medium">CSVファイルをドロップ</p>
                <p className="text-indigo-400/70 text-sm">from, to, weight 形式</p>
              </div>
            </div>
          )}
          <svg ref={svgRef} className="w-full h-full" />
          {/* Legend */}
          {data && (
            <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-800 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-gray-400 mb-2 font-medium">部門カラー</p>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <div key={dept} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: DEPT_COLORS[dept] || DEPT_COLORS['その他'] }}
                    />
                    <span className="text-xs text-gray-400">{dept}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                ノードサイズ = 影響力（PageRank）| 線の太さ = 関係の強さ
              </p>
            </div>
          )}
          {!data && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">🕸️</div>
                <p className="text-gray-400 mb-2">CSVファイルをドラッグ＆ドロップ</p>
                <p className="text-gray-600 text-sm">from, to, weight 形式</p>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900/50 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {(['keyPerson', 'bridge', 'stats'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
                  tab === t
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-gray-900/50'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t === 'keyPerson' ? '👑 キーマン' : t === 'bridge' ? '🌉 ブリッジ' : '📊 統計'}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Selected Node Info */}
            {selectedNode && (
              <Card className="bg-gray-800/50 border-gray-700 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: DEPT_COLORS[selectedNode.group] || DEPT_COLORS['その他'] }}
                    />
                    <span className="text-white font-semibold text-sm">{selectedNode.id}</span>
                    <Badge variant="secondary" className="text-[10px]">{selectedNode.group}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xs text-gray-500">PageRank</div>
                      <div className="text-sm font-bold text-indigo-400">{selectedNode.pageRank.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">ブリッジ度</div>
                      <div className="text-sm font-bold text-purple-400">{selectedNode.betweenness.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">接続数</div>
                      <div className="text-sm font-bold text-emerald-400">{selectedNode.connections}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Person Ranking */}
            {tab === 'keyPerson' && (
              <div className="space-y-2">
                <h3 className="text-xs text-gray-400 font-medium mb-3">
                  影響力ランキング（PageRank）
                </h3>
                {sortedByPageRank.map((node, i) => (
                  <div
                    key={node.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedNode(node)}
                  >
                    <span className={`text-sm font-bold w-6 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                      {i + 1}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: DEPT_COLORS[node.group] || DEPT_COLORS['その他'] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{node.id}</div>
                      <div className="text-xs text-gray-500">{node.group}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-indigo-400">{node.pageRank.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bridge Ranking */}
            {tab === 'bridge' && (
              <div className="space-y-2">
                <h3 className="text-xs text-gray-400 font-medium mb-3">
                  ブリッジ役ランキング（媒介中心性）
                </h3>
                {sortedByBetweenness.map((node, i) => (
                  <div
                    key={node.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedNode(node)}
                  >
                    <span className={`text-sm font-bold w-6 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                      {i + 1}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: DEPT_COLORS[node.group] || DEPT_COLORS['その他'] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{node.id}</div>
                      <div className="text-xs text-gray-500">{node.group}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-purple-400">{node.betweenness.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {tab === 'stats' && data && (
              <div className="space-y-4">
                <h3 className="text-xs text-gray-400 font-medium mb-3">ネットワーク統計</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{data.nodes.length}</div>
                    <div className="text-xs text-gray-500">ノード数</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{data.links.length}</div>
                    <div className="text-xs text-gray-500">エッジ数</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{departments.length}</div>
                    <div className="text-xs text-gray-500">部門数</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">
                      {data.nodes.length > 0 ? (data.links.length * 2 / data.nodes.length).toFixed(1) : '0'}
                    </div>
                    <div className="text-xs text-gray-500">平均接続数</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-gray-400 font-medium mb-2">部門別人数</h4>
                  {departments.map(dept => {
                    const count = data.nodes.filter(n => n.group === dept).length
                    return (
                      <div key={dept} className="flex items-center gap-2 py-1.5">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: DEPT_COLORS[dept] || DEPT_COLORS['その他'] }}
                        />
                        <span className="text-sm text-gray-300 flex-1">{dept}</span>
                        <span className="text-sm font-mono text-gray-400">{count}人</span>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                  <h4 className="text-xs text-gray-400 font-medium mb-2">💡 読み方ガイド</h4>
                  <ul className="text-xs text-gray-500 space-y-1.5">
                    <li>• ノードが大きい → 組織全体への影響力が高い</li>
                    <li>• 線が太い → 関係が強い（やり取りが多い）</li>
                    <li>• ブリッジ度が高い → 部門間の情報ハブ</li>
                    <li>• ノードをクリックで接続を強調表示</li>
                    <li>• ドラッグでノード移動、スクロールでズーム</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
