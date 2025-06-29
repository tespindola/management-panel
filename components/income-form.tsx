"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface IncomeFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export function IncomeForm({ onSubmit, onCancel, initialData }: IncomeFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    expectedDate: "",
    category: "",
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
        <DialogTitle>{initialData ? "Editar Ingreso" : "Agregar Nuevo Ingreso"}</DialogTitle>
        <DialogDescription>Registra un ingreso esperado</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label>Descripción</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <Label>Fecha Esperada</Label>
            <Input
              type="date"
              value={formData.expectedDate}
              onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
              required
            />
          </div>
        </div>

        <Label>Categoría</Label>
        <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />

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
