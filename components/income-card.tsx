"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { IncomeForm } from "./income-form"

export function IncomeCard({ income, onUpdate, onDelete }: any) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-base">{income.description}</CardTitle>
            <CardDescription>{income.category}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <IncomeForm
                  initialData={income}
                  onSubmit={(data: any) => {
                    onUpdate(income.id, data)
                    setIsEditOpen(false)
                  }}
                  onCancel={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="ghost" onClick={() => onDelete(income.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-blue-600">${income.amount.toLocaleString()}</div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {format(new Date(income.expectedDate), "dd/MM/yyyy", { locale: es })}
            </span>
            <Badge
              className={income.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
            >
              {income.status === "pending" ? "Pendiente" : "Recibido"}
            </Badge>
          </div>
          {income.status === "pending" && (
            <Button size="sm" className="w-full" onClick={() => onUpdate(income.id, { status: "received" })}>
              Marcar como Recibido
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
