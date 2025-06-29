"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ProjectionForm } from "./projection-form"

interface ProjectionCardProps {
  projection: any
  debts: any[]
  incomes: any[]
  onUpdate: (id: string, updates: any) => void
  onDelete: (id: string) => void
}

export function ProjectionCard({ projection, debts, incomes, onUpdate, onDelete }: ProjectionCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const totalToReceive = projection.debtsToReceive?.reduce((sum: number, debt: any) => sum + debt.amount, 0) || 0
  const totalToPay = projection.debtsToPayy?.reduce((sum: number, debt: any) => sum + debt.amount, 0) || 0
  const balance = totalToReceive - totalToPay

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{projection.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(projection.month + "-01"), "MMMM yyyy", { locale: es })}
            </p>
          </div>
          <div className="flex gap-1">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <ProjectionForm
                  debts={debts}
                  incomes={incomes}
                  initialData={projection}
                  onSubmit={(data: any) => {
                    onUpdate(projection.id, data)
                    setIsEditOpen(false)
                  }}
                  onCancel={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={() => onDelete(projection.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">A Cobrar</span>
            </div>
            <div className="text-xl font-bold text-green-600">${totalToReceive.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{projection.debtsToReceive?.length || 0} elementos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">A Pagar</span>
            </div>
            <div className="text-xl font-bold text-red-600">${totalToPay.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{projection.debtsToPayy?.length || 0} elementos</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Balance Esperado</p>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${balance.toLocaleString()}
            </div>
            <Badge className={balance >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {balance >= 0 ? "Superávit" : "Déficit"}
            </Badge>
          </div>
        </div>

        {projection.notes && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Notas:</strong> {projection.notes}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Creado: {format(new Date(projection.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
        </div>
      </CardContent>
    </Card>
  )
}
