"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface DebtFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export function DebtForm({ onSubmit, onCancel, initialData }: DebtFormProps) {
  const [formData, setFormData] = useState({
    type: "payable",
    description: "",
    amount: "",
    dueDate: "",
    category: "",
    notes: "",
    status: "pending",
    ...initialData,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, amount: Number.parseFloat(formData.amount) })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? "Editar Deuda" : "Agregar Nueva Deuda"}</DialogTitle>
        <DialogDescription>Completa la información de la deuda</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <select
              className="border rounded-md p-2 w-full"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="receivable">Por Cobrar</option>
              <option value="payable">Por Pagar</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Monto</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descripción</Label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fecha de Vencimiento</Label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Préstamo, Servicio…"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notas</Label>
          <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? "Actualizar" : "Agregar"}</Button>
        </DialogFooter>
      </form>
    </>
  )
}
